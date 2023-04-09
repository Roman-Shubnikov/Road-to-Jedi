import React from 'react';
import { 
    Group,
    Panel,
    PanelHeader,
    } from '@vkontakte/vkui';
export const LoadingPanel = props => {
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


