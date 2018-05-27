import joi from 'joi';

const {
    GOOGLE_OAUTH20_CLIENT_ID,
    GOOGLE_OAUTH20_CLIENT_SECRET,
    AUTH_SESSION_SECRET
} = process.env;
const validationSchema = joi
    .object({
        GOOGLE_OAUTH20_CLIENT_ID: joi.string().required(),
        GOOGLE_OAUTH20_CLIENT_SECRET: joi.string().required(),
        AUTH_SESSION_SECRET: joi.string().required()
    })
    .required();
const { error } = joi.validate(
    {
        GOOGLE_OAUTH20_CLIENT_ID,
        GOOGLE_OAUTH20_CLIENT_SECRET,
        AUTH_SESSION_SECRET
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const auth = {
    GOOGLE_OAUTH20_CLIENT_ID,
    GOOGLE_OAUTH20_CLIENT_SECRET,
    AUTH_SESSION_SECRET
};
