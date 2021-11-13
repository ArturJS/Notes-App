import _ from 'lodash';
import joi from 'joi';
import { ErrorBadRequest } from '../exceptions/common.exceptions';

export const validate = (value, validationSchema) => {
    const { error } = joi.validate(value, validationSchema);

    if (error) {
        throw new ErrorBadRequest(error);
    }
};

export const createApiValidator = validatorParams => async (ctx, next) => {
    validatorParams.forEach(({ path, schema }) => {
        const value = _.get(ctx, path);

        validate(value, schema);
    });

    return next();
};
