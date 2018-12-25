import joi from 'joi';

const { HOST, PORT, API_URL } = process.env;

const validationSchema = joi.object({
    HOST: joi.string().required(),
    PORT: joi.string().required(),
    API_URL: joi.string().required()
});
const { error } = joi.validate(
    {
        HOST,
        PORT,
        API_URL
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const server = {
    HOST,
    PORT,
    API_URL
};
