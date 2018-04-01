import db from '../../common/models';

class UsersDAL {
    async getAll() {
        const users = await db.User.findAll();

        return users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        }));
    }

    async getByEmail(email) {
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            notes: user.notes
        };
    }

    async create(user) {
        const createdUser = await db.User.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });

        return {
            id: createdUser.id,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            notes: createdUser.notes
        };
    }
}

export default new UsersDAL();
