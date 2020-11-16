import React from 'react';
import { 
    Panel,
    PanelHeader,
    } from '@vkontakte/vkui';

import Icon24Spinner          from '@vkontakte/icons/dist/24/spinner';

export default class Info extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader>
                    Загрузка
                </PanelHeader>
                <Icon24Spinner style={{margin: 'auto'}} width={56} height={56} className='Spinner__self' />
            </Panel>
        )
    }
}
