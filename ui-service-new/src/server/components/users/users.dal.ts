import db from '@root/common/models';

type TUserInfo = {
    id: number,
    firstName: string,
    lastName: string,
    email: string
};

type TUserCreate = {
    firstName: string,
    lastName: string,
    email: string
};

const mapUserInfo = user => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
});

class UsersDAL {
    async getAll(): Promise<TUserInfo[]> {
        const users = await db.Users.findAll();

        return users.map(mapUserInfo);
    }

    async getByEmail(email: string): Promise<TUserInfo | null> {
        const user = await db.Users.findOne({ where: { email } });

        if (!user) {
            return null;
        }

        return mapUserInfo(user);
    }

    async create(user: TUserCreate): Promise<TUserInfo> {
        const createdUser = await db.Users.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        });

        return mapUserInfo(createdUser);
    }
}

export default new UsersDAL();
