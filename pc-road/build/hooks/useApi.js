"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApi = void 0;
const react_1 = require("react");
const config_1 = require("../config");
const useNavigation_1 = require("./useNavigation");
class ValidationError extends Error {
    constructor(message, resp) {
        super(message, resp);
        this.name = "ValidationError";
        this.resp = resp;
    }
}
const useApi = () => {
    const { goDisconnect, setAbortSnack } = (0, useNavigation_1.useNavigation)();
    const mountedRef = (0, react_1.useRef)(false);
    const [textError, setTextError] = (0, react_1.useState)(null);
    const [error, setError] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);
    (0, react_1.useEffect)(() => {
        if (!textError)
            return;
        setAbortSnack(textError);
        setTextError(null);
    }, [setAbortSnack, textError]);
    (0, react_1.useEffect)(() => {
        if (!error)
            return;
        goDisconnect(error);
        setError(null);
    }, [goDisconnect, error]);
    const fetchApi = (0, react_1.useCallback)((method, data, http_method = 'post') => __awaiter(void 0, void 0, void 0, function* () {
        let get_params = window.location.search.replace('?', '');
        try {
            let res = yield fetch(config_1.API_URL + "method=" + method + (get_params ? '&' + get_params : ''), {
                method: http_method,
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: !(["get", "head"].includes(http_method)) ? JSON.stringify(data) : null,
            });
            res = yield res.json();
            if (!res.result) {
                setTextError('Произошла ошибка: ' + res.error.message);
                throw new ValidationError(res.error.message, res);
            }
            return res.response;
        }
        catch (e) {
            if (e instanceof ValidationError)
                throw e;
            setError(e);
            return null;
        }
    }), []);
    const fetchApiFormData = (0, react_1.useCallback)((method, data, http_method = 'post') => __awaiter(void 0, void 0, void 0, function* () {
        let get_params = window.location.search.replace('?', '');
        try {
            let form_data = new FormData();
            for (const key in data) {
                form_data.append(key, data[key]);
            }
            let res = yield fetch(config_1.API_URL + method + (get_params ? '?' + get_params : ''), {
                method: http_method,
                body: !(["get", "head"].includes(http_method)) ? form_data : null,
            });
            res = yield res.json();
            if (!res.result) {
                throw new TypeError(res.error.message);
            }
            return res.response;
        }
        catch (e) {
            if (e instanceof TypeError)
                throw e;
            setError(e);
            return null;
        }
    }), []);
    return {
        mountedRef,
        fetchApi,
        fetchApiFormData,
    };
};
exports.useApi = useApi;
