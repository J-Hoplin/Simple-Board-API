class ErrorInterface extends Error {
    constructor(bucket) {
        const {
            message,
            code
        } = bucket;
        super(message, code);
        this.name = this.constructor.name;
        this.message = message;
        this.code = code;
    }
}

exports.BadRequest = class BadRequest extends ErrorInterface {
    constructor(bucket) {
        super(bucket);
    }
};

exports.ForbiddenRequest = class ForbiddenRequest extends ErrorInterface {
    constructor(bucket) {
        super(bucket);
    }
};

exports.QueryFailed = class QueryFailed extends ErrorInterface {
    constructor(bucket) {
        super(bucket);
    }
};

exports.LogicError = class LogicError extends ErrorInterface {
    constructor(bucket) {
        super(bucket);
    }
};