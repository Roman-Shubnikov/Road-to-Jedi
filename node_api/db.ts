import mysql from 'mysql';
import { pool } from './config';
import {OkPacket} from "./types/db";

type IPlaceholder = string | number | null;

export const dbQuery = async <T extends object[] | OkPacket>(query: string, placeholders: IPlaceholder[] = []): Promise<T> => {
    const queryFormatted = mysql.format(query, placeholders)
    const resp: Promise<T> = new Promise((resolve, reject) => {
        pool.query(queryFormatted, (err, result) => {
            if (err) {
                console.log(err)
                const arr = Array<object>() as T;
                reject(arr);
            }
            resolve(result);
        })
    })
    return await resp;
}