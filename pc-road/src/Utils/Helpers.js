import React from 'react';
import { Link } from "@vkontakte/vkui";
import { PERMISSIONS } from '../config';

export const getHumanyTime = (unixtime) => {
    let date, time, year, month, day, hours, minutes, datetime;
    if (unixtime !== null) {
        unixtime = unixtime * 1e3;
        let dateObject = new Date(unixtime);
        month = monthsConvert(dateObject.getMonth())
        year = dateObject.getFullYear()
        day = dateObject.getDate()
        date = day + " " + month + " " + year;
        hours = normalizeTime(dateObject.getHours())
        minutes = normalizeTime(dateObject.getMinutes())
        time = hours + ":" + minutes;
        datetime = date + " " + time
    }
    return ({ date, time, year, month, day, hours, minutes, datetime })
}
export const timeConvertVal = (val, num) => {
    let time = 0;
    if(num === 'sec'){
        time = Number(val);
    }else if(num === 'min'){
        time = val * 60;
    }else if(num === 'day'){
        time = val * 24 * 60 * 60;
    }
    return time
}
export const normalizeTime = (time) => {
    if (time < 10) {
        return "0" + time
    } else {
        return time
    }
}
export const monthsConvert = (text) => {
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
    return mounts[text]
}
export const enumerate = (num, dec) => {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
}
export const recog_number = (num) => {
    let out = ""
    if (num > 999999) {
        out = Math.floor(num / 1000000 * 10) / 10 + "M"
    } else if (num > 999) {
        out = Math.floor(num / 1000 * 10) / 10 + "K"
    } else {
        out = num
    }
    return out;
};
export const getRandomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const LinkHandler = props => {
    return(
        <Link href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</Link>
    )
}

export const NicknameMenager = ({perms, nickname, agent_id, need_num=true}) => {
    if(nickname) {
        return nickname;
    }
    if(perms >= PERMISSIONS.admin) {
        return 'Администратор';
    }
    if(perms >= PERMISSIONS.special) {
        return 'Специальный агент';
    }
    
    if(need_num) {
        return 'Агент Поддержки #' + agent_id;
    }
    return 'Агент Поддержки';
}

export const arrEquals = (arr1, arr2) => {
    return !!(arr1.length === arr2.length && arr2.every(function(element, index) {
    return element === arr2[index];
}))
}