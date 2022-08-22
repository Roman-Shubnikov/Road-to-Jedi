import React from 'react';
import { Link } from "@vkontakte/vkui";
import { PERMISSIONS } from '../config';

const timeDropHMS = (date: any) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0, 0);
}

export const getTime = (): number => {
    return Math.floor(new Date().getTime() / 1000);
}

export const getHumanyTime = (unixtime: number, needStringFormat=false) => {
    unixtime = unixtime * 1e3;
    let dateObject = new Date(unixtime),
        today = new Date(),
        yesterday = new Date();
    yesterday.setDate(today.getDate() -1);

    let month = monthsConvert(dateObject.getMonth())
    let year = dateObject.getFullYear()
    let day = dateObject.getDate()
    let hours = normalizeTime(dateObject.getHours())
    let minutes = normalizeTime(dateObject.getMinutes())

    timeDropHMS(today);
    timeDropHMS(yesterday);
    timeDropHMS(dateObject);
    let date = '';
    if(needStringFormat) {
        if (today.getTime() === dateObject.getTime()) {
            date = 'Сегодня'
        } else if (yesterday.getTime() === dateObject.getTime()) {
            date = 'Вчера'
        }
    }
    if(!date) {
        date = day + " " + month + " " + year;
    }

    let time = hours + ":" + minutes;
    let datetime = date + " " + time;
    return ({ date, time, year, month, day, hours, minutes, datetime })
}
export const timeConvertVal = (val: number, num: string) => {
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

export const normalizeTime = (time: number) => {
    if (time < 10) {
        return "0" + time
    } else {
        return time
    }
}
export const monthsConvert = (sequence: number) => {
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
    return mounts[sequence]
}
export const enumerate = (num: number, dec: string[]) => {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
}
export const recog_number = (num: number): string => {
    let out;
    if (num > 999999) {
        out = Math.floor(num / 1000000 * 10) / 10 + "M"
    } else if (num > 999) {
        out = Math.floor(num / 1000 * 10) / 10 + "K"
    } else {
        out = ''+num
    }
    return out;
};
export const getRandomInRange = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const LinkHandler = (props: { href: string | undefined; children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
    return(
        <Link href={props.href} target="_blank" rel="noopener noreferrer">{props.children}</Link>
    )
}

// @ts-ignore
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

