import {API_VK_TOKEN, API_VK_URL, API_VK_VERSION} from "./config";
import FormData from "form-data";
import fetch from "node-fetch";


export const getKeyByValue = (obj, value) => {
    return Object.keys(obj).find(val => obj[val] === value)
}
export const getTime = (): number => {
    return Math.floor(new Date().getTime() / 1000);
}

export type fetchVkT = object[] | object;


export const fetchVK = async <T = fetchVkT>(method, json, token = API_VK_TOKEN): Promise<[boolean, T]> => {
    type VKResponse = {
        response: T,
        error?: T,
    }
    const formData = new FormData();
    for (const key in json) {
        if (json.hasOwnProperty(key)) {
            formData.append(key, json[key]);
        }
    }
    formData.append('v', API_VK_VERSION);
    formData.append('lang', '0');
    formData.append('access_token', token);
    try {
        const result: VKResponse = await (await fetch(API_VK_URL + '/method/' + method, {
            method: 'POST',// @ts-ignore
            body: formData
        })).json() as VKResponse;
        if(!('response' in result)) {
            return [false, result.error]
        }
        return [true, result.response];
    } catch {
        return [false, Object.create({})]
    }
}