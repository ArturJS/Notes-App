import React from 'react';
import renderer from 'react-test-renderer';

jest.mock('../modal.actions', () => ({
    closeModal: jest.fn()
}));
jest.mock('../auth.actions', () => ({
    closeModal: jest.fn()
}));
jest.mock('react-redux', () => ({
    connect: () => component => component
}));
/* eslint-disable react/prop-types */
jest.mock('react-redux', () => ({
                                    children,
                                    key,
                                    isOpen,
                                    onRequestClose,
                                    style,
                                    className,
                                    shouldCloseOnOverlayClick,
                                    contentLabel,
}) => (
    <div className="react-modal">
        {children}
        <div className="react-modal-props">
            {JSON.stringify({
                key,
                isOpen,
                onRequestClose,
                style,
                className,
                shouldCloseOnOverlayClick,
                contentLabel
            }, (prop, value) => {
                if (typeof value === 'function') {
                    return `function ${prop}`;
                }

                return value;
            }, '    ')}
        </div>
    </div>
));
/* eslint-enable react/prop-types */

/* eslint-disable import/first */
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import * as modalActions from './modal.actions';
import { MODAL_TYPES } from './modal.provider';
import ModalDialog from '../modal-dialog.jsx';
/* eslint-enable import/first */

describe('<ModalDialog />', () => {
    it('renders correctly', () => {
        const modalStack = [

        ];
        const tree = renderer
            .create(
                <ModalDialog />
            )
            .toJSON();
        expect(tree).toMatchSnapshot();
    });
});
