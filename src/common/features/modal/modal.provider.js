import shortid from 'shortid';
import store from '~/common/store';
import { sleep } from '../../utils';
import * as modalActions from './modal.actions';

export const MODAL_TYPES = {
    error: 'ERROR_MODAL',
    confirm: 'CONFIRM_MODAL',
    info: 'INFO_MODAL',
    custom: 'CUSTOM_MODAL'
};

// it's necessary to perform exit animation in modal-dialog.jsx
const CLOSE_DELAY_MS = 10;

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
        this.isOpen = true;
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

    async closeAll(reason) {
        store.dispatch(
            modalActions.closeAllModalsRequest({
                reason
            })
        );

        await sleep(CLOSE_DELAY_MS);

        store.dispatch(modalActions.closeAllModalsSuccess());
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

        result.then(reason => this._closeModal({ id, reason }));

        return {
            result,
            close
        };
    }

    async _closeModal({ id, reason }) {
        store.dispatch(modalActions.closeModalRequest({ id, reason }));

        await sleep(CLOSE_DELAY_MS);

        store.dispatch(modalActions.closeModalSuccess({ id }));
    }
}

export default new ModalProvider();
