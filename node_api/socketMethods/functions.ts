import {ERRORS} from "../config";
import {defaultSoket} from "../types/soket_io";


export const sendError = (socket: defaultSoket, code: number, customReason: string|null =null) => {
    socket.emit('ERROR', {code, reason: customReason ?? ERRORS[code]})
}
export const sendErrorMaxLength = (socket: defaultSoket, fieldName: string, min: number, max: number) => {
    sendError(socket, 3, `Длина поля ${fieldName} должна быть в пределах от ${min} до ${max}`)
}