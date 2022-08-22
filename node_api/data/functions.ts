import {ERRORS} from "../config";

export const arrToString = (arr: any[]): string => {
    return toNumericArray(arr).join(',');
}
export const toNumericArray = (arr: any): number[] => {
    let numericArray = arr.map(v => parseInt(v, 10))
    numericArray = numericArray.filter(v => !isNaN(v));
    return numericArray;
}
export const genError = (code: number) => {
    return new Error(ERRORS[code]);
}