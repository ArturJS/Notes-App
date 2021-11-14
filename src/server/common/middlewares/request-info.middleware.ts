import { AsyncLocalStorage } from 'async_hooks';
import shortid from 'shortid';

export const asyncLocalStorage = new AsyncLocalStorage();

export const requestInfoMiddleware = async (ctx, next) => {
    const store = {
        traceId: shortid.generate(),
        ip: ctx.request.ip
    };

    return new Promise((resolve, reject) => {
        asyncLocalStorage.run(store, () => {
            next().then(resolve).catch(reject);
        });
    });
};
