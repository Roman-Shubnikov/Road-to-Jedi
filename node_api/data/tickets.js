import {arrToString} from "./functions.js";
import {db_query} from "../db.js";
import {MAX_DB_ELEMENTS} from "../config.js";


export default class Tickets {
    async getByIds(ids_raw) {
        let str_arr = arrToString(ids_raw);
        if(!str_arr) return [];
        let tickets = await db_query(`
        SELECT * 
        FROM tickets_new
        WHERE id IN (${str_arr})
        LIMIT ${MAX_DB_ELEMENTS}`)
        return tickets;
    }
    async getOpened(offset) {
        let cond = `WHERE status = 0`;
        let count = await db_query(`
        SELECT COUNT(*) as count
        FROM tickets_new
        ${cond}`);
        count = count?.[0]?.count ?? 0;
        let tickets = [];
        if(!count) return {count, tickets}
        tickets = await db_query(`
        SELECT * 
        FROM tickets_new
        ${cond}
        LIMIT ${offset}, ${MAX_DB_ELEMENTS}`)
        return {count, tickets};
    }
    async getReviewedByUser(aid) {
        let tickets = await db_query(`
        SELECT * 
        FROM tickets_new
        WHERE current_agent = ?
        LIMIT ${MAX_DB_ELEMENTS}`, [aid])
        return tickets;
    }


}