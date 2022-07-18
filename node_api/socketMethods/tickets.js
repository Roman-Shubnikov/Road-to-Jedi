const {db_query} = require( "../db");

module.exports = (io, socket) => {
    const getTickets = async () => {
        if(!await socket.limiter(2)) return;
        let res = await db_query('SELECT * FROM tickets LIMIT 5')
        socket.emit('TICKETS_CURR', res)
    }
    socket.on('TICKETS_GET', getTickets)
}