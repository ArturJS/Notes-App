import { auth } from './components/auth';
import { env } from './components/env';
import { logger } from './components/logger';
import { server } from './components/server';

const config = {
    auth,
    env,
    logger,
    server
};

export default config;
