import passport from 'koa-passport';
import { Strategy } from 'passport-local';
import Router from 'koa-router';
import { usersController } from '~/server/components/users';

const router = new Router();

export const configurePassport = app => {
    app.use(passport.initialize());
    app.use(passport.session());

    router
        .post('/api/auth/login', usersController.login)
        .post('/api/auth/logout', usersController.logout)
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
