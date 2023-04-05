import { Tappable, classNames } from '@vkontakte/vkui';
import React from 'react';
import style from './colors.module.css';


export const PurchasedColor = ({color, onClick, selected=false}: {color: string, onClick: VoidFunction, selected: boolean}) => {
    return (
        <div className={style.color__tap_zone}>
            <Tappable onClick={onClick} className={classNames(selected && style.selected)}>
                <div className={style.color} style={{backgroundColor: color}}></div>
            </Tappable>
        </div>
    )
}