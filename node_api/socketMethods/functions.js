import {ERRORS} from "../config.js";

export const sendError = (socket, code, customReason=null) => {
    socket.emit('ERROR', {code, reason: customReason ?? ERRORS[code]})
}