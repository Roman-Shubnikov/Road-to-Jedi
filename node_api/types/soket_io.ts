import * as Buffer from "buffer";
import {Server, Socket} from "socket.io";
import {IUser} from "../data/user";

export interface ServerToClientEvents {
    [event: string]: (object) => void;
}

export interface ClientToServerEvents {
    [event: string]: (object) => any,
}

export interface InterServerEvents {
    [event: string]: (object) => any,
}

export interface SocketData {
    name: string;
    age: number;
    user: IUser,
}
export type defaultSoket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> & {
    user?: IUser,
    customLimiter?: (number) => Promise<boolean>
};