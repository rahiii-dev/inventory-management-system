/**
 * Base class for application errors.
 */
export class ApplicationError extends Error {
    public code: number;

    constructor(code: number, message: string) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error class for bad requests (HTTP 400).
 */
export class BadRequestError extends ApplicationError {
    constructor(message: string) {
        super(400, message);
    }
}

/**
 * Error class for unauthorized access (HTTP 401).
 */
export class UnauthorizedError extends ApplicationError {
    constructor(message: string) {
        super(401, message);
    }
}

/**
 * Error class for forbidden access (HTTP 403).
 */
export class ForbiddenError extends ApplicationError {
    constructor(message: string) {
        super(403, message);
    }
}

/**
 * Error class for not found resources (HTTP 404).
 */
export class NotFoundError extends ApplicationError {
    constructor(message: string) {
        super(404, message);
    }
}

/**
 * Error class for missing required fields.
 */
export class MissingFieldError extends BadRequestError {
    constructor(fieldName: string) {
        super(`${fieldName} is required`);
    }
}

/**
 * Error class for internal server errors (HTTP 500).
 */
export class InternalError extends ApplicationError {
    constructor(message: string) {
        super(500, message);
    }
}

/**
 * Error class for invalid IDs.
 */
export class InvalidIdError extends BadRequestError {
    constructor(message = "Invalid Id") {
        super(message);
    }
}
