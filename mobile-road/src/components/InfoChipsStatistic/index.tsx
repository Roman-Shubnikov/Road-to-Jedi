import React from 'react';
import style from './infoChipsStatistic.module.css';
import { InfoChip } from '../InfoChip';
import { 
    Icon16CheckCircleOutline,
    Icon16MinusCircleOutline,
    Icon16ArticleBoxOutline,


} from '@vkontakte/icons';
import { classNames } from '@vkontakte/vkui';


export const InfoChipsStatistic = ({good, bad, total, className}: { good: string, bad: string, total: string, className?: string}) => {
    return (
        <div className={classNames(style.root, className)}>
            <InfoChip
            icon={<Icon16CheckCircleOutline />}>
                {good}
            </InfoChip>
            <InfoChip
            icon={<Icon16MinusCircleOutline />}>
                {bad}
            </InfoChip>
            <InfoChip
            icon={<Icon16ArticleBoxOutline />}>
                {total}
            </InfoChip>
        </div>
    )
}