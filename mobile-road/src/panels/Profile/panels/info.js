import React from 'react';
import { 
    Panel,
    PanelHeader,
    Group,
    Placeholder,
    PanelHeaderBack,
    Footer
    } from '@vkontakte/vkui';

import IconJedi from '../../../images/jedi.svg'

export default props => {
    return (
        <Panel id={props.id}>
            <PanelHeader
                left={
                    <PanelHeaderBack onClick={() => window.history.back()} />
                }>
                О сервисе
                </PanelHeader>
            <Group>
                <Placeholder icon={<img src={IconJedi} alt='jedi' />} >Версия 2.0</Placeholder>
            </Group>

            <Group>
                <Footer>Всегда ваша, Команда Jedi</Footer>
            </Group>

        </Panel>
    )
}