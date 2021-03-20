import React from 'react';

import { 
    Panel,
    PanelHeader,
    Placeholder,
    Button,
    Group,
    PanelSpinner,
    } from '@vkontakte/vkui';
import Icon56DurationOutline from '@vkontakte/icons/dist/56/duration_outline';
import { getHumanyTime } from '../../../Utils';


export default props => {
    return (
        <Panel id={props.id}>
            <PanelHeader
            >
                Ban
                </PanelHeader>
            {props.BanObject ? 
                <Group>
                    <Placeholder
                        icon={<Icon56DurationOutline style={{ color: 'var(--dynamic_red)' }} />}
                        header='Ваш аккаунт был заблокирован'
                        action={<Button href='https://vk.me/club201542328' target="_blank" rel="noopener noreferrer" size="l">Связаться с нами</Button>}>
                        Истекает: {props.BanObject.time_end ? getHumanyTime(props.BanObject.time_end).datetime : "Никогда(infinite)"}<br />
                        Причина:<br />{props.BanObject.reason ? props.BanObject.reason : "Не указана"}
                    </Placeholder>
                </Group>
                : <PanelSpinner />
            }
            
        </Panel>
    )
}