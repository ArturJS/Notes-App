import joi from 'joi';

const { NODE_ENV } = process.env;

const validationSchema = joi
    .string()
    .only(['development', 'production'])
    .required();
const { error } = joi.validate(NODE_ENV, validationSchema);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
    NODE_ENV
};
