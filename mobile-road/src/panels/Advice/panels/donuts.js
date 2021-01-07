import React from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Placeholder,


 } from '@vkontakte/vkui';
import {
     Icon56LockOutline,
} from '@vkontakte/icons';

export default class Donuts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render(){
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                    Ошибка
                </PanelHeader>
                <Placeholder 
                icon={<Icon56LockOutline />}
                stretched
                header="Вам не хватает прав доступа">
                    Для доступа к этому разделу нужно иметь платную подписку VK Donut
                </Placeholder>
            </Panel>
        )
    }
}