import _ from 'lodash';
import { BEGIN, COMMIT, REVERT } from 'redux-optimistic-ui';

let currentTransactionID = 0;

const generateNextTransactionID = () => {
    currentTransactionID += 1;

    return currentTransactionID;
};
const getCurrentTransactionID = () => currentTransactionID;

export default () => next => action => {
    if (!action.meta || action.meta.synced !== false) {
        // skip non-document actions
        // or changes received from DB (supersedes optimism)
        return next(action);
    }

    const { type, meta } = action;

    if (!meta.isOptimistic) {
        // if we don't want to optimistically update
        // (for actions with high % of failure)
        return next(action);
    }

    const isRequestAction = _.endsWith(type, '_REQUEST');
    const transactionID = isRequestAction
        ? generateNextTransactionID()
        : getCurrentTransactionID();

    if (isRequestAction) {
        // execute optimistic update
        return next({
            ...action,
            meta: {
                optimistic: {
                    type: BEGIN,
                    id: transactionID
                }
            }
        });
    } else if (_.endsWith(type, '_SUCCESS')) {
        // commit changes
        return next({
            ...action,
            meta: {
                synced: true,
                optimistic: {
                    type: COMMIT,
                    id: transactionID
                }
            }
        });
    } else if (_.endsWith(type, '_FAILURE')) {
        // revert changes
        return next({
            ...action,
            meta: {
                synced: true,
                optimistic: {
                    type: REVERT,
                    id: transactionID
                }
            }
        });
    }

    return next(action);
};
