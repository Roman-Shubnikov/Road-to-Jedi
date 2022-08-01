import {arrToString, toNumericArray} from "./functions";
import {dbQuery} from "../db";
import {AVATAR_URL, MAX_DB_ELEMENTS, PERMISSIONS} from "../config";
import {fetchVK} from "../functions";
import {vkUser} from "../types/user";

type InfoT = {
    id?: number,
    permissions?: number,
}
type ShortUserInfo = {
    permissions: number,
    id: number,
    first_name: string,
    last_name: string,
    avatar: string,
}
type AgentInfo = ShortUserInfo & {
    vk_user_id: number,
    registered: number,
    last_activity: number,
}

export interface IUser {
    info: InfoT;
    id: number;
    vkId: number;
    permissions: number;
    getSelf: VoidFunction;
    getByVkIds: (vkIds) => Promise<InfoT[]>;
    getByIds: (ids) => Promise<ShortUserInfo[]>;
    getByAgentsIds: (ids) => Promise<AgentInfo[]>;
    checkPermission: (permission) => Promise<boolean>;

}

export class User implements IUser {
    info: InfoT;
    id: number;
    vkId: number;
    permissions: number;

    constructor(vkId) {
        this.vkId = vkId;
    }

    async checkPermission(permission: number, aid=0): Promise<boolean> {
        if(aid === 0) {
            return permission <= this.permissions;
        } else {
            return false;
        }
    }

    async getSelf() {
        const users = await this.getByVkIds([this.vkId]);
        if (!users.length) throw new Error();
        this.info = users[0];
        this.id = this.info.id
        this.permissions = this.info.permissions;
    }

    async getByVkIds(vkIds): Promise<InfoT[]> {
        const strArr = arrToString(vkIds);
        if (!strArr) return [];
        return await dbQuery<InfoT[]>(`
        SELECT id, vk_user_id, registered, last_activity, permissions
        FROM users
        WHERE vk_user_id IN (${strArr})
        LIMIT ${MAX_DB_ELEMENTS}`);
    }

    async getByAgentsIds(ids: any[]): Promise<AgentInfo[]> {
        const uIds = toNumericArray(ids);
        if(!uIds.length) return [];
        const outArr = [];
        type infoAgent = {
            id: number,
            vk_user_id: number,
            permissions: number,
            name: string,
            registered: number,
            last_activity: number,
        }
        const agentsInfo = await dbQuery<infoAgent[]>(`
        SELECT u.id,
        u.vk_user_id,
        u.permissions,
        a.name,
        u.registered,
        u.last_activity
        FROM users as u
        LEFT JOIN avatars as a ON u.avatar_id = a.id
        WHERE u.id IN (${uIds.toString()})
        LIMIT ${MAX_DB_ELEMENTS}`);
        agentsInfo.forEach(v => {
            let name: string;
            switch (v.permissions) {
                case PERMISSIONS.admin:
                    name = 'Администратор'
                    break;
                case PERMISSIONS.special:
                    name = 'Специальный Агент';
                    break;
                case PERMISSIONS.agent:
                default:
                    name = 'Агент Поддержки';
            }
            outArr.push(
                {
                    permissions: v.permissions,
                    id: v.id,
                    vk_user_id: v.vk_user_id,
                    first_name: name,
                    last_name: '#' + v.id,
                    avatar: AVATAR_URL + '/' + v.name,
                    registered: v.registered,
                    last_activity: v.last_activity,
                }
            )
        })
        return outArr;
    }

    async getByIds(ids: any[]): Promise<ShortUserInfo[]> {
        const uIds = toNumericArray(ids);
        const vkUsersIds = uIds.filter(v => v < 0);
        const agentsIds = uIds.filter(v => v > 0);

        const agentsInfo = await this.getByAgentsIds(agentsIds);
        const outArr: ShortUserInfo[] = [...agentsInfo];

        const vkUsersInfo = await fetchVK<vkUser[]>('users.get', {
            user_ids: vkUsersIds.map(v => -v).toString(),
            fields: 'photo_200',
        });
        if (!vkUsersInfo[0]) return outArr;
        vkUsersInfo[1].forEach((v) => {
            outArr.push(
                {
                    permissions: PERMISSIONS.agent,
                    id: -v.id,
                    first_name: v.first_name,
                    last_name: v.last_name,
                    avatar: v.photo_200,
                }
            )
        })
        return outArr;
    }
}