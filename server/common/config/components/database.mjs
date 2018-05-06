import joi from 'joi';

const { DATABASE_URL } = process.env;

const validationSchema = joi.string().required();
const { error } = joi.validate(DATABASE_URL, validationSchema);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const database = {
    DATABASE_URL
};
