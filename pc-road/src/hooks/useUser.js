import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { accountActions } from "../store/main";
import { useApi } from "./useApi";


export const useUser = () => {
    const dispatch = useDispatch();
    const { fetchApi } = useApi();
    const { userToken, account, profile_id } = useSelector((state) => state.account)
    const setUserToken = useCallback((token) => dispatch(accountActions.setUserToken(token)), [dispatch]);
    const setAccount = useCallback((account) => dispatch(accountActions.setAccount(account)), [dispatch]);
    const setProfileId = useCallback((id) => dispatch(accountActions.setProfile(id)), [dispatch]);


    const getUser = useCallback(async () => {
        let account = await fetchApi('account', {}, 'get');
        setAccount(account);
    }, [setAccount, fetchApi])

    return {
        profile_id,
        account,
        setAccount,
        setUserToken,
        setProfileId,
        userToken,
        getUser,
    }
}