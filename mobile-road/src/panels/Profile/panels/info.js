import React from 'react';
import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    ScreenSpinner,

    Group,
    Input,
    Avatar,
    Button,
    Alert,
    Placeholder,
    Separator,
    PullToRefresh,
    PanelSpinner,
    InfoRow,
    Header,
    Counter,
    SimpleCell,
    PromoBanner,
    FixedLayout,
    Cell,
    Div,
    HorizontalScroll,
    View,
    Switch,
    Snackbar,
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
        var props = this.props.this;
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                    <PanelHeaderBack onClick={() => this.props.this.goBack()} /> 
                    }>
                    О сервисе
                </PanelHeader>
                <Placeholder icon={<img src={IconJedi} />} >Версия 2.0</Placeholder>
                <Separator />
                <Group>
                  <SimpleCell
                  before={<Icon28RadiowavesLeftAndRightCircleFillRed />}
                  href='https://vk.com/jedi_road'
                  target="_blank"
                  rel="noopener noreferrer">
                    Официальное сообщество
                  </SimpleCell>
                  <SimpleCell
                  before={<Icon28MessagesCircleFillYellow />}
                  href='https://vk.me/jedi_road'
                  target="_blank"
                  rel="noopener noreferrer">
                    Напишите нам
                  </SimpleCell>
                </Group>
                <Separator />
                <Footer>Всегда ваша<br/>Команда Jedi</Footer>
            </Panel>
        )
    }
}