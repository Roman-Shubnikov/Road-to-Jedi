import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import regMiddleware from './socketMethods/middlewares/index.js';

import tickets from './socketMethods/tickets.js';



const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    }});
// instrument(io, {
//     auth: {
//         type: "basic",
//         username: "roman_dev",
//         password: "$2b$10$074P5pO7J5oFp5Q3GuC4LuTApAy8ymsnD7Jvbr9xA3VDSrMBrHSsO"
//     }
// });

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

regMiddleware(io);
io.on('connection', (socket) => {
    console.log('a user connected');
    tickets(io, socket);
    socket.on("disconnect", (reason) => {
        console.log(`disconnect ${socket.id} due to ${reason}`);
    });
});

server.listen(3009, () => {
    console.log('listening on *:3009');
});