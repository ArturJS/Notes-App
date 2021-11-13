import modalReducer from '../modal.reducer';

jest.mock('../modal.actions', () => ({
    OPEN_MODAL: 'OPEN_MODAL',
    CLOSE_MODAL_REQUEST: 'CLOSE_MODAL_REQUEST',
    CLOSE_MODAL_SUCCESS: 'CLOSE_MODAL_SUCCESS',
    CLOSE_ALL_MODALS_REQUEST: 'CLOSE_ALL_MODALS_REQUEST',
    CLOSE_ALL_MODALS_SUCCESS: 'CLOSE_ALL_MODALS_SUCCESS'
}));

// eslint-disable-next-line import/first
import {
    OPEN_MODAL,
    CLOSE_MODAL_REQUEST,
    CLOSE_MODAL_SUCCESS,
    CLOSE_ALL_MODALS_REQUEST,
    CLOSE_ALL_MODALS_SUCCESS
} from '../modal.actions';

describe('modal.reducer.js', () => {
    describe('OPEN_MODAL action', () => {
        it('should correctly process OPEN_MODAL action', () => {
            expect(
                modalReducer([], {
                    type: OPEN_MODAL,
                    payload: {
                        modalInstance: 'modalInstance'
                    }
                })
            ).toEqual(['modalInstance']);
        });
    });

    describe('CLOSE_MODAL_REQUEST action', () => {
        it('should correctly process CLOSE_MODAL_REQUEST action', () => {
            const modals = [
                {
                    id: '1',
                    close: jest.fn()
                },
                {
                    id: '2',
                    close: jest.fn()
                }
            ];
            const result = modalReducer([...modals], {
                type: CLOSE_MODAL_REQUEST,
                payload: {
                    id: '1',
                    reason: 'some test reason'
                }
            });

            expect(result).toEqual([
                {
                    ...modals[0],
                    isOpen: false
                },
                modals[1]
            ]);
            expect(modals[0].close).toHaveBeenCalledWith('some test reason');
            expect(modals[1].close).not.toHaveBeenCalled();
        });
    });

    describe('CLOSE_MODAL_SUCCESS action', () => {
        it('should correctly process CLOSE_MODAL_SUCCESS action', () => {
            const modals = [
                {
                    id: '1',
                    close: jest.fn()
                },
                {
                    id: '2',
                    close: jest.fn()
                }
            ];
            const result = modalReducer([...modals], {
                type: CLOSE_MODAL_SUCCESS,
                payload: {
                    id: '1'
                }
            });

            expect(result).toEqual([modals[1]]);
        });
    });

    describe('CLOSE_ALL_MODALS_REQUEST action', () => {
        it('should correctly process CLOSE_ALL_MODALS_REQUEST action', () => {
            const modals = [
                {
                    id: '1',
                    close: jest.fn()
                },
                {
                    id: '2',
                    close: jest.fn()
                }
            ];
            const result = modalReducer([...modals], {
                type: CLOSE_ALL_MODALS_REQUEST,
                payload: {
                    reason: 'ASAP!!!!'
                }
            });
            const expectedResult = modals.map(modal => ({
                ...modal,
                isOpen: false
            }));

            expect(result).toEqual(expectedResult);
            expect(modals[0].close).toHaveBeenCalledWith('ASAP!!!!');
            expect(modals[1].close).toHaveBeenCalledWith('ASAP!!!!');
        });
    });

    describe('CLOSE_ALL_MODALS_SUCCESS action', () => {
        it('should correctly process CLOSE_ALL_MODALS_SUCCESS action', () => {
            const modals = [
                {
                    id: '1',
                    close: jest.fn()
                },
                {
                    id: '2',
                    close: jest.fn()
                }
            ];
            const result = modalReducer([...modals], {
                type: CLOSE_ALL_MODALS_SUCCESS
            });

            expect(result).toEqual([]);
        });
    });
});
