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
export const TIME_TO_EDIT_MESSAGE = 60*3;
export const MAX_MESSAGE_NO_MARK_PER_TICKET = 2;
export const ERRORS = {
    0: 'Неизветсная ошибка',
    1: 'Вы привысили лимит',
    2: 'Невалидные данные',
    3: 'Неверная длина поля',
    11: 'Тикет не найден',
    12: 'Вы не можете оценивать ответ, оценённый другим спец. агентом',
    13: 'Сообщение уже имеет оценку',
    14: 'Этот тикет закрыт',
    15: 'Вначале оцените все сообщения в этом тикете',
    16: 'Вы не можете редактировать сообщение, если оно уже оценено',
    17: 'Время редактирования уже прошло',
    18: 'Поясните причину пользователю',
    19: 'Сообщение уже имеет коментарий другого спец. агента',
    20: 'Давайте, вначале, дождёмся ответа собеседника',
    21: 'Вы должны уместить мысли в одно сообщение или отредактируйте старое',
    403: 'Доступ запрещён',
    404: 'Информация не найдена',
}
export const PERMISSIONS = {
    agent: 0,
    special: 1,
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
export const TIMES = {
    minute: 60,
    hour: 60*60,
    day: 60*60*24,
    month: 60*60*24*30,
}
export const NAME_TICKET_ROOM = 'ticket_';

export const MONEY_GOOD_MARK = 10;
export const MONEY_BAD_MARK = 30;
export const DONUTS_GOOD_MARK = 10;
export const DONUT_TICKET_COEFFICIENT = 3;