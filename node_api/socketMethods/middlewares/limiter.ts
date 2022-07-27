import {sendError} from "../functions";

import {RateLimiterMemory} from 'rate-limiter-flexible';

const opts = {
    points: 100,
    duration: 10,
};
const rateLimiter = new RateLimiterMemory(opts);

export default async (socket, next) => {
    socket.customLimiter = async (points) => {
        try {
            await rateLimiter.consume(socket.id, points);
            return true;
        } catch {
            sendError(socket, 1);
            return false;
        }
    }
    if(!await socket.customLimiter(1)){
        next(new Error());
    }
    next();



};