import { StatusCode } from "@/types";

export default class CustomError extends Error {
    public statusCode: StatusCode;

    constructor(message: string, statusCode: StatusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export class ValidationError extends CustomError {
    constructor(message: string = 'Validation Error Occurred', statusCode: StatusCode = StatusCode.BadRequest) {
        super(message, statusCode);
    }
}

export class AuthenticationError extends CustomError {
    constructor(message: string = 'Authentication Failed', statusCode: StatusCode = StatusCode.Unauthorized) {
        super(message, statusCode);
    }
}

export class AuthorizationError extends CustomError {
    constructor(message: string = 'Forbidden: You do not have permission to access this resource', statusCode: StatusCode = StatusCode.Forbidden) {
        super(message, statusCode);
    }
}

export class NotFoundError extends CustomError {
    constructor(message: string = 'Resource not found', statusCode: StatusCode = StatusCode.NotFound) {
        super(message, statusCode);
    }
}

export class ConflictError extends CustomError {
    constructor(message: string = 'Conflict Error', statusCode: StatusCode = StatusCode.Conflict) {
        super(message, statusCode);
    }
}