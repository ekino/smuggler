import { ErrorCode } from './definitions'

export class TechnicalError extends Error {
    readonly name = 'TechnicalError'
    readonly code: ErrorCode
    readonly cause?: Error

    constructor(code: ErrorCode, message: string, cause?: Error) {
        super(message)
        this.code = code
        this.cause = cause
    }
}
