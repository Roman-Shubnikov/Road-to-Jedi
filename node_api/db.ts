import mysql from 'mysql';
import { pool } from './config';

type IPlaceholder = string | number | null;

export const dbQuery = async <T extends object[]>(query: string, placeholders: IPlaceholder[] = []): Promise<T> => {
    const queryFormatted = mysql.format(query, placeholders)
    // try {
        const resp: Promise<T> = new Promise((resolve) => {
            pool.query(queryFormatted, (err, result) => {
                if (err) {
                    console.log(err)
                    const arr = Array<object>() as T;
                    resolve(arr);
                }
                resolve(result);
            })
        })
        return await resp;
    // } catch (e) {
    //     // return Array<object>() as T;
    //     throw new Error(e);
    // }
}