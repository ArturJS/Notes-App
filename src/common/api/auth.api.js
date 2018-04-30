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
