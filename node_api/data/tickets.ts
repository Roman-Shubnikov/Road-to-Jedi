import {arrToString, genError} from "./functions";
import {dbQuery} from "../db";
import {
    DONUT_TICKET_COEFFICIENT,
    DONUTS_GOOD_MARK,
    MAX_DB_ELEMENTS,
    MONEY_GOOD_MARK,
    PERMISSIONS,
    TICKET_STATUSES, TIME_TO_EDIT_MESSAGE,
    TIMES
} from "../config";
import {IcountElements, OkPacket} from "../types/db";
import {getTime} from "../functions";
import {IUser} from "./user";

type ticketIdsCol = { id: number };
type ITicket = ticketIdsCol & {
    title: string,
    status: number,
    author_id: number,
    current_agent: number,
    created_at: number,
    is_donut: number,
}
type paginationTicketsCollection = {
    count: number,
    tickets: ITicket[],
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
    async getByIds(idsRaw: number[]): Promise<ITicket[]> {
        const strArr = arrToString(idsRaw);
        if(!strArr) return [];
        const tickets = await dbQuery<ITicket[]>(`
        SELECT id,
        author_id,
        title,
        is_donut,
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
        if(!count) return {count, tickets: Array<ITicket>()}
        const tickets = await dbQuery<ticketIdsCol[]>(`
        SELECT id
        FROM tickets_new
        ${cond}
        LIMIT ${offset}, ${MAX_DB_ELEMENTS}`)
        const ids = tickets.map(v => v.id);
        return {count, tickets: await this.getByIds(ids)};
    }
    async getReviewedByUser(aid: number): Promise<ITicket[]> {
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
        comment_author_id,
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
        const privateMessagesPermission = this.user.permissions >= PERMISSIONS.special ? '' :
            `AND (author_id=${this.user.id} OR author_id<0 OR mark=1)`;
        const cond = `
        WHERE ticket_id=? ${privateMessagesPermission}
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
        const isSpecial = this.user.permissions < PERMISSIONS.special;
        if(ticketInfo.status === 5) throw genError(14);
        if(ticketInfo.status === TICKET_STATUSES.ANSWERED && isSpecial) throw genError(20);
        if(ticketInfo.status === TICKET_STATUSES.WAIT_EDIT && !isSpecial) throw genError(20);
        let authorId = this.user.id;
        const userMessagesNoMark = await dbQuery<IMessage[]>(`SELECT id
            FROM messages_new
            WHERE ticket_id=? AND author_id>0 AND mark=?`,
            [ticketInfo.id, -1])
        if(this.user.permissions < PERMISSIONS.special) {
            if(userMessagesNoMark.length > 0) {
                throw genError(21);
            }
        } else {
            authorId = ticketInfo.author_id;
            if(userMessagesNoMark.length > 0) throw genError(15);
        }

        dbQuery<OkPacket>(`
        INSERT INTO messages_new
        (author_id, ticket_id, text, created_at)
        VALUES (?,?,?,?)`, [authorId, ticketId, text, time])
            .then(async data => {
                let newStatus = ticketInfo.status;
                switch (ticketInfo.status) {
                    case 0:
                        break;
                    case 1:
                    case 2:
                        if(authorId < 0) {
                            newStatus = TICKET_STATUSES.WAIT_ANSWER;
                        }
                    case 3:
                    case 4:
                        if(authorId > 0) {
                            newStatus = TICKET_STATUSES.ANSWERED
                        }
                        break;

                }
                await this.setStatus(ticketId, newStatus, ticketInfo.current_agent);
                if(!data.insertId) throw genError(0);
                const [message] = await this.getMessagesByIds([data.insertId])
                return message;
            })
    }
    async editMessage(id: number, newText: string) {
        const [messageInfo] = await this.getMessagesByIds([id]);
        if(!messageInfo) throw genError(11);
        if(messageInfo.text !== newText) {
            if(messageInfo.author_id > 0 && this.user.id !== messageInfo.author_id) throw genError(403);
            if(messageInfo.mark !== -1) throw genError(16);
            if(messageInfo.created_at < getTime()-TIME_TO_EDIT_MESSAGE && !messageInfo.can_fix_to) throw genError(17);
            if(messageInfo.author_id < 0 && this.user.permissions < PERMISSIONS.special) throw genError(403);
            const [ticketInfo] = await this.getByIds([messageInfo.ticket_id]);

            const currTime = getTime();
            await dbQuery(`
            UPDATE messages_new
            SET edited_at=?,text=?,can_fix_to=0,comment=NULL,
            comment_author_id=NULL,commented_at=NULL,chance_positive_mark=0
            WHERE id=?`, [currTime, newText, id])
            if(ticketInfo.status === TICKET_STATUSES.WAIT_EDIT) {
                await this.setStatus(ticketInfo.id, TICKET_STATUSES.ANSWERED, ticketInfo.current_agent);
            }
        }
        return {id: messageInfo.id, ticketId: messageInfo.ticket_id}
    }
    async writeComment(authorId: number, messageId: number, comment: string) {
        const [messageInfo] = await this.getMessagesByIds([messageId]);
        if(!messageInfo) throw genError(11);
        if(messageInfo.comment && messageInfo.comment_author_id !== authorId) throw genError(19);
        const [ticketInfo] = await this.getByIds([messageInfo.ticket_id]);
        if(ticketInfo.status === TICKET_STATUSES.CLOSED) throw genError(14);

        const currTime = getTime();
        await dbQuery(`
            UPDATE messages_new
            SET can_fix_to=?,comment=?,
            comment_author_id=?,commented_at=?
            WHERE id=?`, [messageInfo.mark === -1 ? currTime+TIMES.day : 0, comment, authorId, currTime, messageId])
        if(messageInfo.mark === -1){
            await this.setStatus(ticketInfo.id, TICKET_STATUSES.WAIT_EDIT, ticketInfo.current_agent);
        }
        return {id: messageInfo.id, ticketId: messageInfo.ticket_id}
    }

    async markMessage(authorId: number, id: number, mark: number) {
        const [messageInfo] = await this.getMessagesByIds([id]);
        if(!messageInfo) throw genError(11);
        const [ticketInfo] = await this.getByIds([messageInfo.ticket_id]);
        if(messageInfo.mark === mark) throw genError(13);
        if(ticketInfo.status === TICKET_STATUSES.CLOSED) throw genError(14);
        if(mark === 0 && !messageInfo.comment) throw genError(18);
        const messageAuthor = messageInfo.author_id;
        const time = getTime();
        let canFixTo = 0;
        let markAuthor = authorId;
        if(mark === -1) {
            canFixTo = time + TIMES.day;
            markAuthor = 0;
        }

        await dbQuery(`
        UPDATE messages_new
        SET mark=?, can_fix_to=?, mark_author_id=?, marked_at=?, comment=NULL, comment_author_id=NULL, commented_at=NULL
        WHERE id=?`, [mark, canFixTo, markAuthor, time, id])

        let flashSpecial = '';
        if (this.user.info.age <= this.user.info.mark_day
            && this.user.info.flash === 0) {
            flashSpecial = `,flash=${getTime()}`;
        }
        await dbQuery(`
            UPDATE users
            SET good_answers=good_answers+1,
            mark_day=mark_day+1,
            total_answers=total_answers+1${flashSpecial}
            WHERE id=?`,
            [this.user.id]);

        let money = '';
        let markCounter = '';
        let coefficient = '';
        switch(mark) {
            case 0:
                markCounter = 'bad_answers=bad_answers+1';
                coefficient = 'coff_active=coff_active-4'
                money = 'money=money-30';
                await this.setStatus(ticketInfo.id, TICKET_STATUSES.CREATED);
                break;

            case 1:
                markCounter = 'good_answers=good_answers+1';
                coefficient = 'coff_active=coff_active+16';
                if(ticketInfo.is_donut) {
                    money = `money=money+${MONEY_GOOD_MARK*DONUT_TICKET_COEFFICIENT},donuts=donuts+${DONUTS_GOOD_MARK}`
                } else {
                    money = `money=money+${MONEY_GOOD_MARK}`
                }
                await this.setStatus(ticketInfo.id, TICKET_STATUSES.ANSWERED);
                break;
            case -1:
                if(messageInfo.mark === 1) {
                    markCounter = 'good_answers=good_answers-1';
                    coefficient = 'coff_active=coff_active-16';
                    const moneyCancelledCoeff = ticketInfo.is_donut ? DONUT_TICKET_COEFFICIENT : 0;
                    money = `money=money-${MONEY_GOOD_MARK*moneyCancelledCoeff}`
                }
                if(messageInfo.mark === 0) {
                    markCounter = 'bad_answers=bad_answers-1';
                    coefficient = 'coff_active=coff_active+4'
                    money = 'money=money+30';
                }
                break;
        }
        await dbQuery(`
        UPDATE users
        SET ${money},${coefficient},${markCounter}
        WHERE id=?`, [messageAuthor])
        return true;
    }
    async setStatus(ticketId: number, status: number, currentAgent=0) {
        return await dbQuery(`
        UPDATE tickets_new
        SET status=?,current_agent=?,last_action=?
        WHERE id=?`, [status, currentAgent, getTime(), ticketId])
    }
    async reserve(aid: number, ticketId: number): Promise<boolean> {
        const [ticketInfo] = await this.getByIds([ticketId]);
        if(!ticketInfo) throw genError(11);
        if(this.user.permissions >= PERMISSIONS.special) return true;
        if(aid === ticketInfo.current_agent) return true;
        if(ticketInfo.current_agent !== 0) throw genError(403);
        const reservedTickets = await dbQuery<ticketIdsCol[]>(`SELECT id FROM tickets_new WHERE current_agent=? AND status=?`,
            [aid, TICKET_STATUSES.RESERVED]);
        if(reservedTickets.length > 0) {
            for(const {id} of reservedTickets) {
                await this.setStatus(id, TICKET_STATUSES.CREATED);
            }
        }
        if(ticketInfo.status === TICKET_STATUSES.CREATED) {
            await this.setStatus(ticketId, TICKET_STATUSES.RESERVED, aid);
        }
        return true
    }
    async close(ticketId: number) {
        const userMessagesNoMark = await dbQuery<IMessage[]>(`SELECT id
            FROM messages_new
            WHERE ticket_id=? AND author_id>0 AND mark=?`,
            [ticketId, -1])
        if(userMessagesNoMark.length>0) throw genError(15);
        await this.setStatus(ticketId, TICKET_STATUSES.CLOSED);
        return true;
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
                comment_author_id: message.comment_author_id,
                text: message.text,
                can_fix_to: message.can_fix_to,
                edited_at: message.edited_at,
                created_at: message.created_at,
            };
            if(userPerms > PERMISSIONS.agent) {
                outMessage.mark_author_id = message.mark_author_id;
            }
            outArr.push(outMessage);
        }
        return outArr;
    }

}