import joi from 'joi';

const { NODE_ENV, DOCKER_BUILD = false } = process.env;

const validationSchema = joi
    .object({
        NODE_ENV: joi
            .string()
            .allow(['development', 'production'])
            .required(),
        DOCKER_BUILD: joi.boolean()
    })
    .required();
const { error } = joi.validate(
    {
        NODE_ENV,
        DOCKER_BUILD
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
    NODE_ENV,
    DOCKER_BUILD
};
