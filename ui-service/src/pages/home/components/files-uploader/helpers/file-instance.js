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
        this._observers = {
            onUploadProgress: new Observer(),
            onRemove: new Observer()
        };
        this._cancelRequest = _.noop;

        this._startUploading(fileFromInput);
    }

    _startUploading(fileFromInput) {
        this.uploadingPromise = filesApi
            .create(fileFromInput, {
                onUploadProgress: progressInPercentage => {
                    this.uploadProgress = progressInPercentage;
                    this._observers.onUploadProgress.trigger(
                        progressInPercentage
                    );
                },
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
    }

    isUploaded = () => this.uploadProgress === 100;

    subscribe = (eventName, fn) => {
        if (eventName === 'uploadProgress') {
            this._observers.onUploadProgress.subscribe(fn);

            return () => {
                this._observers.onUploadProgress.unsubscribe(fn);
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
        if (this.isUploaded()) {
            await filesApi.remove(this.id);
        } else {
            this._cancelRequest();
        }

        this._observers.onRemove.trigger(this.id);
    };
}

export const createFileInstance = fileFromInput =>
    new FileInstance(fileFromInput);
