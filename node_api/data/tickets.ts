import {arrToString} from "./functions";
import {dbQuery} from "../db";
import {MAX_DB_ELEMENTS, PERMISSIONS, TICKET_STATUSES} from "../config";
import {IcountElements} from "../types/db";
import {getTime} from "../functions";

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
    async getMessagesByTicketId(ticketId: number, offset: number): Promise<IPaginationMessages> {
        const cond = `
        WHERE ticket_id=?
        ORDER BY created_at DESC`
        const count = (await dbQuery<IcountElements>(`
        SELECT COUNT(*) as count
        FROM messages_new
        ${cond}`, [ticketId]))?.[0]?.count ?? 0;
        if(!count) return {count, messages: Array<IMessage>()}
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
        edited_at,
        created_at
        FROM messages_new
        ${cond}
        LIMIT ${offset}, ${MAX_DB_ELEMENTS}`, [ticketId])
        return {count, messages}
    }
    async sendMessage(authorId: number, ticketId: number, text: string) {
        const time = getTime();
        const resp = await dbQuery(`
        INSERT INTO messages_new
        (author_id, ticket_id, text, created_at)
        VALUES (?,?,?,?)`, [authorId, ticketId, text, time]);
        return resp;
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