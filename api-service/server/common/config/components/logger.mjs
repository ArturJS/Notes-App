import joi from 'joi';

const { LOG_LEVEL } = process.env;

const validationSchema = joi
    .string()
    .only(['error', 'warn', 'info', 'verbose', 'debug', 'silly'])
    .required();
const { error } = joi.validate(LOG_LEVEL, validationSchema);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const logger = {
    LOG_LEVEL
};
