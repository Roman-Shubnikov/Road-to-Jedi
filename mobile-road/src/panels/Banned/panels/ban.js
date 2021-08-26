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
import { useSelector } from 'react-redux';
import { LINKS_VK } from '../../../config'

export default props => {
    const BanObject = useSelector((state) => state.account.banInfo)
    return (
        <Panel id={props.id}>
            <PanelHeader
            >
                Ban
                </PanelHeader>
            {BanObject ? 
                <Group>
                    <Placeholder
                        icon={<Icon56DurationOutline style={{ color: 'var(--dynamic_red)' }} />}
                        header='Ваш аккаунт был заблокирован'
                        action={<Button href={LINKS_VK.support_jedi} target="_blank" rel="noopener noreferrer" size="l">Связаться с нами</Button>}>
                        Истекает: {BanObject.time_end ? getHumanyTime(BanObject.time_end).datetime : "Никогда(infinite)"}<br />
                        Причина:<br />{BanObject.reason ? BanObject.reason : "Не указана"}
                    </Placeholder>
                </Group>
                : <PanelSpinner />
            }
            
        </Panel>
    )
}