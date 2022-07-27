import mysqlLib from 'mysql';

export const CLIENT_SECRET = 'Xb10AoQB1SVlDsjnp9Sv';
export const pool = mysqlLib.createPool({
    host     : '89.223.126.48',
    user     : 'jedi',
    password : 'Road019283roman22',
    database: 'roadjedi',
});
export const API_VK_VERSION = '5.131';
export const API_VK_TOKEN = '7954165a7954165a7954165ad7792506c0779547954165a1926e608a1edb10e7f73972f';
export const API_VK_URL = 'https://api.vk.com';
export const AVATAR_URL = 'https://xelene.ru/road/php/images/avatars';

export const MAX_DB_ELEMENTS = 100;
export const MAX_MESSAGE_LENGTH = 4040;
export const ERRORS = {
    1: 'Вы привысили лимит',
    2: 'Невалидные данные',
    3: 'Неверная длина поля',
}
export const PERMISSIONS = {
    agent: 1,
    special: 2,
    admin: 20,
}
export const TICKET_STATUSES = {
    CREATED: 0,
    RESERVED: 1,
    ANSWERED: 2,
    WAIT_EDIT: 3,
    WAIT_ANSWER: 4,
    CLOSED: 5,
}