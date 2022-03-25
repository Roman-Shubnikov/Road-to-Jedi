import React from 'react';
import { 
    Group,
    Panel,
    PanelHeader,
    Spinner,
    } from '@vkontakte/vkui';
export default props => {
    return(
        <Panel id={props.id}>
            <PanelHeader>
                Загрузка
            </PanelHeader>
            <Group style={{height: 300}}>
            </Group>
            
        </Panel>
        )
}


