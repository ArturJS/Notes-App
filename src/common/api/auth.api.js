import { config } from './api.config';
import { baseApi } from './base.api';

export const authApi = {
    loginWithGoogle() {
        const { baseURL } = config;
        const returnUrl = encodeURIComponent(window.location.pathname);

        window.location.replace(
            `${baseURL}/auth/google?returnUrl=${returnUrl}`
        );
    },

    async logout() {
        await baseApi.ajax({
            method: 'post',
            url: '/auth/logout'
        });
    },

    async getUserData(options) {
        const { data: user } = await baseApi.ajax({
            method: 'get',
            url: '/user',
            ...options
        });

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }
};
