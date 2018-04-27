import db from '../../common/models';

const mapUserInfo = user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
});

class UsersDAL {
    async getAll() {
        const users = await db.Users.findAll();

        return users.map(mapUserInfo);
    }

    async getByEmail(email) {
        const user = await db.Users.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        return mapUserInfo(user);
    }

    async create(user) {
        const createdUser = await db.Users.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });

        return mapUserInfo(createdUser);
    }
}

export default new UsersDAL();
