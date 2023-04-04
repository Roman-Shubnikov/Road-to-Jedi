import { Tappable } from '@vkontakte/vkui';
import React from 'react';
import style from './icon.module.css';


export const PurchasedIcon = ({icon_url}: {icon_url: string}) => {
    return (
        <Tappable>
            <div className={style.icon__tap_zone}>
                <img className={style.icon} src={icon_url} alt='icon'/>
            </div>
        </Tappable>
    )
}