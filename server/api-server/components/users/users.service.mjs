import { ErrorNotFound, ErrorAlreadyExists } from '../../common/exceptions';
import usersDAL from './users.dal';

const mapUserInfo = user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
});

const mapUserDetailedInfo = user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    notes: user.notes
});

class UsersService {
    async getAll() {
        const users = await usersDAL.getAll();

        return users.map(mapUserInfo);
    }

    async getByEmail(email, { suppressError = false }) {
        const user = await usersDAL.getByEmail(email);

        if (!user) {
            if (suppressError) {
                return null;
            }

            throw new ErrorNotFound(`User with email="${email}" not found!`);
        }

        return mapUserDetailedInfo(user);
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
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });

        return mapUserDetailedInfo(createdUser);
    }
}

export default new UsersService();
