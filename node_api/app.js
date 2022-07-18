const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {cors: {
    origin: "https://user413636725-kkigl2pv.wormhole.vk-apps.com",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }});


const tickets = require('./socketMethods/tickets');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

require('./socketMethods/middlewares')(io);
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