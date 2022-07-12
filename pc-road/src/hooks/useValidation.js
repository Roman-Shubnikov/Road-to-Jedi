import { useState } from "react";

export const useValidation = () => {
    const [validationsStack, setValidationStack] = useState(null);

    const findValidationErr = (field) => {
        let err = validationsStack?.find(validation => validation.param === field);
        if(err) return {bottom: err.msg, status: 'error', onFocus: () => {
            let stack = validationsStack.filter(validation => validation.param !== field);
            setValidationStack(stack);
        }};
        return {bottom: '', status: 'default'};
    }
    return {
        setValidationStack,
        validationsStack,
        findValidationErr,

    }
}