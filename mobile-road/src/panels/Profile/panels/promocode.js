import React from 'react';
import { 
    Panel,
    PanelHeader,
    ScreenSpinner,
    Separator,
    Header,
    PanelHeaderBack,
    Radio,
    FormLayout,
    Div,
    } from '@vkontakte/vkui';

import Message from '../../../components/message'
import avaUser from '../../../images/user.jpg'
import avaAgent from '../../../images/schemeagent.jpg'

export default class SchemeChange extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",

        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.showAlert = propsbi.showAlert;
        this.setActiveModal = propsbi.setActiveModal;
        this.onChange = (event) => {
            var name = event.currentTarget.name;
            var value = event.currentTarget.value;
            this.setState({ [name]: value });
        }
        this.ChangeScheme = (e) => {
            this.setPopout(<ScreenSpinner />)
            let value = e.currentTarget.value;
            if(value === 0){
                this.props.this.changeData('scheme', this.props.default_scheme)
            }
            fetch(this.state.api_url + "method=account.changeScheme&" + window.location.search.replace('?', ''),
            {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'scheme': value,
                })
                })
                .then(res => res.json())
                .then(data => {
                if(data.result) {
                    setTimeout(() => {
                        this.props.this.ReloadProfile();
                        this.setPopout(null)
                      }, 3000)
                }else{
                    this.showErrorAlert(data.error.message)
                }
                })
                .catch(err => {
                    this.props.this.changeData('activeStory', 'disconnect')
    
                })
    
        }
    }
    

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderBack onClick={() => window.history.back()} /> 
                }>
                    Активация
                </PanelHeader>
                <Header mode='secondary'>Предпросмотр</Header>
                <Separator /> 
                <Div>
                    <Message
                    title='Пользователь'
                    is_mine={false}
                    avatar={avaUser}
                    onClick={() => {}}
                    clickable={false}
                    >О, тут можно менять тему</Message>
                    <Message
                    title='Агент Поддержки'
                    is_mine={true}
                    avatar={avaAgent}
                    onClick={() => {}}
                    clickable={false}
                    >Действительно</Message>
                </Div>
                <Separator style={{marginTop: 10}} />
                <FormLayout>
                    <div>
                    <Radio name="radio" className="pointer" onChange={this.ChangeScheme} value="1" defaultChecked={(this.props.account.scheme === 1) ? true : false}>Светлая тема</Radio>
                    <Radio name="radio" className="pointer" onChange={this.ChangeScheme} value="2" defaultChecked={(this.props.account.scheme === 2) ? true : false}>Тёмная тема</Radio>
                    <Radio name="radio" className="pointer" onChange={this.ChangeScheme} value="0" description='Сервис будет использовать тему, установленную в настройках ВКонтакте' defaultChecked={(this.props.account.scheme === 0) ? true : false}>Автоматически</Radio>
                    </div>
                </FormLayout>
            </Panel>
        )
    }
}
