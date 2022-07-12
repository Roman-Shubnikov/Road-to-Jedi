export function ForceErrorBackend(property) {
    Error.call(this, property);
    this.name = "ForceErrorBackend";

    this.property = property;
    this.message = property;

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, ForceErrorBackend);
    } else {
        this.stack = (new Error()).stack;
    }

}
ForceErrorBackend.prototype = Object.create(Error.prototype);