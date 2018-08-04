import joi from 'joi';

const { HOST, PORT, PUBLIC_HOST, PUBLIC_PORT } = process.env;

const validationSchema = joi.object({
    HOST: joi.string().required(),
    PORT: joi.string().required(),
    PUBLIC_HOST: joi.string().required(),
    PUBLIC_PORT: joi.string().required()
});
const { error } = joi.validate(
    {
        HOST,
        PORT,
        PUBLIC_HOST,
        PUBLIC_PORT
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const server = {
    HOST,
    PORT,
    PUBLIC_HOST,
    PUBLIC_PORT
};
