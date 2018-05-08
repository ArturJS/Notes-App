import HttpStatus from 'http-status-codes';

export class Exception extends Error {
    constructor({ statusCode, errorCode, message }) {
        const errorMessage = Array.isArray(message)
            ? message.join('')
            : message;

        super(errorMessage);

        this._statusCode = statusCode;
        this._errorCode = errorCode;
    }

    get statusCode() {
        return this._statusCode;
    }

    get errorCode() {
        return this._errorCode;
    }

    toObject() {
        return {
            statusCode: this._statusCode,
            errorCode: this._errorCode,
            message: this.message
        };
    }
}

export class ErrorNotFound extends Exception {
    constructor(message) {
        super({
            statusCode: HttpStatus.NOT_FOUND,
            errorCode: 'ErrorNotFound',
            message
        });
    }
}

export class ErrorAlreadyExists extends Exception {
    constructor(message) {
        super({
            statusCode: HttpStatus.CONFLICT,
            errorCode: 'ErrorAlreadyExists',
            message
        });
    }
}

export class ErrorAccessDenied extends Exception {
    constructor(message) {
        super({
            statusCode: HttpStatus.FORBIDDEN,
            errorCode: 'ErrorAccessDenied',
            message
        });
    }
}

export class ErrorNotAuthorized extends Exception {
    constructor() {
        super({
            statusCode: HttpStatus.UNAUTHORIZED,
            errorCode: 'ErrorNotAuthorized',
            message: 'Unauthorized!'
        });
    }
}

export class ErrorBadRequest extends Exception {
    constructor(message) {
        super({
            statusCode: HttpStatus.BAD_REQUEST,
            errorCode: 'ErrorBadRequest',
            message
        });
    }
}
