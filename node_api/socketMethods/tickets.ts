import Tickets from "../data/tickets";
import {sendError, sendErrorMaxLength} from "./functions";
import {defaultSoket} from "../types/soket_io";
import validator from 'validator';
import {MAX_MESSAGE_LENGTH, NAME_TICKET_ROOM, PERMISSIONS} from "../config";
import {isBoolean} from "../functions";


export default (io, socket: defaultSoket) => {
    const user = socket.user;
    const getTickets = async (data) => {
        const offset = data.offset;
        if(!await socket.customLimiter(2)) return;
        if(isNaN(offset)) return sendError(socket, 2)
        const tickets = new Tickets(user);
        const res = await tickets.getOpened(offset);
        if(!res.count) return sendError(socket, 0);
        const authorIds = res.tickets.map(v => v.author_id);
        const usersInfo = await socket.user.getByIds(authorIds);
        socket.emit('TICKETS_CURR', {...res, users: usersInfo})
    }
    const getTicketById = async (data) => {
        const { id, reserve=true } = data;
        if(!await socket.customLimiter(2)) return;
        if(isNaN(id) || !isBoolean(reserve)) return sendError(socket, 2)
        const tickets = new Tickets(user);
        const [ticketInfo] = await tickets.getByIds([id]);
        if(!ticketInfo) return sendError(socket, 0);
        await tickets.reserve(socket.user.id, id);
        for(const room of socket.rooms) {
            if(room.startsWith(NAME_TICKET_ROOM)) {
                socket.leave(room);
            }
        }
        socket.join(NAME_TICKET_ROOM + ticketInfo.id);
        const userInfo = await socket.user.getByIds([ticketInfo.author_id]);
        socket.emit('TICKETS_BY_ID', {ticket: ticketInfo, users: userInfo});
    }
    const unsubscribeTicket = (data) => {
        const { ticket_id } = data;
        socket.leave(NAME_TICKET_ROOM + ticket_id);
    }
    const getTicketsMyReview = async () => {
        if(!await socket.customLimiter(2)) return;
        const tickets = new Tickets(user);
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
        const tickets = new Tickets(user);
        tickets.sendMessage(ticket_id, text)
            .then(async () => {
                io.to(NAME_TICKET_ROOM + ticket_id)
                    .emit('TICKETS_MESSAGES_UPDATED', {});
            })
            .catch(e => sendError(socket, 0, e.message))
    }

    const getMessagesByTicketId = async (data) => {
        const { offset, ticket_id } = data;
        if(!await socket.customLimiter(5)) return;
        if(isNaN(offset) || isNaN(ticket_id)) return sendError(socket, 2);
        const tickets = new Tickets(user);
        // tslint:disable-next-line:prefer-const
        let {count, messages} = await tickets.getMessagesByTicketId(ticket_id, offset);
        messages = tickets.formatMessages(messages, socket.user.permissions).reverse();
        const authorIds = messages.map(v => v.author_id);
        const users = await socket.user.getByIds(authorIds);
        socket.emit('TICKETS_MESSAGES_BY_TICKET_ID', {count, messages, users})
    }



    const markMessage = async (data) => {
        const { message_id, mark } = data;
        if(isNaN(message_id) || isNaN(mark)) return sendError(socket, 2);
        if(!(await user.checkPermission(PERMISSIONS.special))) return sendError(socket, 403);
        const tickets = new Tickets(user);
        const [message] = await tickets.getMessagesByIds([message_id]);
        if(!message) return sendError(socket, 404);
        if(message.author_id < 0) return sendError(socket, 403);
        if(message.mark !== -1
            && message.mark_author_id !== user.id
            && user.permissions < PERMISSIONS.admin) return sendError(socket, 12);

        await tickets.markMessage(user.id, message_id, mark);
        io.to(NAME_TICKET_ROOM + message.ticket_id).emit('TICKETS_MESSAGES_UPDATED', {});
    }


    socket.on('TICKETS_GET', getTickets);
    socket.on('TICKET_GET_BY_ID', getTicketById);
    socket.on('TICKETS_MY_REVIEW', getTicketsMyReview);
    socket.on('TICKETS_SEND_MESSAGE', sendMessage);
    socket.on('TICKETS_GET_MESSAGES_BY_TICKET_ID', getMessagesByTicketId);
    socket.on('TICKETS_MARK_MESSAGE', markMessage)
    socket.on('TICKETS_UNSUBSCRIBE', unsubscribeTicket)
}