import db from '~/server/common/models';

type TUserInfo = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
};

type TUserCreate = {
    firstName: string;
    lastName: string;
    email: string;
};

const mapUserInfo = (user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
});

class UsersDAL {
    async getAll(): Promise<TUserInfo[]> {
        const users = await db.users.findMany();

        return users.map(mapUserInfo);
    }

    async getByEmail(email: string): Promise<TUserInfo | null> {
        const user = await db.users.findUnique({ where: { email } });

        if (!user) {
            return null;
        }

        return mapUserInfo(user);
    }

    async create(user: TUserCreate): Promise<TUserInfo> {
        const createdUser = await db.users.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

        return mapUserInfo(createdUser);
    }
}

export default new UsersDAL();
