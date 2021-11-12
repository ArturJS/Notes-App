import {
    ErrorNotFound,
    ErrorAlreadyExists,
    ErrorNotAuthorized
} from '~/server/common/exceptions';
import logger from '~/server/common/logger';
import * as jwtUtils from '~/server/common/utils/jwt.utils';
import { mailerService } from '../mailer';
import usersDAL from './users.dal';

const mapUserInfo = user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
});

class UsersService {
    async authenticateViaToken(token) {
        let email;

        try {
            const user = await jwtUtils.verify(token);

            // eslint-disable-next-line prefer-destructuring
            email = user.email;
        } catch (err) {
            logger.warn('Failed to verify auth token. Details: ', err);

            throw new ErrorNotAuthorized();
        }

        let relatedUser = await this.getByEmail(email, {
            suppressError: true
        });

        if (!relatedUser) {
            relatedUser = await this.create({
                email
            });
        }

        return relatedUser;
    }

    async createAndSendToken({ email, baseUrl }) {
        const token = await jwtUtils.sign({ email });
        const loginPath = `${baseUrl}/login?token=${token}`;

        await mailerService.sendEmail({
            receiverEmail: email,
            subject: 'Login to Notes-App',
            html: `<a href="${loginPath}">Click to login</a>`
        });
    }

    async getAll() {
        const users = await usersDAL.getAll();

        return users.map(mapUserInfo);
    }

    async getByEmail(email, { suppressError = false } = {}) {
        const user = await usersDAL.getByEmail(email);

        if (!user) {
            if (suppressError) {
                return null;
            }

            throw new ErrorNotFound(`User with email="${email}" not found!`);
        }

        return mapUserInfo(user);
    }

    async create(user) {
        const isUserAlreadyExists = await this.getByEmail(user.email, {
            suppressError: true
        });

        if (isUserAlreadyExists) {
            throw new ErrorAlreadyExists(
                `User with email="${user.email}" already exists!`
            );
        }

        const createdUser = await usersDAL.create({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email
        });

        return mapUserInfo(createdUser);
    }
}

export default new UsersService();
