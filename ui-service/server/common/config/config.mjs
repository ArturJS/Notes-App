import { auth } from './components/auth';
import { env } from './components/env';
import { logger } from './components/logger';
import { redis } from './components/redis';
import { server } from './components/server';

const config = {
    auth,
    env,
    logger,
    redis,
    server
};

export default config;
