"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NicknameMenager = exports.LinkHandler = exports.getRandomInRange = exports.recog_number = exports.enumerate = exports.monthsConvert = exports.normalizeTime = exports.timeConvertVal = exports.getHumanyTime = void 0;
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const config_1 = require("../config");
const getHumanyTime = (unixtime) => {
    let date, time, year, month, day, hours, minutes, datetime;
    if (unixtime !== null) {
        unixtime = unixtime * 1e3;
        let dateObject = new Date(unixtime);
        month = (0, exports.monthsConvert)(dateObject.getMonth());
        year = dateObject.getFullYear();
        day = dateObject.getDate();
        date = day + " " + month + " " + year;
        hours = (0, exports.normalizeTime)(dateObject.getHours());
        minutes = (0, exports.normalizeTime)(dateObject.getMinutes());
        time = hours + ":" + minutes;
        datetime = date + " " + time;
    }
    return ({ date, time, year, month, day, hours, minutes, datetime });
};
exports.getHumanyTime = getHumanyTime;
const timeConvertVal = (val, num) => {
    let time = 0;
    if (num === 'sec') {
        time = Number(val);
    }
    else if (num === 'min') {
        time = val * 60;
    }
    else if (num === 'day') {
        time = val * 24 * 60 * 60;
    }
    return time;
};
exports.timeConvertVal = timeConvertVal;
const normalizeTime = (time) => {
    if (time < 10) {
        return "0" + time;
    }
    else {
        return time;
    }
};
exports.normalizeTime = normalizeTime;
const monthsConvert = (text) => {
    let mounts = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
    ];
    return mounts[text];
};
exports.monthsConvert = monthsConvert;
const enumerate = (num, dec) => {
    if (num > 100)
        num = num % 100;
    if (num <= 20 && num >= 10)
        return dec[2];
    if (num > 20)
        num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
};
exports.enumerate = enumerate;
const recog_number = (num) => {
    let out;
    if (num > 999999) {
        out = Math.floor(num / 1000000 * 10) / 10 + "M";
    }
    else if (num > 999) {
        out = Math.floor(num / 1000 * 10) / 10 + "K";
    }
    else {
        out = num;
    }
    return out;
};
exports.recog_number = recog_number;
const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomInRange = getRandomInRange;
const LinkHandler = props => {
    return (<vkui_1.Link href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</vkui_1.Link>);
};
exports.LinkHandler = LinkHandler;
const NicknameMenager = ({ perms, nickname, agent_id, need_num = true }) => {
    if (nickname) {
        return nickname;
    }
    if (perms >= config_1.PERMISSIONS.admin) {
        return 'Администратор';
    }
    if (perms >= config_1.PERMISSIONS.special) {
        return 'Специальный агент';
    }
    if (need_num) {
        return 'Агент Поддержки #' + agent_id;
    }
    return 'Агент Поддержки';
};
exports.NicknameMenager = NicknameMenager;
