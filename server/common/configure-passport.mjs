import passport from 'koa-passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import Router from 'koa-router';
import config from '@config';
import { usersController } from '@root/api-server/components/users';

const router = new Router();

export const configurePassport = app => {
    app.use(passport.initialize());
    app.use(passport.session());

    router
        .get(
            '/api/auth/google',
            passport.authenticate('google', { scope: ['email', 'profile'] })
        )
        .get('/api/auth/google/callback', async ctx => {
            await passport.authenticate('google', async (err, user) => {
                if (!user) {
                    ctx.redirect('/?google-auth-error');
                } else {
                    await ctx.login(user);
                    ctx.redirect('/');
                }
            })(ctx);
        })
        .post('/api/auth/logout', async ctx => {
            await ctx.logout();
            ctx.body = 0;
        });

    app.use(router.routes());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    const { HOST, PORT } = config.server;
    const {
        GOOGLE_OAUTH20_CLIENT_ID,
        GOOGLE_OAUTH20_CLIENT_SECRET
    } = config.auth;

    passport.use(
        new OAuth2Strategy(
            {
                clientID: GOOGLE_OAUTH20_CLIENT_ID,
                clientSecret: GOOGLE_OAUTH20_CLIENT_SECRET,
                callbackURL: `http://${HOST}:${PORT}/api/auth/google/callback`
            },
            usersController.handleGoogleAuthentication
        )
    );
};
