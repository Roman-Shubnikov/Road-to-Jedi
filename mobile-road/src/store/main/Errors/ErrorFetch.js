export function FetchFatalError(property) {
    Error.call(this, property);
    this.name = "FetchFatalError";

    this.property = property;
    this.message = property;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, FetchFatalError);
    } else {
        this.stack = (new Error()).stack;
    }

}

FetchFatalError.prototype = Object.create(Error.prototype);
