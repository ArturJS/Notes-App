import Cache from 'lru-cache';

const MAX_CACHE_SIZE = 1024 * 1024 * 10; // 10 megabytes
const DISPOSE_OLD_CACHE_INTERVAL_MS = 1000 * 60 * 10; // 10 minutes

class CacheProvider {
    constructor() {
        this._cache = new Cache({
            max: MAX_CACHE_SIZE,
            updateAgeOnGet: true,
            length(value) {
                return JSON.stringify(value).length;
            }
        });

        this._initDisposeInterval();
    }

    // `async` due to posibility of switching to redis
    async get(key) {
        return this._cache.get(key);
    }

    // returns `true` only if cached successfuly
    async set(key, value, maxAge) {
        return this._cache.set(key, value, maxAge);
    }

    async del(key) {
        this._cache.del(key);
    }

    _initDisposeInterval() {
        setInterval(() => {
            this._cache.prune();
        }, DISPOSE_OLD_CACHE_INTERVAL_MS);
    }
}

export const cacheProvider = new CacheProvider();
