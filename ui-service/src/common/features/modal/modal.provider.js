import shortid from 'shortid';
import store from '@common/store';
import * as modalActions from './modal.actions';

export const MODAL_TYPES = {
    error: 'ERROR_MODAL',
    confirm: 'CONFIRM_MODAL',
    info: 'INFO_MODAL',
    custom: 'CUSTOM_MODAL'
};

class Modal {
    constructor({
        id,
        title = '',
        body,
        type,
        close,
        className = '',
        shouldCloseOnOverlayClick = true,
        noBackdrop = false
    }) {
        this.id = id;
        this.title = title;
        this.body = body;
        this.type = type;
        this.close = close;
        this.className = className;
        this.shouldCloseOnOverlayClick = shouldCloseOnOverlayClick;
        this.noBackdrop = noBackdrop;
    }
}

class ModalProvider {
    showConfirm({ title, body, className }) {
        const { result, close } = this._openModal({
            title,
            body,
            type: MODAL_TYPES.confirm,
            className
        });

        return {
            result,
            close
        };
    }

    showError({ title, body, className = '' }) {
        const { result, close } = this._openModal({
            title,
            body,
            type: MODAL_TYPES.error,
            className: `modal-error ${className}`,
            noBackdrop: true
        });

        return {
            result,
            close
        };
    }

    showCustom({ title, body, className }) {
        const { result, close } = this._openModal({
            title,
            body,
            type: MODAL_TYPES.custom,
            className
        });

        return {
            result,
            close
        };
    }

    closeAll(reason) {
        store.dispatch(
            modalActions.closeAllModals({
                reason
            })
        );
    }

    _openModal({ title, body, type, className, noBackdrop }) {
        let close;
        const result = new Promise(resolve => {
            close = resolve;
        });
        const id = shortid.generate();

        store.dispatch(
            modalActions.openModal(
                new Modal({
                    id,
                    title,
                    body,
                    type,
                    className,
                    close,
                    noBackdrop
                })
            )
        );

        result.then(() => {
            this._closeModal(id);
        });

        return {
            result,
            close
        };
    }

    _closeModal(id) {
        store.dispatch(modalActions.closeModal({ id }));
    }
}

export default new ModalProvider();
