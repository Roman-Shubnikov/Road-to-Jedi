import {TICKET_STATUS_TEXTS} from "../config";

export type ITicket = {
    id: number,
    author_id: number,
    status: keyof typeof TICKET_STATUS_TEXTS,
    title: string,
    created_at: number,

}