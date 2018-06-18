import _ from 'lodash';
import { filesApi } from '@common/api';
import { Observer } from '@common/utils/design-pattern.utils';

export class FileInstance {
    constructor(fileFromInput) {
        // negative id number means not saved file
        this.id = -_.uniqueId();
        this.downloadPath = '';
        this.name = fileFromInput.name;
        this.size = fileFromInput.size;
        this.uploadProgress = 0;
        this.uploadingPromise = null;
        this.isRemoved = false;
        this._observers = {
            change: new Observer(),
            onRemove: new Observer()
        };
        this._cancelRequest = _.noop;

        this._startUploading(fileFromInput);
    }

    isUploaded = () => this.uploadProgress === 100;

    subscribe = (eventName, fn) => {
        if (eventName === 'change') {
            this._observers.change.subscribe(fn);

            return () => {
                this._observers.change.unsubscribe(fn);
            };
        }

        if (eventName === 'remove') {
            this._observers.onRemove.subscribe(fn);

            return () => {
                this._observers.onRemove.unsubscribe(fn);
            };
        }

        throw TypeError(
            [
                `Wrong \`eventName\` param type`,
                "Expected one of: ['uploadProgress', 'remove']",
                `Got: ${eventName}`
            ].join('')
        );
    };

    remove = async () => {
        this._setIsRemoved(true);

        try {
            await this._performRemoval();
        } catch (e) {
            this._setIsRemoved(false);
        }
    };

    _performRemoval = async () => {
        if (this.isUploaded()) {
            await filesApi.remove(this.id);
        } else {
            this._cancelRequest();
        }

        this._observers.onRemove.trigger(this.id);
    };

    _startUploading = fileFromInput => {
        this.uploadingPromise = filesApi
            .create(fileFromInput, {
                onUploadProgress: this._setUploadProgress,
                provideCancel: cancelFn => {
                    this._cancelRequest = cancelFn;
                }
            })
            .then(fileData => {
                if (!fileData) {
                    return;
                }

                this.id = fileData.id;
                this.downloadPath = fileData.downloadPath;
                this.name = fileData.name;
                this.size = fileData.size;
            });
    };

    _setUploadProgress = progressInPercentage => {
        this.uploadProgress = progressInPercentage;
        this._observers.change.trigger('uploadProgress', progressInPercentage);
    };

    _setIsRemoved = value => {
        this.isRemoved = value;
        this._observers.change.trigger('isRemoved', value);
    };
}

export const createFileInstance = fileFromInput =>
    new FileInstance(fileFromInput);
