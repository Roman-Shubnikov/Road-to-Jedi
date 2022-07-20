import Tickets from "../data/tickets.js";
import {sendError} from "./functions.js";

export default (io, socket) => {
    const getTickets = async (data) => {
        let offset = data.offset;
        if(isNaN(offset)) return sendError(socket, 2)
        if(!await socket.limiter(2)) return;
        let tickets = new Tickets();
        let res = await tickets.getOpened(offset);
        socket.emit('TICKETS_CURR', res)
    }
    const getTicketsMyReview = async () => {
        if(!await socket.limiter(2)) return;
        let tickets = new Tickets();
        let res = await tickets.getReviewedByUser(socket.user.id);
        socket.emit('TICKETS_MY_REVIEW', res)
    }
    socket.on('TICKETS_GET', getTickets)
    socket.on('TICKETS_MY_REVIEW', getTicketsMyReview)
}