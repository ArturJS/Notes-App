import usersService from './users.service';

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

class UsersController {
    async getAll(ctx) {
        const users = await usersService.getAll();

        ctx.body = users.map(mapUserInfo);
    }

    async getByEmail(ctx) {
        const { email } = ctx.params;
        const user = await usersService.getByEmail(email);

        ctx.body = mapUserDetailedInfo(user);
    }

    async create(ctx) {
        const { email, firstName, lastName } = ctx.request.body;
        const createdUser = await usersService.create({
            email,
            firstName,
            lastName
        });

        ctx.body = mapUserDetailedInfo(createdUser);
    }

    async handleGoogleAuthentication(accessToken, refreshToken, profile, done) {
        const email = profile.emails[0].value; // TODO handle absense of email
        const firstName = profile.name.givenName;
        const lastName = profile.name.familyName;

        let relatedUser = await usersService.getByEmail(email, {
            suppressError: true
        });

        if (!relatedUser) {
            relatedUser = await usersService.create({
                email,
                firstName,
                lastName
            });
        }

        done(null, {
            accessToken,
            refreshToken,
            user: {
                email: relatedUser.email,
                firstName: relatedUser.firstName,
                lastName: relatedUser.lastName
            }
        });
    }
}

export default new UsersController();
