import { baseApi } from './base.api';

export const authApi = {
    async loginViaToken(token) {
        const { data: user } = await baseApi.ajax({
            method: 'post',
            url: '/auth/login',
            data: {
                token
            }
        });

        return {
            id: user.id,
            email: user.email
        };
    },

    async sendAuthToken(email) {
        await baseApi.ajax({
            method: 'post',
            url: '/auth/create-and-send-token',
            data: {
                email,
                baseUrl: window.location.origin
            }
        });
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
