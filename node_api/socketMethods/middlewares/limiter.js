const {sendError} = require("../functions");

const {RateLimiterMemory} = require('rate-limiter-flexible');

const opts = {
    points: 100,
    duration: 10,
};
const rateLimiter = new RateLimiterMemory(opts);

module.exports = async (socket, next) => {
    socket.limiter = async (points) => {
        try {
            await rateLimiter.consume(socket.id, points);
            return true;
        } catch {
            sendError(socket, 'RATE_LIMIT', 'Вы привысили лимит');
            return false;
        }
    }
    if(!await socket.limiter(1)){
        next(new Error());
    }
    next();



};