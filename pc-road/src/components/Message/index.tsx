import React, {ReactNode} from 'react'
import {Anchorme} from 'react-anchorme'
import {Avatar, RichCell} from '@vkontakte/vkui';
import {getHumanyTime} from "../../Utils";

import styles from './message.module.css'

interface MessageProps {
    avatar_url: string,
    author_name: string,
    children: string,
    time: number,
    specialLabel?: string,
    after?: ReactNode,
}

export const Message = (props: MessageProps) => {
    const {
        avatar_url,
        author_name,
        children,
        time,
        after = null,
        specialLabel = null,
    } = props;

    return (
        <RichCell
        disabled
        before={<Avatar src={avatar_url} alt='avatar' />}
        text={<Anchorme onClick={(e) => { e.stopPropagation() }} target="_blank" rel="noreferrer noopener">{children}</Anchorme>}
        caption={getHumanyTime(time).datetime}
        after={after}
        >
            {author_name} {specialLabel && <span className={styles.specialLabel}>{' · '+specialLabel}</span>}
        </RichCell>
    )
}