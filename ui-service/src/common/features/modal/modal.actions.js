import { createActions } from 'redux-actions';

export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const CLOSE_ALL_MODALS = 'CLOSE_ALL_MODALS';
export const { openModal, closeModal, closeAllModals } = createActions({
    [OPEN_MODAL]: modalInstance => ({
        modalInstance
    }),
    [CLOSE_MODAL]: ({ id, reason }) => ({
        id,
        reason
    }),
    [CLOSE_ALL_MODALS]: ({ reason }) => ({
        reason
    })
});
