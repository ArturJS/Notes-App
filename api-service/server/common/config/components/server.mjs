import joi from 'joi';

const { HOST, PORT } = process.env;

const validationSchema = joi.object({
    HOST: joi.string().required(),
    PORT: joi.string().required()
});
const { error } = joi.validate(
    {
        HOST,
        PORT
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const server = {
    HOST,
    PORT
};
