import {PERMISSIONS} from "../../config";
import {defaultSoket} from "../../types/soket_io";

export default async (socket: defaultSoket, next) => {
    const {permissions} = socket.user.info;
    if(permissions >= PERMISSIONS.special) {
        socket.join('specials');
    }
    next();
}