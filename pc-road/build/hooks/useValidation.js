"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useValidation = void 0;
const react_1 = require("react");
const useValidation = () => {
    const [validationsStack, setValidationStack] = (0, react_1.useState)(null);
    const findValidationErr = (field) => {
        let err = validationsStack === null || validationsStack === void 0 ? void 0 : validationsStack.find(validation => validation.param === field);
        if (err)
            return { bottom: err.msg, status: 'error', onFocus: () => {
                    let stack = validationsStack.filter(validation => validation.param !== field);
                    setValidationStack(stack);
                } };
        return { bottom: '', status: 'default' };
    };
    return {
        setValidationStack,
        validationsStack,
        findValidationErr,
    };
};
exports.useValidation = useValidation;
