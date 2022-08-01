import {arrToString, genError} from "./functions";
import {dbQuery} from "../db";
import {ERRORS, MAX_DB_ELEMENTS, MAX_MESSAGE_NO_MARK_PER_TICKET, PERMISSIONS, TICKET_STATUSES, TIMES} from "../config";
import {IcountElements, OkPacket} from "../types/db";
import {getTime} from "../functions";
import {sendError} from "../socketMethods/functions";
import {IUser} from "./user";

type ticketIdsCol = { id: number };
type ticket = ticketIdsCol & {
    title: string,
    status: number,
    author_id: number,
    current_agent: number,
    created_at: number,
}
type paginationTicketsCollection = {
    count: number,
    tickets: ticket[],
}

type IMessage = {
    id: number,
    ticket_id: number,
    author_id: number,
    mark: -1|0|1,
    mark_author_id?: number,
    marked_at: number,
    comment: string,
    comment_author_id?: number,
    commented_at: number,
    text: string,
    can_fix_to: number,
    edited_at: number,
    created_at: number,
}
type IPaginationMessages = {
    count: number,
    messages: IMessage[],
}

export default class Tickets {
    private user: IUser;
    constructor(user) {
        this.user = user;
    }
    async getByIds(idsRaw: number[]): Promise<ticket[]> {
        const strArr = arrToString(idsRaw);
        if(!strArr) return [];
        const tickets = await dbQuery<ticket[]>(`
        SELECT id,
        author_id,
        title,
        status,
        current_agent,
        created_at
        FROM tickets_new
        WHERE id IN (${strArr})
        ORDER BY FIELD(id, ${strArr})
        LIMIT ${MAX_DB_ELEMENTS}`)
        return tickets;
    }
    async getOpened(offset: number): Promise<paginationTicketsCollection> {
        const cond = `WHERE status = 0`;
        const count = (await dbQuery<IcountElements>(`
        SELECT COUNT(*) as count
        FROM tickets_new
        ${cond}`))?.[0]?.count ?? 0;
        if(!count) return {count, tickets: Array<ticket>()}
        const tickets = await dbQuery<ticketIdsCol[]>(`
        SELECT id
        FROM tickets_new
        ${cond}
        LIMIT ${offset}, ${MAX_DB_ELEMENTS}`)
        const ids = tickets.map(v => v.id);
        return {count, tickets: await this.getByIds(ids)};
    }
    async getReviewedByUser(aid: number): Promise<ticket[]> {
        const ticketsIds = await dbQuery<ticketIdsCol[]>(`
        SELECT id
        FROM tickets_new
        WHERE current_agent = ? AND
        status IN (${TICKET_STATUSES.RESERVED},${TICKET_STATUSES.ANSWERED},${TICKET_STATUSES.WAIT_EDIT},${TICKET_STATUSES.WAIT_ANSWER})
        LIMIT ${MAX_DB_ELEMENTS}`, [aid])
        const ids = ticketsIds.map(v => v.id);
        return await this.getByIds(ids);
    }
    async getMessagesByIds(idsRaw: number[]): Promise<IMessage[]> {
        const strArr = arrToString(idsRaw);
        if(!strArr) return [];
        const messages = await dbQuery<IMessage[]>(`
        SELECT id,
        ticket_id,
        author_id,
        mark,
        marked_at,
        comment,
        commented_at,
        text,
        can_fix_to,
        mark_author_id,
        edited_at,
        created_at
        FROM messages_new
        WHERE id IN (${strArr})
        ORDER BY FIELD(id, ${strArr})
        LIMIT ${MAX_DB_ELEMENTS}`)
        return messages;
    }
    async getMessagesByTicketId(ticketId: number, offset: number): Promise<IPaginationMessages> {
        const cond = `
        WHERE ticket_id=?
        ORDER BY created_at DESC`
        const count = (await dbQuery<IcountElements>(`
        SELECT COUNT(*) as count
        FROM messages_new
        ${cond}`, [ticketId]))?.[0]?.count ?? 0;
        if(!count) return {count, messages: Array<IMessage>()}
        const messagesIdsRaw = await dbQuery<IMessage[]>(`
        SELECT
        id
        FROM messages_new
        ${cond}
        LIMIT ${offset}, ${MAX_DB_ELEMENTS}`, [ticketId]);
        const messagesIds = messagesIdsRaw.map(v => v.id);
        const messages = await this.getMessagesByIds(messagesIds);
        return {count, messages}
    }
    async sendMessage(ticketId: number, text: string) {
        const time = getTime();
        const [ticketInfo] = await this.getByIds([ticketId]);
        if(!ticketInfo) throw genError(11);
        let authorId = this.user.id;
        if(this.user.permissions < PERMISSIONS.special) {
            const userMessagesNoMark = await dbQuery<IMessage[]>(`SELECT id
            FROM messages_new
            WHERE ticket_id=? AND author_id=? AND mark=?`,
                [ticketInfo.id, ticketInfo.author_id, -1])
            if(userMessagesNoMark.length > MAX_MESSAGE_NO_MARK_PER_TICKET) {
                throw genError(1);
            }
        } else {
            authorId = ticketInfo.author_id;
        }

        dbQuery<OkPacket>(`
        INSERT INTO messages_new
        (author_id, ticket_id, text, created_at)
        VALUES (?,?,?,?)`, [authorId, ticketId, text, time])
            .then(async data => {
                console.log(data)
                if(!data.insertId) throw genError(0);
                const [message] = await this.getMessagesByIds([data.insertId])
                return message;
            })
    }
    async markMessage(authorId: number, id: number, mark: number) {
        const time = getTime();
        let canFixTo = 0;
        let markAuthor = authorId;
        if(mark === -1) {
            canFixTo = time + TIMES.day;
            markAuthor = 0;
        }
        const resp = await dbQuery(`
        UPDATE messages_new
        SET mark=?, can_fix_to=?, mark_author_id=?, marked_at=?
        WHERE id=?`, [mark, canFixTo, markAuthor, time, id])
        return true;
    }
    async reserve(aid: number, ticketId: number): Promise<boolean> {

        return true
    }

    formatMessages(messages: IMessage[], userPerms: number) {
        const outArr = [];
        for(const message of messages) {
            const outMessage: IMessage = {
                id: message.id,
                ticket_id: message.ticket_id,
                author_id: message.author_id,
                mark: message.mark,
                marked_at: message.marked_at,
                comment: message.comment,
                commented_at: message.commented_at,
                text: message.text,
                can_fix_to: message.can_fix_to,
                edited_at: message.edited_at,
                created_at: message.created_at,
            };
            if(userPerms > PERMISSIONS.agent) {
                outMessage.mark_author_id = message.mark_author_id;
                outMessage.comment_author_id = message.comment_author_id;
            }
            outArr.push(outMessage);
        }
        return outArr;
    }

}