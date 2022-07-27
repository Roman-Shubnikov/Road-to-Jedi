import Tickets from "../data/tickets";
import {sendError, sendErrorMaxLength} from "./functions";
import {defaultSoket} from "../types/soket_io";
import validator from 'validator';
import {MAX_MESSAGE_LENGTH} from "../config";

export default (io, socket: defaultSoket) => {
    const getTickets = async (data) => {
        const offset = data.offset;
        if(!await socket.customLimiter(2)) return;
        if(isNaN(offset)) return sendError(socket, 2)
        const tickets = new Tickets();
        const res = await tickets.getOpened(offset);
        if(!res.count) return sendError(socket, 0);
        const authorIds = res.tickets.map(v => v.author_id);
        const usersInfo = await socket.user.getByIds(authorIds);
        socket.emit('TICKETS_CURR', {...res, users: usersInfo})
    }
    const getTicketById = async (data) => {
        const { id, reserve=true } = data;
        if(!await socket.customLimiter(2)) return;
        if(isNaN(id) || !validator.isBoolean(reserve)) return sendError(socket, 2)
        const tickets = new Tickets();
        const res = await tickets.getByIds([id]);
        if(!res.length) return sendError(socket, 0);
        await tickets.reserve(socket.user.id, id);
        const authorIds = res.map(v => v.author_id);
        const usersInfo = await socket.user.getByIds(authorIds);


        socket.emit('TICKETS_BY_ID', {ticket: res[0], users: usersInfo});
    }
    const getTicketsMyReview = async () => {
        if(!await socket.customLimiter(2)) return;
        const tickets = new Tickets();
        const res = await tickets.getReviewedByUser(socket.user.id);
        const authorIds = res.map(v => v.author_id);
        const users = await socket.user.getByIds(authorIds);
        socket.emit('TICKETS_MY_REVIEW', {tickets: res, users})
    }
    const sendMessage = async (data) => {
        // tslint:disable-next-line:prefer-const
        let { text, ticket_id } = data;
        text = validator.trim(text);
        if(!await socket.customLimiter(5)) return;
        if(!validator.isLength(text, {min: 1, max: MAX_MESSAGE_LENGTH})) {
            return sendErrorMaxLength(socket, 'text', 1, MAX_MESSAGE_LENGTH);
        }
        if(isNaN(ticket_id)) return sendError(socket, 2)
        const tickets = new Tickets();
        await tickets.sendMessage(socket.user.id, ticket_id, text)
        const info = { offset: 0, ticket_id };
        await getMessagesByTicketId(info);
    }
    const getMessagesByTicketId = async (data) => {
        const { offset, ticket_id } = data;
        if(!await socket.customLimiter(5)) return;
        if(isNaN(offset) || isNaN(ticket_id)) return sendError(socket, 2);
        const tickets = new Tickets();
        // tslint:disable-next-line:prefer-const
        let {count, messages} = await tickets.getMessagesByTicketId(ticket_id, offset);
        messages = tickets.formatMessages(messages, socket.user.permissions).reverse();
        const authorIds = messages.map(v => v.author_id);
        const users = await socket.user.getByIds(authorIds);
        socket.emit('TICKETS_MESSAGES_BY_TICKET_ID', {count, messages, users})
    }


    socket.on('TICKETS_GET', getTickets);
    socket.on('TICKET_GET_BY_ID', getTicketById);
    socket.on('TICKETS_MY_REVIEW', getTicketsMyReview);
    socket.on('TICKETS_SEND_MESSAGE', sendMessage);
    socket.on('TICKETS_GET_MESSAGES_BY_TICKET_ID', getMessagesByTicketId);
}