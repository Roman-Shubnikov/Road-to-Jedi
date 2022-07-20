import limiter from './limiter.js';
import auth from './auth.js';


export default (io) => {
    io.use(limiter);
    io.use(auth);
}