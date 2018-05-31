jest.mock('shortid', () => ({
    generate: () => 'test_modal_id'
}));
jest.mock('@common/store', () => ({
    dispatch: jest.fn()
}));
jest.mock('../modal.actions', () => ({
    openModal: jest.fn(() => 'openModal result'),
    closeModal: jest.fn(() => 'closeModal result'),
    closeAllModals: jest.fn(() => 'closeAllModals result')
}));
/* eslint-disable import/first */
import * as modalActions from '../modal.actions';
import store from '@common/store';
import modalProvider, { MODAL_TYPES } from '../modal.provider';
/* eslint-disable import/first */

describe('modal.provider.js', () => {
    beforeEach(() => {
        store.dispatch = jest.fn();
    });

    describe('MODAL_TYPES enum', () => {
        it('should have certain properties', () => {
            expect(MODAL_TYPES).toMatchObject({
                error: 'ERROR_MODAL',
                confirm: 'CONFIRM_MODAL',
                info: 'INFO_MODAL',
                custom: 'CUSTOM_MODAL'
            });
        });
    });

    describe('"showConfirm" method', () => {
        it('should correctly open and close modal', async () => {
            const { result, close } = modalProvider.showConfirm({
                title: 'Test title',
                body: 'Test body',
                className: 'test-class-name'
            });

            expect(store.dispatch).toHaveBeenCalledWith('openModal result');

            const closePayload = {
                reason: 'Some test reason'
            };

            close(closePayload);

            const resultOfClose = await result;

            expect(resultOfClose).toEqual(closePayload);
            expect(modalActions.openModal).toHaveBeenCalledWith({
                id: 'test_modal_id',
                title: 'Test title',
                body: 'Test body',
                type: 'CONFIRM_MODAL',
                className: 'test-class-name',
                close,
                shouldCloseOnOverlayClick: true,
                noBackdrop: false
            });
            expect(modalActions.closeModal).toHaveBeenCalledWith({
                id: 'test_modal_id'
            });
            expect(store.dispatch).toHaveBeenCalledWith('closeModal result');
        });
    });

    describe('"showCustom" method', () => {
        it('should correctly open and close modal', async () => {
            const { result, close } = modalProvider.showCustom({
                title: 'Test title',
                body: 'Test body',
                className: 'test-class-name'
            });

            expect(store.dispatch).toHaveBeenCalledWith('openModal result');

            const closePayload = {
                reason: 'Some test reason'
            };

            close(closePayload);

            const resultOfClose = await result;

            expect(resultOfClose).toEqual(closePayload);
            expect(modalActions.openModal).toHaveBeenCalledWith({
                id: 'test_modal_id',
                title: 'Test title',
                body: 'Test body',
                type: 'CUSTOM_MODAL',
                className: 'test-class-name',
                close,
                shouldCloseOnOverlayClick: true,
                noBackdrop: false
            });
            expect(modalActions.closeModal).toHaveBeenCalledWith({
                id: 'test_modal_id'
            });
            expect(store.dispatch).toHaveBeenCalledWith('closeModal result');
        });
    });

    describe('"closeAll" method', () => {
        it('should dispatch "closeAllModals" request', () => {
            modalProvider.closeAll('ASAP!!!');

            expect(modalActions.closeAllModals).toHaveBeenCalledWith({
                reason: 'ASAP!!!'
            });
            expect(store.dispatch).toHaveBeenCalledWith(
                'closeAllModals result'
            );
        });
    });
});
