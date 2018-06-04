import _ from 'lodash';
import { createActions } from 'redux-actions';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL_REQUEST = 'CLOSE_MODAL_REQUEST';
export const CLOSE_MODAL_SUCCESS = 'CLOSE_MODAL_SUCCESS';
export const CLOSE_ALL_MODALS_REQUEST = 'CLOSE_ALL_MODALS_REQUEST';
export const CLOSE_ALL_MODALS_SUCCESS = 'CLOSE_ALL_MODALS_SUCCESS';
export const {
    openModal,
    closeModalRequest,
    closeModalSuccess,
    closeAllModalsRequest,
    closeAllModalsSuccess
} = createActions({
    [OPEN_MODAL]: modalInstance => ({
        modalInstance
    }),
    [CLOSE_MODAL_REQUEST]: ({ id, reason }) => ({
        id,
        reason
    }),
    [CLOSE_MODAL_SUCCESS]: id => ({ id }),
    [CLOSE_ALL_MODALS_REQUEST]: ({ reason }) => ({ reason }),
    [CLOSE_ALL_MODALS_SUCCESS]: _.noop
});
