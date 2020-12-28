import React from 'react';
import { 
    Panel,
    PanelHeader,
    Button,
    Placeholder,
    Group,
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
                <Group>
                    <Placeholder 
                    icon={<Icon56CheckCircleDeviceOutline style={{color: 'var(--dynamic_orange)'}} />}
                    header='Упс, кажется, при запросе возникла ошибка'
                    action={<>
                    <Button size='m' 
                    style={{marginRight: 8, marginBottom:8}} 
                    href='https://vk.me/jedi_road' 
                    target="_blank"
                    rel="noopener noreferrer">Связаться с нами</Button>
                    <Button 
                    size='m' 
                    onClick={() => this.props.this.compdid()}>Переподключится</Button>
                    </>}>
                    Наш сервис не смог получить ответ от сервера. Возможно, он недоступен. Проверьте интернет-соединение, а затем попробуйте подключится снова
                    </Placeholder>
                </Group>
                
            </Panel>
        )
    }
}
