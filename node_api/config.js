import mysqlLib from 'mysql';



export const CLIENT_SECRET = 'Xb10AoQB1SVlDsjnp9Sv';
export const pool = mysqlLib.createPool({
    host     : '89.223.126.48',
    user     : 'jedi',
    password : 'Road019283roman22',
    database: 'roadjedi',
});
export const MAX_DB_ELEMENTS = 100;
export const ERRORS = {
    1: 'Вы привысили лимит',
    2: 'Невалидные данные',
}