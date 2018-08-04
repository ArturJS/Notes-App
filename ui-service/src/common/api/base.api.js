import axios from 'axios';
import { modalProvider } from '@common/features/modal';
import { sleep } from '@common/utils';
import { config } from './api.config';

const showErrorNotify = async () => {
    const { close, result } = modalProvider.showError({
        title: 'Operation failed...'
    });

    await Promise.race([sleep(3000), result]);
    close();
};

const makeRequest = async requestParams => {
    const source = axios.CancelToken.source();
    const request = axios({
        ...config,
        ...requestParams,
        cancelToken: source.token
    });

    if (typeof requestParams.provideCancel === 'function') {
        requestParams.provideCancel(source.cancel);
    }

    return request;
};

const processError = async (error, requestParams) => {
    if (axios.isCancel(error)) {
        // eslint-disable-next-line no-console
        console.info('Request cancelled.');

        return {
            data: null
        };
    }

    if (!requestParams.suppressErrorNotify) {
        await showErrorNotify();
    }

    throw error;
};

export const baseApi = {
    async ajax(requestParams) {
        try {
            const response = await makeRequest(requestParams);

            return response;
        } catch (error) {
            await processError(error, requestParams);

            return {
                data: null
            };
        }
    }
};
