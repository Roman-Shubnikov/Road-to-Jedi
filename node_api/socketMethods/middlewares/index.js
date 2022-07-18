const limiter = require('./limiter');

module.exports = (io) => {
    io.use(limiter);
    return io;
}