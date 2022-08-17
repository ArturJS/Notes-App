import { cacheProvider } from './cache-provider';

type TArray = Array<any>;
type TConfigParams = {
    methods: Array<{
        name: string;
        refreshCacheAfterCalls: Array<string>;
        maxAge: number;
        paramNumberAsCacheKey: number;
        getParamsForCachedMethod: (
            name: string, // one of `refreshCacheAfterCalls`
            args: TArray // with which arguments it is invoked
        ) => TArray;
    }>;
};

const INVALIDATE_CACHE = Symbol('Invalidate cache');

const difference = (a: TArray, b: TArray) => {
    const s = new Set(b);

    return a.filter((x) => !s.has(x));
};

const uniqueElements = (arr: TArray) => [...new Set(arr)];

const validateParams = ({
    methods,
    classMethods
}: {
    methods: Partial<TConfigParams['methods']>;
    classMethods: Array<string>;
}): void => {
    const allMethodNames = methods
        .map(({ name, refreshCacheAfterCalls }) => [
            name,
            ...refreshCacheAfterCalls
        ])
        .reduce(
            // eslint-disable-next-line no-shadow
            (collectedMethods, methods) => [...collectedMethods, ...methods],
            []
        );
    const allUniqueMethodNames = uniqueElements(allMethodNames);

    const undeclaredMethods = difference(allUniqueMethodNames, classMethods);
    const hasUndeclaredMethods = undeclaredMethods.length > 0;

    if (hasUndeclaredMethods) {
        throw new Error(
            [
                'Invalid usage of `withCache` decorator.',
                'Following method names are absent in wrapped class: ',
                undeclaredMethods.join(', ')
            ].join(' ')
        );
    }
};

const withCaching = ({ wrappedMethod, paramNumberAsCacheKey, maxAge }) => {
    // eslint-disable-next-line no-param-reassign
    wrappedMethod[INVALIDATE_CACHE] = async (key) => cacheProvider.del(key);

    return async function (...args) {
        const key = args[paramNumberAsCacheKey];
        const cachedResult = await cacheProvider.get(key);

        if (cachedResult) {
            return cachedResult;
        }

        const result = await wrappedMethod.apply(this, args);

        cacheProvider.set(key, result, maxAge);

        return result;
    };
};

const withRefreshCache = ({
    wrappedMethod,
    cachedMethod,
    paramNumberAsCacheKey,
    getParamsForCachedMethod
}) =>
    async function (...args) {
        const result = await wrappedMethod.apply(this, args);
        const params = getParamsForCachedMethod(wrappedMethod.name, args);

        // refresh cache
        await cachedMethod[INVALIDATE_CACHE](params[paramNumberAsCacheKey]);
        cachedMethod.apply(this, params);

        return result;
    };

// currently we assume that cached method have only 1 param
// and all `refreshCacheAfterCalls` methods are async functions
const wrapMethods = ({ prototype, methods }) => {
    methods.forEach(
        ({
            name,
            refreshCacheAfterCalls,
            maxAge,
            paramNumberAsCacheKey,
            getParamsForCachedMethod
        }) => {
            refreshCacheAfterCalls.forEach((methodName) => {
                // eslint-disable-next-line no-param-reassign
                prototype[methodName] = withRefreshCache({
                    wrappedMethod: prototype[methodName],
                    cachedMethod: prototype[name],
                    paramNumberAsCacheKey,
                    getParamsForCachedMethod
                });
            });

            // eslint-disable-next-line no-param-reassign
            prototype[name] = withCaching({
                wrappedMethod: prototype[name],
                paramNumberAsCacheKey,
                maxAge
            });
        }
    );
};

export const withCache =
    <T>({ methods }: TConfigParams) =>
    (wrappedClass: T): T => {
        // @ts-ignore
        const { prototype } = wrappedClass;
        const classMethods = Object.getOwnPropertyNames(prototype);

        validateParams({ methods, classMethods });
        wrapMethods({ prototype, methods });

        return wrappedClass;
    };
