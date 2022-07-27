"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForceErrorBackend = void 0;
function ForceErrorBackend(property) {
    Error.call(this, property);
    this.name = "ForceErrorBackend";
    this.property = property;
    this.message = property;
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ForceErrorBackend);
    }
    else {
        this.stack = (new Error()).stack;
    }
}
exports.ForceErrorBackend = ForceErrorBackend;
ForceErrorBackend.prototype = Object.create(Error.prototype);
