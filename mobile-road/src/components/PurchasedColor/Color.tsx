import { Tappable } from '@vkontakte/vkui';
import React from 'react';
import style from './colors.module.css';


export const PurchasedColor = ({color}: {color: string}) => {
    return (
        <div className={style.color__tap_zone}>
            <Tappable>
                <div className={style.color} style={{backgroundColor: color}}></div>
            </Tappable>
        </div>
    )
}