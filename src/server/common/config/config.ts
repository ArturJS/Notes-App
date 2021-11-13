import { auth } from './components/auth';
import { database } from './components/database';
import { dropbox } from './components/dropbox';
import { env } from './components/env';
import { logger } from './components/logger';
import { server } from './components/server';
import { mailer } from './components/mailer';

const config = {
    auth,
    database,
    dropbox,
    env,
    logger,
    server,
    mailer
};

export default config;
