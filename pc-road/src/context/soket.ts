import React from 'react';
import { io, Socket} from "socket.io-client";
import { SOCKET_URL } from "../config";

export const socket: Socket = io(SOCKET_URL, {
    query: {
        url: window.location.search.replace('?', ''),
    }
}).connect();
export const SocketContext = React.createContext<Socket>(socket);