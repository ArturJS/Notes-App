import HttpStatus from 'http-status-codes';

export class Exception extends Error {
    constructor(statusCode, message) {
        super(message);

        this._statusCode = statusCode;
    }

    get statusCode() {
        return this._statusCode;
    }

    toObject() {
        return {
            statusCode: this._statusCode,
            message: this.message
        };
    }
}

export class ErrorNotFound extends Exception {
    constructor(message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}

export class ErrorAlreadyExists extends Exception {
    constructor(message) {
        super(HttpStatus.CONFLICT, message);
    }
}

export class ErrorNotAuthorized extends Exception {
    constructor() {
        super(HttpStatus.UNAUTHORIZED, 'Unauthorized!');
    }
}

export class ErrorBadRequest extends Exception {
    constructor(message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}