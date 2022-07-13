import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { accountActions } from "../store/main";
import { useApi } from "./useApi";


export const useUser = () => {
    const dispatch = useDispatch();
    const { fetchApi } = useApi();
    const { account, ads } = useSelector((state) => state.account)
    const setAccount = useCallback((account) => dispatch(accountActions.setAccount(account)), [dispatch]);
    const setAds = useCallback((ads_count) => dispatch(accountActions.setAds(ads_count)), [dispatch]);

    const getUser = useCallback(async () => {
        let account = await fetchApi('account', {}, 'get');
        setAccount(account);
    }, [setAccount, fetchApi])

    return {
        ads,
        account,
        setAccount,
        getUser,
        setAds,
    }
}