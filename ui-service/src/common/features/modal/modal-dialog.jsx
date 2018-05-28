import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Modal from 'react-modal';
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

class ModalDialog extends Component {
    static propTypes = {
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
        modalActions: PropTypes.shape({
            closeModal: PropTypes.func.isRequired
        }).isRequired
    };

    close = event => {
        const { id } = event.target.dataset;

        this.props.modalActions.closeModal({
            id,
            reason: true
        });
    };

    dismiss = event => {
        const { id } = event.target.dataset;

        this.props.modalActions.closeModal({
            id,
            reason: false
        });
    };

    renderModalBody = modal => {
        const isArrayOfStrings = _.isArray(modal.body);

        return (
            <Fragment>
                {isArrayOfStrings
                    ? _.map(modal.body, item => <p key={item}>{item}</p>)
                    : modal.body}
            </Fragment>
        );
    };

    renderCustomType = modal => (
        <div className="modal-custom-body">{this.renderModalBody(modal)}</div>
    );

    renderStandardType = modal => (
        <div>
            <div className="modal-body">{this.renderModalBody(modal)}</div>
            <div className="modal-footer">
                <button
                    className="btn btn-primary btn-ok"
                    type="button"
                    data-id={modal.id}
                    onClick={this.close}
                >
                    Ok
                </button>
                {modal.type === MODAL_TYPES.confirm && (
                    <button
                        className="btn btn-default btn-cancel"
                        type="button"
                        data-id={modal.id}
                        onClick={this.dismiss}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );

    render() {
        const { modalStack } = this.props;

        return (
            <Fragment>
                {modalStack.map(modal => (
                    <Modal
                        key={modal.id}
                        isOpen
                        onRequestClose={this.dismiss}
                        style={modal.noBackdrop ? noBackdropStyle : {}}
                        className={`modal ${modal.className}`}
                        shouldCloseOnOverlayClick={
                            modal.shouldCloseOnOverlayClick
                        }
                        contentLabel=""
                    >
                        <div className="modal-content">
                            <button
                                type="button"
                                className="close"
                                data-id={modal.id}
                                onClick={this.dismiss}
                            >
                                &times;
                            </button>
                            <div className="modal-header">
                                <h3 className="modal-title">{modal.title}</h3>
                            </div>
                            {modal.type === MODAL_TYPES.custom &&
                                this.renderCustomType(modal)}
                            {modal.type !== MODAL_TYPES.custom &&
                                this.renderStandardType(modal)}
                        </div>
                    </Modal>
                ))}
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalDialog);
