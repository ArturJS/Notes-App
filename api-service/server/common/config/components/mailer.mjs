import joi from 'joi';

const { MAIL_USER_SERVICE, MAIL_USER_EMAIL, MAIL_USER_PASSWORD } = process.env;

const validationSchema = joi
    .object({
        MAIL_USER_SERVICE: joi.string().required(),
        MAIL_USER_EMAIL: joi
            .string()
            .email()
            .required(),
        MAIL_USER_PASSWORD: joi.string().required()
    })
    .required();
const { error } = joi.validate(
    {
        MAIL_USER_SERVICE,
        MAIL_USER_EMAIL,
        MAIL_USER_PASSWORD
    },
    validationSchema
);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

export const mailer = {
    MAIL_USER_SERVICE,
    MAIL_USER_EMAIL,
    MAIL_USER_PASSWORD
};
