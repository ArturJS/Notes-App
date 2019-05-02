import _ from 'lodash';
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

    async handleAuthentication(username, token, done) {
        const user = await usersService.authenticateViaToken(token);

        done(null, {
            id: user.id,
            email: user.email
        });
    }

    async createAndSendToken(ctx) {
        const { email } = ctx.request.body;
        const { origin } = ctx.request;

        await usersService.createAndSendToken({
            email,
            baseUrl: origin
        });
        ctx.body = 0;
    }
}

export default new UsersController();
