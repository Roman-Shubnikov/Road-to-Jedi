import React from 'react';
import { 
    Panel,
    PanelHeader,
    } from '@vkontakte/vkui';

import { Icon44Spinner } from '@vkontakte/icons';
export default props => {
    return(
        <Panel id={props.id}>
            <PanelHeader>
                Загрузка
            </PanelHeader>
            <Icon44Spinner style={{ margin: 'auto', color: 'var(--icon_outline_secondary)'}} width={56} height={56} className='Spinner__self' />
        </Panel>
        )
}


