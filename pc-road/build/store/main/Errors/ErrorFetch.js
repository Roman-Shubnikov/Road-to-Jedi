"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchFatalError = void 0;
function FetchFatalError(property) {
    Error.call(this, property);
    this.name = "FetchFatalError";
    this.property = property;
    this.message = property;
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, FetchFatalError);
    }
    else {
        this.stack = (new Error()).stack;
    }
}
exports.FetchFatalError = FetchFatalError;
FetchFatalError.prototype = Object.create(Error.prototype);
