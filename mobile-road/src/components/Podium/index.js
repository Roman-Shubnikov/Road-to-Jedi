import {
    Avatar,
    Spacing,
    Text,
    Div,
    Counter
} from '@vkontakte/vkui';
import React from 'react';
import { PERMISSIONS } from '../../config';
import './podium.css';


const PodiumDescription = ({ num, nickname, perms }) => {
    const agent = <span>Агент<br/>Поддержки</span>
    const special = <span>Специальный<br/>Агент</span>
    return <>
        <Spacing />
        <Text style={{ height: 40, width: 94, }}>
            {nickname ? nickname : perms >= PERMISSIONS.special ? special : agent}
        </Text>
        <Spacing size={4} />
        <Text style={{ color: 'var(--description_color)' }}>
            #{num}
        </Text>
        </>
}

export const Podium = ({ users, goOtherProfile }) => {
    const [u1, u2, u3] = users;
    return (
        <Div>
            <div className="podium">
                {u2 && <div className="podium_column" onClick={() => {goOtherProfile(u2.id, true);}}>
                    <div className="podium_column_avatar-border" style={{border: '3px solid var(--silver)'}}>
                        <Avatar shadow={false} size={67} src={u2.avatar.url} />
                        <Counter size='m' className='podium_column_avatar_badge silver'>2</Counter>
                    </div>
                    <PodiumDescription
                        num={u2.id}
                        perms={u2.permissions}
                        nickname={u2.nickname} />
                </div>}
                {u1 && <div className="podium_column" onClick={() => {goOtherProfile(u1.id, true);}}>
                    <div className="podium_column_avatar-border" style={{border: '3px solid var(--gold)'}}>
                        <Avatar shadow={false} size={92} src={u1.avatar.url} />
                        <Counter size='m' className='podium_column_avatar_badge gold'>1</Counter>
                    </div>


                    <PodiumDescription
                        perms={u1.permissions}
                        num={u1.id}
                        nickname={u1.nickname} />
                </div>}
                {u3 && <div className="podium_column" onClick={() => {goOtherProfile(u3.id, true);}}>
                    <div className="podium_column_avatar-border" style={{border: '3px solid var(--bronze)'}}>
                        <Avatar shadow={false} size={67} src={u3.avatar.url} />
                        <Counter size='m' className='podium_column_avatar_badge bronze'>3</Counter>
                    </div>
                    <PodiumDescription
                        perms={u3.permissions}
                        num={u3.id}
                        nickname={u3.nickname} />
                </div>}

            </div>
            {users.length > 3 && <Spacing separator />}
        </Div>

    )
}