import React from 'react';

import { 
    Link,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Placeholder,


 } from '@vkontakte/vkui';
import {
     Icon56LockOutline,
} from '@vkontakte/icons';

export default props => {
    return (
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Ошибка
                </PanelHeader>
            <Placeholder
                icon={<Icon56LockOutline />}
                stretched
                header="Вам не хватает прав доступа">
                Для доступа к этому разделу, нужно купить его в нашем <Link style={{fontWeight: 600}} onClick={() => props.setActiveStory('profile')}>магазине</Link> в разделе ценности 
                </Placeholder>
        </Panel>
    )
}