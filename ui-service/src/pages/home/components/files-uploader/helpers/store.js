// @flow
import { Observer } from '@common/utils/design-pattern.utils';

type TSubscriber = (state: Object, changed: string[]) => void;
type TUnsubscribe = () => void;

export interface IStore {
    constructor(initialState: Object): IStore;

    subscribe(callback: TSubscriber): TUnsubscribe;

    getState(): Object;

    setState(nextState: Object): void;
}

class Store implements IStore {
    constructor(initialState) {
        this._state = initialState;
        this._observer = new Observer();
    }

    subscribe(callback) {
        // eslint-disable-next-line no-underscore-dangle
        this._observer.subscribe(callback);

        return () => {
            // eslint-disable-next-line no-underscore-dangle
            this._observer.unsubscribe(callback);
        };
    }

    getState() {
        return this._state;
    }

    setState(nextStateOrUpdateFn) {
        const nextState = this._extractNextState(nextStateOrUpdateFn);

        if (!nextState) {
            // eslint-disable-next-line no-console
            console.error(
                [
                    '`setState` method waiting for object or function but got: ',
                    `value: ${nextStateOrUpdateFn}`,
                    `typeof: ${typeof nextStateOrUpdateFn}`
                ].join('')
            );

            return;
        }

        this._mergeNextState(nextState);

        const changed = Object.keys(nextState);

        this._notifySubscribers(this.getState(), changed);
    }

    _notifySubscribers(state, changed) {
        // eslint-disable-next-line no-underscore-dangle
        this._observer.trigger(state, changed);
    }

    _extractNextState(nextStateOrUpdateFn) {
        if (typeof nextStateOrUpdateFn === 'function') {
            const updateFn = nextStateOrUpdateFn;
            const nextState = updateFn(this.getState());

            return nextState;
        }

        if (nextStateOrUpdateFn && typeof nextStateOrUpdateFn === 'object') {
            const nextState = nextStateOrUpdateFn;

            return nextState;
        }

        return null;
    }

    _mergeNextState(nextState) {
        this._state = {
            ...this._state,
            ...nextState
        };
    }
}

export const createStore = initialState => new Store(initialState);
