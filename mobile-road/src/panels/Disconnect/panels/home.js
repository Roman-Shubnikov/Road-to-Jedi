import React from 'react';
import { 
    Panel,
    PanelHeader,
    Button,
    Placeholder,
    } from '@vkontakte/vkui';
import Icon56CheckCircleDeviceOutline from '@vkontakte/icons/dist/56/check_circle_device_outline';


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
                    Ошибка
                </PanelHeader>
                <Placeholder 
                stretched
                icon={<Icon56CheckCircleDeviceOutline style={{color: 'var(--dynamic_orange)'}} />}
                header='Упс, кажется, при запросе возникла ошибка'
                action={<>
                <Button size='l' 
                style={{marginRight: 8}} 
                href='https://vk.me/jedi_road' 
                target="_blank" 
                rel="noopener noreferrer">Связаться с нами</Button>
                <Button 
                size='l' 
                onClick={() => this.props.this.compdid()}>Переподключится</Button>
                </>}>
                  Наш сервис не смог получить ответ от сервера. Возможно, он недоступен. Проверьте интернет-соединение, а затем попробуйте подключится снова
                </Placeholder>
            </Panel>
        )
    }
}
