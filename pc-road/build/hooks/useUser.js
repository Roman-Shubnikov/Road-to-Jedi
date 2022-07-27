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
exports.useUser = void 0;
const react_1 = require("react");
const react_redux_1 = require("react-redux");
const main_1 = require("../store/main");
const useApi_1 = require("./useApi");
const useUser = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { fetchApi } = (0, useApi_1.useApi)();
    const { account, ads } = (0, react_redux_1.useSelector)((state) => state.account);
    const setAccount = (0, react_1.useCallback)((account) => dispatch(main_1.accountActions.setAccount(account)), [dispatch]);
    const setAds = (0, react_1.useCallback)((ads_count) => dispatch(main_1.accountActions.setAds(ads_count)), [dispatch]);
    const getUser = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        let account = yield fetchApi('account', {}, 'get');
        setAccount(account);
    }), [setAccount, fetchApi]);
    return {
        ads,
        account,
        setAccount,
        getUser,
        setAds,
    };
};
exports.useUser = useUser;
