import limiter from './limiter';
import auth from './auth';
import rooms from './rooms.init'
import {Server} from "socket.io";


export default (io: Server) => {
    io.use(limiter);
    io.use(auth);
    io.use(rooms);
}