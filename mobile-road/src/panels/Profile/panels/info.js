import React from 'react';
import { 
    Panel,
    PanelHeader,
    Group,
    Placeholder,
    Separator,
    SimpleCell,
    PanelHeaderBack,
    Footer
    } from '@vkontakte/vkui';

import IconJedi from '../../../images/jedi.svg'
import Icon28MessagesCircleFillYellow from '@vkontakte/icons/dist/28/messages_circle_fill_yellow';
import Icon28RadiowavesLeftAndRightCircleFillRed from '@vkontakte/icons/dist/28/radiowaves_left_and_right_circle_fill_red';

export default class Info extends React.Component{
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                    <PanelHeaderBack onClick={() => window.history.back()} /> 
                    }>
                    О сервисе
                </PanelHeader>
                <Placeholder icon={<img src={IconJedi} alt='jedi' />} >Версия 2.0</Placeholder>
                <Separator />
                <Group>
                  <SimpleCell
                  className="pointer"
                  before={<Icon28RadiowavesLeftAndRightCircleFillRed />}
                  href='https://vk.com/jedi_road'
                  target="_blank"
                  rel="noopener noreferrer">
                    Официальное сообщество
                  </SimpleCell>
                  <SimpleCell
                  className="pointer"
                  before={<Icon28MessagesCircleFillYellow />}
                  href='https://vk.me/jedi_road'
                  target="_blank"
                  rel="noopener noreferrer">
                    Напишите нам
                  </SimpleCell>
                </Group>
                <Separator />
                <Footer>Всегда ваша,<br/>Команда Jedi</Footer>
            </Panel>
        )
    }
}
