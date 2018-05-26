import joi from 'joi';

const { REDIS_HOST, REDIS_PORT } = process.env;

const validationSchema = joi.object({
    REDIS_HOST: joi.string().required(),
    REDIS_PORT: joi.string().required()
});
const { error } = joi.validate(
    {
        REDIS_HOST,
        REDIS_PORT
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const redis = {
    REDIS_HOST,
    REDIS_PORT
};
