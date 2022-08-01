import React, {ReactNode} from 'react'
import {Anchorme} from 'react-anchorme'
import {Avatar, RichCell, Separator} from '@vkontakte/vkui';
import {getHumanyTime} from "../../Utils";

import styles from './message.module.css'
import clsx from "clsx";

interface MessageProps {
    separator: boolean,
    avatar_url: string,
    author_name: string,
    children: string,
    time: number,
    specialLabel?: ReactNode,
    after?: ReactNode,
    className?: string,
}

export const Message = (props: MessageProps) => {
    const {
        separator = true,
        avatar_url,
        author_name,
        children,
        time,
        after = null,
        specialLabel = null,
        className = '',
    } = props;

    return (
        <div className={clsx('message', className)}>
            <RichCell
                disabled
                multiline
                after={after}
                before={<Avatar src={avatar_url} alt='avatar' />}
                text={<Anchorme onClick={(e) => { e.stopPropagation() }} target="_blank" rel="noreferrer noopener">{children}</Anchorme>}
                caption={getHumanyTime(time).datetime}
            >
                {author_name} {specialLabel && <span className={styles.specialLabel}>{'·'} {specialLabel}</span>}
            </RichCell>
            {separator && <Separator />}
        </div>

    )
}