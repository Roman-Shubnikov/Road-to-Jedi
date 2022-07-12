import React, {useState} from 'react';
import { 
    Panel,
    Group,
    Div,
    Title,
    Subhead,
    Separator,
    } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { getHumanyTime, NicknameMenager } from '../../../Utils';
import { ProfileTags } from '../../../components/ProfileTags';
import { useUser } from '../../../hooks';
import { InfoCell } from '../../../components/InfoCell';
import InfoArrows from '../../../components/InfoArrows';
import { PERMISSIONS } from '../../../config';


export const Home = props => {
    const { account } = useUser();
    return (
        <Panel id={props.id}>
            <Group>
                <Div style={{paddingBottom: 0}}>
                    <Title level="2" style={{ marginBottom: 5 }}>
                        <div style={{ display: "flex" }}>
                            <NicknameMenager 
                            nickname={account.nickname}
                            agent_id={account.id}
                            perms={account.permissions}
                            need_num={false} />
                            <ProfileTags
                            size='m'
                                flash={account.flash}
                                donut={account.donut}
                                verified={account.verified} />
                        </div>
                    </Title>
                    <Subhead weight="2" style={{ marginBottom: 16 }}>
                        {account.publicStatus || "Играю в любимую игру"}
                    </Subhead>
                </Div>
                <Separator />
                <Div>
                    <InfoCell name={'Дата регистрации:'}>
                        {getHumanyTime(account.registered).date}
                    </InfoCell>
                    <InfoCell name={'Цифровой ID:'}>
                        {'#'+account.id}
                    </InfoCell>
                </Div>
                <Separator />
                <InfoArrows
                special={account.permissions >= PERMISSIONS.special}
                good_answers={account.good_answers}
                bad_answers={account.bad_answers}
                total_answers={account.total_answers}
                />

            </Group>

        </Panel>
    )
}