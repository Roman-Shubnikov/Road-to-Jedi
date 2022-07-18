module.exports.sendError = (socket, type, reason='') => {
    socket.emit('ERROR', {type, reason})
}