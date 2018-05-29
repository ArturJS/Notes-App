import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { compose, pure, withHandlers } from 'recompose';
import _ from 'lodash';
import * as modalActions from './modal.actions';
import { MODAL_TYPES } from './modal.provider';
import './modal-dialog.scss';

const noBackdropStyle = {
    overlay: {
        backgroundColor: 'transparent',
        pointerEvents: 'none',
        zIndex: 1080
    }
};

const mapStateToProps = state => ({
    modalStack: state.modalStack
});

const mapDispatchToProps = dispatch => ({
    modalActions: bindActionCreators(modalActions, dispatch)
});

const enhance = compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        close: props => event => {
            const { id } = event.target.dataset;

            props.modalActions.closeModal({
                id,
                reason: true
            });
        },

        dismiss: props => event => {
            const { id } = event.target.dataset;

            props.modalActions.closeModal({
                id,
                reason: false
            });
        },
        renderModalBody: () => modal => {
            const isArrayOfStrings = _.isArray(modal.body);

            return (
                <Fragment>
                    {isArrayOfStrings
                        ? _.map(modal.body, item => <p key={item}>{item}</p>)
                        : modal.body}
                </Fragment>
            );
        }
    }),
    withHandlers({
        renderCustomType: ({ renderModalBody }) => modal => (
            <div className="modal-custom-body">{renderModalBody(modal)}</div>
        ),
        renderStandardType: ({ renderModalBody, close, dismiss }) => modal => (
            <div>
                <div className="modal-body">{renderModalBody(modal)}</div>
                <div className="modal-footer">
                    <button
                        className="btn btn-primary btn-ok"
                        type="button"
                        data-id={modal.id}
                        onClick={close}
                    >
                        Ok
                    </button>
                    {modal.type === MODAL_TYPES.confirm && (
                        <button
                            className="btn btn-default btn-cancel"
                            type="button"
                            data-id={modal.id}
                            onClick={dismiss}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </div>
        )
    }),
    pure
);

const ModalDialog = ({
    modalStack,
    dismiss,
    renderCustomType,
    renderStandardType
}) => (
    <Fragment>
        {modalStack.map(modal => (
            <Modal
                key={modal.id}
                isOpen
                onRequestClose={dismiss}
                style={modal.noBackdrop ? noBackdropStyle : {}}
                className={`modal ${modal.className}`}
                shouldCloseOnOverlayClick={modal.shouldCloseOnOverlayClick}
                contentLabel=""
            >
                <div className="modal-content">
                    <button
                        type="button"
                        className="close"
                        data-id={modal.id}
                        onClick={dismiss}
                    >
                        &times;
                    </button>
                    <div className="modal-header">
                        <h3 className="modal-title">{modal.title}</h3>
                    </div>
                    {modal.type === MODAL_TYPES.custom &&
                        renderCustomType(modal)}
                    {modal.type !== MODAL_TYPES.custom &&
                        renderStandardType(modal)}
                </div>
            </Modal>
        ))}
    </Fragment>
);

ModalDialog.propTypes = {
    modalStack: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            body: PropTypes.oneOfType([
                PropTypes.string.isRequired,
                PropTypes.arrayOf(PropTypes.string.isRequired).isRequired
            ]).isRequired,
            type: PropTypes.string.isRequired,
            close: PropTypes.func.isRequired,
            className: PropTypes.string.isRequired,
            shouldCloseOnOverlayClick: PropTypes.bool.isRequired,
            noBackdrop: PropTypes.bool.isRequired
        }).isRequired
    ).isRequired,
    // eslint-disable-next-line react/no-unused-prop-types
    modalActions: PropTypes.shape({
        closeModal: PropTypes.func.isRequired
    }).isRequired,
    dismiss: PropTypes.func.isRequired,
    renderCustomType: PropTypes.func.isRequired,
    renderStandardType: PropTypes.func.isRequired
};

export default enhance(ModalDialog);
