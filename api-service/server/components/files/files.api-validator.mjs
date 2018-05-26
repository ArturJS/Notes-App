import joi from 'joi';
import { createApiValidator } from '@root/common/utils/validation.utils';

class FilesApiValidator {
    getById = createApiValidator([
        {
            path: 'params',
            schema: joi
                .object({
                    id: joi.number().required()
                })
                .required()
        }
    ]);

    remove = createApiValidator([
        {
            path: 'params',
            schema: joi
                .object({
                    id: joi.number().required()
                })
                .required()
        }
    ]);
}

export default new FilesApiValidator();
