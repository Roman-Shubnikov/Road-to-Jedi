import React from 'react';
import { 
    Panel,
    PanelHeader,
    Group,
    Placeholder,
    PanelHeaderBack,
    Footer
    } from '@vkontakte/vkui';
import { Icon16Like } from '@vkontakte/icons';
import IconJedi from '../../../images/jedi.svg'

export const InfoPanel = props => {
    return (
        <Panel id={props.id}>
            <PanelHeader
                before={
                    <PanelHeaderBack onClick={() => window.history.back()} />
                }>
                О сервисе
                </PanelHeader>
            <Group>
                <Placeholder icon={<img src={IconJedi} alt='jedi' />} >Версия 3.0</Placeholder>
            </Group>
            <Group>
                <Footer style={{display: 'flex', justifyContent: 'center'}}>
                    <Icon16Like style={{marginRight: 5}} />С любовью
                </Footer>
            </Group>

        </Panel>
    )
}