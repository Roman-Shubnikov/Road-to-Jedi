import * as Buffer from "buffer";
import {Server, Socket} from "socket.io";
import User from "../data/user";

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
    user: User,
}
export type defaultSoket = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> & {
    user?: User,
    customLimiter?: (number) => Promise<boolean>
};