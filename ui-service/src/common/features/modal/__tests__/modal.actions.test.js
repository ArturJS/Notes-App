import {
    OPEN_MODAL,
    CLOSE_MODAL,
    CLOSE_ALL_MODALS,
    openModal,
    closeModal,
    closeAllModals
} from '../modal.actions';

describe('modal.actions.js', () => {
    it('should export correct action types', () => {
        expect([OPEN_MODAL, CLOSE_MODAL, CLOSE_ALL_MODALS]).toEqual([
            'OPEN_MODAL',
            'CLOSE_MODAL',
            'CLOSE_ALL_MODALS'
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

    describe('"closeModal" action creator', () => {
        it('should return object with correct "type"', () => {
            const extraInfo = {
                extraField: 'extraValue'
            };
            const payload = {
                id: 'modalId_123',
                reason: 'some test reason'
            };
            const result = closeModal({
                ...payload,
                ...extraInfo
            });

            expect(result).toEqual({
                type: CLOSE_MODAL,
                payload
            });
        });
    });

    describe('"closeAllModals" action creator', () => {
        it('should return object with correct "type"', () => {
            const extraInfo = {
                extraField: 'extraValue'
            };
            const payload = {
                reason: 'some test reason'
            };
            const result = closeAllModals({
                ...payload,
                ...extraInfo
            });

            expect(result).toEqual({
                type: CLOSE_ALL_MODALS,
                payload
            });
        });
    });
});
