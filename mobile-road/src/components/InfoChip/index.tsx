import React, { ReactNode } from 'react';
import style from './infoChip.module.css';
import { Text, Tappable, TappableProps } from '@vkontakte/vkui';


export const InfoChip = ({children, icon, ...props}: {children: string, icon: ReactNode, props?: TappableProps}) => {
    return (
        <Tappable className={style.root} {...props}>
            {icon}
            <Text className={style.text}>{children}</Text>
        </Tappable>
    )
}