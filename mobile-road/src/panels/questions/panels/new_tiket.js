import React from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Button,
    Alert,
    ScreenSpinner,
    Input,
    FormLayout,
    Textarea,
    } from '@vkontakte/vkui';


import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

export default class NewTicket extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                title_new_tiket: '',
                text_new_tiket: '',
            }
            this.sendNewTiket = this.sendNewTiket.bind(this);
            this.onChange = (event) => {
                var name = event.currentTarget.name;
                var value = event.currentTarget.value;
                this.setState({ [name]: value });
            }
        }
        getRandomInRange(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
          }
        sendNewTiket() {
            this.setState({popout: <ScreenSpinner/>})
            if(this.state.text_new_tiket.length > 5 || this.state.title_new_tiket.length > 5) {
                fetch(this.state.api_url + "method=ticket.add&" + window.location.search.replace('?', ''), 
                {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'title': this.state.title_new_tiket,
                    'text': this.state.text_new_tiket,
                    'user': this.getRandomInRange(501, 624429367),
                })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.result) {
                        fetch(this.state.api_url + "method=tickets.get&" + window.location.search.replace('?', ''),
                        {method: 'post',
                        headers: {"Content-type": "application/json; charset=UTF-8"},
                            // signal: controllertime.signal,
                        body: JSON.stringify({
                            'unanswered': 1,
                        })
                        })
                        .then(res => res.json())
                        .then(data => {
                            if(data.result) {
                                this.setState({tiket_all: data.response, popout: null, title_new_tiket: "", text_new_tiket: ""})
                            }else{
                                this.showErrorAlert(data.error.message)
                            }
                        })
                        .catch(err => {
                            this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.changeData('activeStory', 'disconnect')})
        
                        })
                    }else{
                    this.showErrorAlert(data.error.message)
                }
                })
                .catch(err => {
                    this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.changeData('activeStory', 'disconnect')})
                })
            }else{
                this.setState({
                    popout: 
                    <Alert
                    actions={[{
                    title: 'Отмена',
                    autoclose: true,
                    style: 'cancel'
                    }]}
                    onClose={this.closePopout}
                >
                    <h2>Ошибка</h2>
                    <p>Заголовок или текст проблемы должен быть больше 5 символов.</p>
                </Alert>
                    })
            }
        }

        render() {
            return (
                <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                    <PanelHeaderButton onClick={() => window.history.back()}> 
                    <Icon24BrowserBack/>
                    </PanelHeaderButton>
                    }>
                Новый вопрос
                </PanelHeader>
                <FormLayout>
                    <Input 
                    top={this.state.title_new_tiket === null ? "Суть проблемы (0/30). Не менее 5 символов" : "Суть проблемы (" + this.state.title_new_tiket.length + "/80). Не менее 5 символов"}
                    maxLength="80" 
                    type="text" 
                    name="title_new_tiket" 
                    placeholder='Введите свой текст...'
                    value={this.state.title_new_tiket} 
                    onChange={(e) => this.onChange(e)}/>

                    <Textarea maxLength="2020" 
                    name="text_new_tiket" 
                    top={this.state.text_new_tiket === null ? "Подробнее о проблеме (0/2020). Не менее 5 символов" : "Подробнее о проблеме (" + this.state.text_new_tiket.length + "/2020). Не менее 5 символов"} 
                    onChange={(e) => this.onChange(e)}
                    placeholder='Введите свой текст...'
                    value={this.state.text_new_tiket}
                    ></Textarea>
                    <Button
                    size="xl" 
                    level="secondary" 
                    stretched 
                    disabled={!Boolean(this.state.text_new_tiket.length > 5) || !Boolean(this.state.title_new_tiket.length > 5)}
                    onClick={
                        () => {
                            this.sendNewTiket();
                        }
                    }>Отправить</Button>
                </FormLayout>
            </Panel>
            )
            }
        }
  