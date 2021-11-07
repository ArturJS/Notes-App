import {
    OPEN_MODAL,
    CLOSE_MODAL_REQUEST,
    CLOSE_MODAL_SUCCESS,
    CLOSE_ALL_MODALS_REQUEST,
    CLOSE_ALL_MODALS_SUCCESS,
    openModal,
    closeModalRequest,
    closeModalSuccess,
    closeAllModalsRequest,
    closeAllModalsSuccess
} from '../modal.actions';

describe('modal.actions.js', () => {
    it('should export correct action types', () => {
        expect([
            OPEN_MODAL,
            CLOSE_MODAL_REQUEST,
            CLOSE_MODAL_SUCCESS,
            CLOSE_ALL_MODALS_REQUEST,
            CLOSE_ALL_MODALS_SUCCESS
        ]).toEqual([
            'OPEN_MODAL',
            'CLOSE_MODAL_REQUEST',
            'CLOSE_MODAL_SUCCESS',
            'CLOSE_ALL_MODALS_REQUEST',
            'CLOSE_ALL_MODALS_SUCCESS'
        ]);
    });

    describe('"openModal" action creator', () => {
        it('should return object with correct "type"', () => {
            const modalInstance = 'modalInstance';

            expect(openModal(modalInstance)).toEqual({
                type: OPEN_MODAL,
                payload: {
                    modalInstance
                }
            });
        });
    });

    describe('"closeModalRequest" action creator', () => {
        it('should return object with correct "type"', () => {
            const extraInfo = {
                extraField: 'extraValue'
            };
            const payload = {
                id: 'modalId_123',
                reason: 'some test reason'
            };
            const result = closeModalRequest({
                ...payload,
                ...extraInfo
            });

            expect(result).toEqual({
                type: CLOSE_MODAL_REQUEST,
                payload
            });
        });
    });

    describe('"closeModalSuccess" action creator', () => {
        it('should return object with correct "type"', () => {
            const result = closeModalSuccess(123);

            expect(result).toEqual({
                type: CLOSE_MODAL_SUCCESS,
                payload: {
                    id: 123
                }
            });
        });
    });

    describe('"closeAllModalsRequest" action creator', () => {
        it('should return object with correct "type"', () => {
            const extraInfo = {
                extraField: 'extraValue'
            };
            const payload = {
                reason: 'some test reason'
            };
            const result = closeAllModalsRequest({
                ...payload,
                ...extraInfo
            });

            expect(result).toEqual({
                type: CLOSE_ALL_MODALS_REQUEST,
                payload
            });
        });
    });

    describe('"closeAllModalsSuccess" action creator', () => {
        it('should return object with correct "type"', () => {
            const result = closeAllModalsSuccess();

            expect(result).toEqual({
                type: CLOSE_ALL_MODALS_SUCCESS
            });
        });
    });
});
