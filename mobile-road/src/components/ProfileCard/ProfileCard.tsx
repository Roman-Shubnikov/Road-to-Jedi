import { 
    Group, 
    classNames,
    Avatar,
    Div,
    calcInitialsAvatarColor,
    Tappable,


} from '@vkontakte/vkui';
import React from 'react';
import style from './profile-card.module.css';
import { NicknameMenager } from '../../Utils';
import { ProfileTags } from '../ProfileTags';
import { InfoChipsStatistic } from '../InfoChipsStatistic';


export type ProfileCardProps = { 
    avatarUrl: string,
    profileId: number,
    nickname: string,
    permissions: number,
    flash: number,
    donut: number,
    verified: number,
    publicStatus: string,
    good: string,
    bad: string,
    total: string,
    onClickStatus: VoidFunction,

}
const gradientStyles = {
    1: style['Avatar--gradient-red'],
    2: style['Avatar--gradient-orange'],
    3: style['Avatar--gradient-yellow'],
    4: style['Avatar--gradient-green'],
    5: style['Avatar--gradient-blue'],
    6: style['Avatar--gradient-l-blue'],
    7: style['Avatar--gradient-violet'],
  };

export const ProfileCard = ({
    avatarUrl,
    profileId,
    nickname,
    permissions,
    flash,
    donut,
    verified,
    good,
    bad,
    total,
    publicStatus,
    onClickStatus,

}: ProfileCardProps) => {
    const enabledStatusClick = !!onClickStatus;
    return (
        <Group className={classNames(gradientStyles[calcInitialsAvatarColor(profileId)], style.backgroundProfile)}>
            <div style={{height: 357}}></div>
            <Div className={style.head_root}>
                <div className={style.avatar}>
                    <Avatar withBorder={false} size={104} src={avatarUrl} alt='ava' />
                </div>
                
                <div
                className={style.agentName}>
                    <NicknameMenager 
                    need_num={false}
                    nickname={nickname}
                    agent_id={profileId}
                    perms={permissions} />
                    <ProfileTags
                    size='m'
                    flash={flash}
                    donut={donut}
                    verified={verified} />
                </div>
                <Tappable
                hasActive={enabledStatusClick}
                hasHover={enabledStatusClick}
                onClick={onClickStatus}
                className={style.publicStatus}>
                    {publicStatus}
                </Tappable>
            
            
            <InfoChipsStatistic
                className={style.statistic}
                good={good}
                bad={bad}
                total={total} />
        </Div>
    </Group>
    )
}