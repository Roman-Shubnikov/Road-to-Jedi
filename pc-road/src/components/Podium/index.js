import {
    Avatar,
    Spacing,
    Text,
    Div,
    Counter,
    Tappable
} from '@vkontakte/vkui';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { PERMISSIONS } from '../../config';
import './podium.css';


const PodiumDescription = ({ num, nickname, perms, donut, change_color_donut}) => {
    const agent = <span>Агент<br/>Поддержки</span>
    const special = <span>Специальный<br/>Агент</span>
    return <>
        <Spacing />
        <Text style={{ height: 40, width: 94, color: (donut && change_color_donut) ? "var(--top_moderator_name_donut)" : "var(--top_moderator_name)"}}>
            {nickname ? nickname : perms >= PERMISSIONS.special ? special : agent}
        </Text>
        <Spacing size={4} />
        <Text style={{ color: 'var(--description_color)' }}>
            #{num}
        </Text>
        </>
}

export const Podium = ({ users=[1,2,3], goOtherProfile, skeleton=false }) => {
    const [u1, u2, u3] = users;
    if(skeleton) return (
        <div className="podium">
            {Array(3).fill().map((num, i) => (
                <div className="podium_column" key={i}>
                    <div style={{marginBottom: 10}}>
                        <Skeleton circle={true} width={67} height={67} />
                    </div>
                    <Skeleton height={40} width={94} style={{marginBottom: 10}} />
                    <Skeleton height={20} width={94} />
                </div>
            ))}
            
        </div>)
    return (
        <Div>
            <div className="podium">
                {u2 && <Tappable className="podium_column" onClick={() => {goOtherProfile(u2.id, true);}}>
                    <div className="podium_column_avatar-border" style={{border: '3px solid var(--silver)'}}>
                        <Avatar shadow={false} size={67} src={u2.avatar.url} />
                        <Counter size='m' className='podium_column_avatar_badge silver'>2</Counter>
                    </div>
                    <PodiumDescription
                        donut={u2.donut}
                        change_color_donut={u2.change_color_donut}
                        num={u2.id}
                        perms={u2.permissions}
                        nickname={u2.nickname} />
                </Tappable>}
                {u1 && <Tappable className="podium_column" onClick={() => {goOtherProfile(u1.id, true);}}>
                    <div className="podium_column_avatar-border" style={{border: '3px solid var(--gold)'}}>
                        <Avatar shadow={false} size={92} src={u1.avatar.url} />
                        <Counter size='m' className='podium_column_avatar_badge gold'>1</Counter>
                    </div>


                    <PodiumDescription
                        donut={u1.donut}
                        change_color_donut={u1.change_color_donut}
                        perms={u1.permissions}
                        num={u1.id}
                        nickname={u1.nickname} />
                </Tappable>}
                {u3 && <Tappable className="podium_column" onClick={() => {goOtherProfile(u3.id, true);}}>
                    <div className="podium_column_avatar-border" style={{border: '3px solid var(--bronze)'}}>
                        <Avatar shadow={false} size={67} src={u3.avatar.url} />
                        <Counter size='m' className='podium_column_avatar_badge bronze'>3</Counter>
                    </div>
                    <PodiumDescription
                        donut={u3.donut}
                        change_color_donut={u3.change_color_donut}
                        perms={u3.permissions}
                        num={u3.id}
                        nickname={u3.nickname} />
                </Tappable>}

            </div>
            {users.length > 3 && <Spacing separator />}
        </Div>

    )
}