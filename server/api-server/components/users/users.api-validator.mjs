import joi from 'joi';
import { createApiValidator } from '../../common/utils/validation.utils';

class UsersApiValidator {
    getByEmail = createApiValidator([
        {
            path: 'params',
            schema: joi
                .object({
                    email: joi
                        .string()
                        .email()
                        .required()
                })
                .required()
        }
    ]);

    create = createApiValidator([
        {
            path: 'body',
            schema: joi
                .object({
                    firstName: joi.string().required(),
                    lastName: joi.string().required(),
                    email: joi
                        .string()
                        .email()
                        .required()
                })
                .required()
        }
    ]);
}

export default new UsersApiValidator();
