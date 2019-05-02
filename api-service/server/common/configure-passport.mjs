import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import Router from 'koa-router';
import logger from '@root/common/logger';
import { usersController } from '@root/components/users';

const serializeError = error => {
    if (error instanceof Error) {
        const alt = {};

        Object.getOwnPropertyNames(error).forEach(key => {
            alt[key] = error[key];
        });

        return JSON.stringify(alt, null, 2);
    }

    return error;
};

const router = new Router();

export const configurePassport = app => {
    app.use(passport.initialize());
    app.use(passport.session());

    router
        .get('/api/auth/google', async (ctx, next) => {
            const { returnUrl = '/' } = ctx.request.query;

            logger.info(`/api/auth/google returnUrl: ${returnUrl}`);

            ctx.session.returnUrl = returnUrl;

            await passport.authenticate('google', {
                scope: ['email', 'profile'],
                callbackURL: `${returnUrl}api/auth/google/callback`
            })(ctx, next);
        })
        .get('/api/auth/google/callback', async ctx => {
            const returnUrl = ctx.session.returnUrl || '/';

            logger.info(`/api/auth/google/callback returnUrl: ${returnUrl}`);

            ctx.session.returnUrl = null;

            await passport.authenticate(
                'google',
                {
                    scope: ['email', 'profile'],
                    callbackURL: `${returnUrl}api/auth/google/callback`
                },
                async (err, user) => {
                    if (!user) {
                        logger.warn('Google auth error', serializeError(err));
                        ctx.redirect(`${returnUrl}?google-auth-error`);
                    } else {
                        await ctx.login(user);
                        ctx.redirect(returnUrl);
                    }
                }
            )(ctx);
        })
        .post('/api/auth/login', async ctx => {
            await ctx.logout();
            ctx.body = 0;
        })
        .post('/api/auth/logout', async ctx => {
            await ctx.logout();
            ctx.body = 0;
        })
        .post(
            '/api/auth/create-and-send-token',
            usersController.createAndSendToken
        );

    app.use(router.routes());

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    passport.use(new Strategy(usersController.handleAuthentication));
};
