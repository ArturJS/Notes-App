import joi from 'joi';

const { DROPBOX_TOKEN } = process.env;

const validationSchema = joi.string().required();
const { error } = joi.validate(DROPBOX_TOKEN, validationSchema);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const dropbox = {
    DROPBOX_TOKEN
};
