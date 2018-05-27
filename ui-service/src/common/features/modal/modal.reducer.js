import { handleActions } from 'redux-actions';
import produce from 'immer';
import { OPEN_MODAL, CLOSE_MODAL, CLOSE_ALL_MODALS } from './modal.actions';

const initialState = [];

/* eslint-disable no-param-reassign */
const modalReducer = handleActions(
    {
        [OPEN_MODAL]: (state, { payload }) =>
            produce(state, draftState => {
                draftState.push(payload.modalInstance);
            }),
        [CLOSE_MODAL]: (state, { payload }) =>
            produce(state, draftState => {
                const { id, reason } = payload;
                const relatedModal = draftState.find(modal => modal.id === id);

                if (relatedModal && relatedModal.close) {
                    relatedModal.close(reason);
                }

                return draftState.filter(modal => modal.id !== id);
            }),
        [CLOSE_ALL_MODALS]: (state, { payload }) =>
            produce(state, draftState => {
                const { reason } = payload;

                draftState.forEach(modal => {
                    if (modal.close) {
                        modal.close(reason);
                    }
                });

                return [];
            })
    },
    initialState
);
/* eslint-enable no-param-reassign */

export default modalReducer;
