import React, { ReactNode } from 'react';
import style from './infoChip.module.css';
import { Text, Tappable, TappableProps } from '@vkontakte/vkui';


export const InfoChip = ({children, icon, disabled=true, ...props}: {children: string, icon: ReactNode, disabled?: boolean, props?: TappableProps}) => {
    return (
        <Tappable className={style.root} disabled={disabled} {...props}>
            {icon}
            <Text className={style.text}>{children}</Text>
        </Tappable>
    )
}