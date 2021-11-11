import _ from 'lodash';
import logger from '@root/common/logger';
import usersService from './users.service';

const mapUserInfo = user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
});

const getUserEmail = ctx => _.get(ctx, 'session.passport.user.email');

class UsersController {
    async getAll(ctx) {
        const users = await usersService.getAll();

        ctx.body = users.map(mapUserInfo);
    }

    async getByEmail(ctx) {
        const { email } = ctx.params;
        const user = await usersService.getByEmail(email);

        ctx.body = mapUserInfo(user);
    }

    async getUserData(ctx) {
        const email = getUserEmail(ctx);
        const user = await usersService.getByEmail(email);

        ctx.body = mapUserInfo(user);
    }

    async create(ctx) {
        const { email, firstName, lastName } = ctx.request.body;
        const createdUser = await usersService.create({
            email,
            firstName,
            lastName
        });

        ctx.body = mapUserInfo(createdUser);
    }

    async login(ctx) {
        const { token } = ctx.request.body;

        logger.info(`login with token="${token}"`);

        const user = await usersService.authenticateViaToken(token);

        logger.info(`End login with token="${token}". Found user `, user);

        const authData = _.pick(user, ['id', 'email']);

        await ctx.login(authData);
        ctx.body = authData;
    }

    async logout(ctx) {
        await ctx.logout();
        ctx.body = 0;
    }

    async handleAuthentication(username, token, done) {
        logger.info(`Start handleAuthentication with token="${token}"`);
        const user = await usersService.authenticateViaToken(token);

        logger.info(
            `End handleAuthentication with token="${token}". Found user `,
            user
        );
        done(null, {
            id: user.id,
            email: user.email
        });
    }

    async createAndSendToken(ctx) {
        const { email, baseUrl } = ctx.request.body;

        await usersService.createAndSendToken({
            email,
            baseUrl
        });
        ctx.body = 0;
    }
}

export default new UsersController();
