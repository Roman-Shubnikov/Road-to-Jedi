import crypto from 'crypto';
import {CLIENT_SECRET} from "../../config";
import {User} from "../../data/user";

const verifyLaunchParams = (searchOrParsedUrlQuery, secretKey) => {
    let sign;
    const queryParams = [];
    const parsedUrl = {};

    const processQueryParam = (key, value) => {
        if (typeof value === 'string') {
            if (key === 'sign') {
                sign = value;
            } else if (key.startsWith('vk_')) {
                queryParams.push({key, value});
                parsedUrl[key] = value;
            }
        }
    };

    if (typeof searchOrParsedUrlQuery === 'string') {
        // Если строка начинается с вопроса (когда передан window.location.search),
        // его необходимо удалить.
        const formattedSearch = searchOrParsedUrlQuery.startsWith('?')
            ? searchOrParsedUrlQuery.slice(1)
            : searchOrParsedUrlQuery;

        // Пытаемся спарсить строку как query-параметр.
        for (const param of formattedSearch.split('&')) {
            const [key, value] = param.split('=');
            processQueryParam(key, value);
        }
    } else {
        for (const key of Object.keys(searchOrParsedUrlQuery)) {
            const value = searchOrParsedUrlQuery[key];
            processQueryParam(key, value);
        }
    }
    // Обрабатываем исключительный случай, когда не найдена ни подпись в параметрах,
    // ни один параметр, начинающийся с "vk_", дабы избежать
    // излишней нагрузки, образующейся в процессе работы дальнейшего кода.
    if (!sign || queryParams.length === 0) {
        return false;
    }
    // Снова создаём query в виде строки из уже отфильтрованных параметров.
    const queryString = queryParams
        // Сортируем ключи в порядке возрастания.
        .sort((a, b) => a.key.localeCompare(b.key))
        // Воссоздаём новый query в виде строки.
        .reduce((acc, {key, value}, idx) => {
            return acc + (idx === 0 ? '' : '&') + `${key}=${encodeURIComponent(value)}`;
        }, '');

    // Создаём хеш получившейся строки на основе секретного ключа.
    const paramsHash = crypto
        .createHmac('sha256', secretKey)
        .update(queryString)
        .digest()
        .toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=$/, '');

    return [paramsHash === sign, parsedUrl];
}
export default async (socket, next) => {
    let sign = socket.handshake.query?.url;
    if(!sign) return next(new Error('Unauthorized'));

    const areLaunchParamsValid = verifyLaunchParams(sign, CLIENT_SECRET);
    if(!areLaunchParamsValid[0]) return next(new Error('Unauthorized'));

    socket.user = new User(areLaunchParamsValid[1].vk_user_id);
    await socket.user.getSelf();
    next();
}