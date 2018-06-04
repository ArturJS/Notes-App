import { handleActions } from 'redux-actions';
import produce from 'immer';
import {
    OPEN_MODAL,
    CLOSE_MODAL_REQUEST,
    CLOSE_MODAL_SUCCESS,
    CLOSE_ALL_MODALS_REQUEST,
    CLOSE_ALL_MODALS_SUCCESS
} from './modal.actions';

const initialState = [];

/* eslint-disable no-param-reassign */
const modalReducer = handleActions(
    {
        [OPEN_MODAL]: (state, { payload }) =>
            produce(state, draftState => {
                draftState.push(payload.modalInstance);
            }),
        [CLOSE_MODAL_REQUEST]: (state, { payload }) =>
            produce(state, draftState => {
                const { id, reason } = payload;
                const relatedModal = draftState.find(modal => modal.id === id);

                if (relatedModal) {
                    relatedModal.isOpen = false;

                    if (relatedModal.close) {
                        relatedModal.close(reason);
                    }
                }
            }),
        [CLOSE_MODAL_SUCCESS]: (state, { payload }) =>
            produce(state, draftState => {
                const { id } = payload;

                return draftState.filter(modal => modal.id !== id);
            }),
        [CLOSE_ALL_MODALS_REQUEST]: (state, { payload }) =>
            produce(state, draftState => {
                const { reason } = payload;

                draftState.forEach(modal => {
                    modal.isOpen = false;

                    if (modal.close) {
                        modal.close(reason);
                    }
                });
            }),
        [CLOSE_ALL_MODALS_SUCCESS]: () => []
    },
    initialState
);
/* eslint-enable no-param-reassign */

export default modalReducer;
