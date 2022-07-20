import {arrToString} from "./functions.js";
import {db_query} from "../db.js";
import {MAX_DB_ELEMENTS} from "../config.js";

export default class User {
    constructor(vk_id) {
        this.vk_id = vk_id;
        this.info = {};
    }
    async getSelf() {
        let users = await this.getByVkIds([this.vk_id]);
        if(!users.length) throw new Error();
        this.info = users[0];
        this.id = this.info.id
    }
    async getByVkIds(vk_ids) {
        let str_arr = arrToString(vk_ids);
        if(!str_arr) return [];
        let users = await db_query(`
        SELECT id, vk_user_id, registered, last_activity, permissions
        FROM users
        WHERE vk_user_id IN (${str_arr})
        LIMIT ${MAX_DB_ELEMENTS}`)
        return users;
    }
}