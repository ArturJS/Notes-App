import usersService from './users.service';

class UsersController {
    async getAll(ctx) {
        const users = await usersService.getAll();

        ctx.body = users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        }));
    }

    async getByEmail(ctx) {
        const { email } = ctx.params;
        const user = await usersService.getByEmail(email);

        ctx.body = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            notes: user.notes,
        };
    }

    async create(ctx) {
        const { email, firstName, lastName } = ctx.request.body;
        const createdUser = await usersService.create({
            email,
            firstName,
            lastName,
        });

        ctx.body = {
            id: createdUser.id,
            firstName: createdUser.firstName,
            lastName: createdUser.lastName,
            email: createdUser.email,
            notes: createdUser.notes,
        };
    }
}

export default new UsersController();
