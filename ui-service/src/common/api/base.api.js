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

export const baseApi = {
    async ajax(request) {
        try {
            const response = await axios({ ...config, ...request });

            return response;
        } catch (error) {
            if (!request.suppressErrorNotify) {
                await showErrorNotify();
            }

            // eslint-disable-next-line no-console
            console.error(error);
            throw error;
        }
    }
};
