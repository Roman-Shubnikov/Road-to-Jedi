"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allowedFileTypes = exports.DocumentTypesEnum = exports.ImageTypesEnum = void 0;
var ImageTypesEnum;
(function (ImageTypesEnum) {
    ImageTypesEnum["JPG"] = "image/jpg";
    ImageTypesEnum["JPEG"] = "image/jpeg";
    ImageTypesEnum["PNG"] = "image/png";
    ImageTypesEnum["WEBP"] = "image/webp";
})(ImageTypesEnum = exports.ImageTypesEnum || (exports.ImageTypesEnum = {}));
var DocumentTypesEnum;
(function (DocumentTypesEnum) {
    DocumentTypesEnum["DOC"] = "document";
})(DocumentTypesEnum = exports.DocumentTypesEnum || (exports.DocumentTypesEnum = {}));
exports.allowedFileTypes = Object.assign(Object.assign({}, DocumentTypesEnum), ImageTypesEnum);
//# sourceMappingURL=file-types.enum.js.map