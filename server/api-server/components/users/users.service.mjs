import usersDAL from './users.dal';

class UsersService {
    async getAll() {
        const users = await usersDAL.getAll();

        return users.map(user => ({
            id: user.id,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
        }));
    }

    async getByEmail(email, { suppressError = false }) {
        const user = await usersDAL.getByEmail(email);

        if (!user) {
            if (suppressError) {
                return null;
            }

            throw new Error(`User with email="${email}" not found!`); // TODO: introduce custom errors
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            notes: user.notes,
        };
    }

    async create(user) {
        const isUserAlrearyExists = await this.getByEmail(user.email, {
            suppressError: true,
        });

        if (isUserAlrearyExists) {
            throw new Error(`User with email="${user.email}" already exists!`); // TODO: introduce custom errors
        }

        const createdUser = await usersDAL.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });

        return {
            id: createdUser.id,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            notes: createdUser.notes,
        };
    }
}

export default new UsersService();
