import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

/* eslint-disable react/prop-types */
jest.mock(
    'react-modal',
    () => ({
        children,
        isOpen,
        onRequestClose,
        style,
        className,
        shouldCloseOnOverlayClick,
        contentLabel
    }) => (
        <div className="react-modal">
            {children}
            <div className="react-modal-props">
                {JSON.stringify(
                    {
                        isOpen,
                        onRequestClose,
                        style,
                        className,
                        shouldCloseOnOverlayClick,
                        contentLabel
                    },
                    (prop, value) => {
                        if (typeof value === 'function') {
                            return `function ${prop}`;
                        }

                        return value;
                    },
                    '    '
                )}
            </div>
        </div>
    )
);
jest.mock('react-transition-group', () => ({
    CSSTransition: ({children, ...restProps}) => (
        <div className="css-transition">
            <div className="props">
                {JSON.stringify(
                    restProps,
                    (prop, value) => {
                        if (typeof value === 'function') {
                            return `function ${prop}`;
                        }

                        return value;
                    },
                    '    '
                )}
            </div>
            {children}
        </div>
    ),
    TransitionGroup: ({children}) => (
        <div className="transition-group">
            {children}
        </div>
    )
}));
/* eslint-enable react/prop-types */
jest.mock('redux', () => ({
    bindActionCreators: jest.fn(actions => actions)
}));
jest.mock('react-redux', () => {
    const reactRedux = {
        connect: jest.fn((mapStateToProps, mapDispatchToProps) => {
            const state = {
                modalStack: 'modalStack',
                extraProperty: 'extraProperty'
            };

            mapStateToProps(state);

            // eslint-disable-next-line no-underscore-dangle
            reactRedux.connect._returnedValueOf = {
                mapStateToProps: mapStateToProps(state),
                mapDispatchToProps: mapDispatchToProps('dispatch')
            };

            return component => component;
        })
    };

    return reactRedux;
});
/* eslint-disable-next-line react/prop-types */
jest.mock('../../modal.actions', () => ({
    closeModalRequest: jest.fn()
}));
jest.mock('../../modal.provider', () => ({
    MODAL_TYPES: {
        error: 'ERROR_MODAL',
        confirm: 'CONFIRM_MODAL',
        info: 'INFO_MODAL',
        custom: 'CUSTOM_MODAL'
    }
}));

/* eslint-disable import/first */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as modalActions from '../../modal.actions';
import { MODAL_TYPES } from '../../modal.provider';
import ModalDialog from '../modal-dialog.jsx';
/* eslint-enable import/first */

describe('<ModalDialog />', () => {
    it('renders correctly CONFIRM_MODAL and CUSTOM_MODAL', () => {
        const modalStack = [
            {
                id: '1',
                title: 'first modal',
                body: 'first modal body',
                type: MODAL_TYPES.confirm,
                close: () => {},
                className: 'test-confirm-modal-class',
                shouldCloseOnOverlayClick: true,
                noBackdrop: false,
                isOpen: true
            },
            {
                id: '2',
                title: 'second modal',
                body: 'second modal body',
                type: MODAL_TYPES.custom,
                close: () => {},
                className: 'test-custom-modal-class',
                shouldCloseOnOverlayClick: false,
                noBackdrop: true,
                isOpen: true
            }
        ];
        const tree = renderer
            .create(
                <ModalDialog
                    modalStack={modalStack}
                    modalActions={modalActions}
                />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly modal body as array of strings', () => {
        const modalStack = [
            {
                id: '1',
                title: 'first modal',
                body: ['body item 1', 'body item 2', 'body item 3'],
                type: MODAL_TYPES.confirm,
                close: () => {},
                className: 'test-confirm-modal-class',
                shouldCloseOnOverlayClick: true,
                noBackdrop: false,
                isOpen: true
            }
        ];
        const wrapper = mount(
            <ModalDialog modalStack={modalStack} modalActions={modalActions} />
        );

        expect(wrapper.find('.modal-body p')).toHaveLength(3);
    });

    describe('redux connect', () => {
        it('should correctly use `bindActionCreators`', () => {
            expect(bindActionCreators).toHaveBeenCalledWith(
                modalActions,
                'dispatch'
            );
        });

        it('should correctly implement `mapStateToProps` method', () => {
            // eslint-disable-next-line no-underscore-dangle
            expect(connect._returnedValueOf.mapStateToProps).toEqual({
                modalStack: 'modalStack'
            });
        });

        it('should correctly implement `mapDispatchToProps` method', () => {
            // eslint-disable-next-line no-underscore-dangle
            expect(connect._returnedValueOf.mapDispatchToProps).toEqual({
                modalActions
            });
        });
    });

    describe('`close` method', () => {
        it('should invoke `close` method on [Ok] button click', () => {
            const modalStack = [
                {
                    id: '1',
                    title: 'first modal',
                    body: 'first modal',
                    type: MODAL_TYPES.confirm,
                    close: () => {},
                    className: 'test-confirm-modal-class',
                    shouldCloseOnOverlayClick: true,
                    noBackdrop: false,
                    isOpen: true
                }
            ];

            modalActions.closeModal = jest.fn();

            const wrapper = mount(
                <ModalDialog
                    modalStack={modalStack}
                    modalActions={modalActions}
                />
            );

            wrapper.find('.modal-footer .btn-ok').simulate('click');

            expect(modalActions.closeModalRequest).toHaveBeenCalledWith({
                id: '1',
                reason: true
            });
        });
    });

    describe('`dismiss` method', () => {
        it('should invoke `dismiss` method on [Cancel] button click', () => {
            const modalStack = [
                {
                    id: '1',
                    title: 'first modal',
                    body: 'first modal',
                    type: MODAL_TYPES.confirm,
                    close: () => {},
                    className: 'test-confirm-modal-class',
                    shouldCloseOnOverlayClick: true,
                    noBackdrop: false,
                    isOpen: true
                }
            ];

            modalActions.closeModalRequest = jest.fn();

            const wrapper = mount(
                <ModalDialog
                    modalStack={modalStack}
                    modalActions={modalActions}
                />
            );

            wrapper.find('.modal-footer .btn-cancel').simulate('click');

            expect(modalActions.closeModalRequest).toHaveBeenCalledWith({
                id: '1',
                reason: false
            });
        });

        it('should invoke `dismiss` method on [X] button click', () => {
            const modalStack = [
                {
                    id: '1',
                    title: 'first modal',
                    body: 'first modal',
                    type: MODAL_TYPES.confirm,
                    close: () => {},
                    className: 'test-confirm-modal-class',
                    shouldCloseOnOverlayClick: true,
                    noBackdrop: false,
                    isOpen: true
                }
            ];

            modalActions.closeModalRequest = jest.fn();

            const wrapper = mount(
                <ModalDialog
                    modalStack={modalStack}
                    modalActions={modalActions}
                />
            );

            wrapper.find('.modal-content .close').simulate('click');

            expect(modalActions.closeModalRequest).toHaveBeenCalledWith({
                id: '1',
                reason: false
            });
        });
    });
});
