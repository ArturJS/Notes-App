import { config } from './api.config';
import { baseApi } from './base.api';

export const authApi = {
    loginWithGoogle() {
        window.location.replace(`${config.baseURL}/auth/google`);
    },

    async logout() {
        await baseApi.ajax({
            method: 'post',
            url: '/auth/logout'
        });
    }
};
