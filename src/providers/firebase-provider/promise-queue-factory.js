import PromiseQueue from 'promise-queue/lib/index';

class BasicPromiseQueue extends PromiseQueue {
    constructor({ maxConcurrentPromises, maxQueuedPromises }) {
        super(maxConcurrentPromises, maxQueuedPromises, {
            onEmpty: () => this._trigger('empty')
        });

        this._eventsMap = {};
    }

    _trigger(eventName) {
        if (this._eventsMap[eventName]) {
            this._eventsMap[eventName].forEach(callback => callback());
        }
    }

    on(eventName, callback) {
        if (!this._eventsMap[eventName]) {
            this._eventsMap[eventName] = [];
        }

        this._eventsMap[eventName].push(callback);
    }

    off(eventName, callback) {
        if (this._eventsMap[eventName]) {
            this._eventsMap[eventName] = this._eventsMap[eventName].filter(
                cb => cb !== callback
            );
        }
    }
}

export default class PromiseQueueFactory {
    static createPromiseQueue({
        maxConcurrentPromises = 1,
        maxQueuedPromises = Infinity
    } = {}) {
        return new BasicPromiseQueue({
            maxConcurrentPromises,
            maxQueuedPromises
        });
    }
}
