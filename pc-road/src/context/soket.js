import React from 'react';
import socketIo from "socket.io-client";
import { SOCKET_URL } from "../config";

export const socket = socketIo.connect(SOCKET_URL);
export const SocketContext = React.createContext();