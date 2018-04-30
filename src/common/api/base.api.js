import axios from 'axios';
import { config } from './api.config';

export const baseApi = {
    async ajax(request) {
        try {
            const response = await axios({ ...config, ...request });

            return response;
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            throw error;
        }
    }
};
