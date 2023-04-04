import { Tappable } from '@vkontakte/vkui';
import React from 'react';
import style from './colors.module.css';


export const PurchasedColor = ({color}: {color: string}) => {
    return (
        <Tappable>
            <div className={style.color__tap_zone}>
                <div className={style.color} style={{backgroundColor: color}}></div>
            </div>
        </Tappable>
    )
}