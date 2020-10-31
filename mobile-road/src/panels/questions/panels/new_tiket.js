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
            this.onChange = (event) => {
                var name = event.currentTarget.name;
                var value = event.currentTarget.value;
                this.setState({ [name]: value });
            }
        }
        sendNewTiket() {
        this.setState({popout: <ScreenSpinner/>})
        var global = this;
        if(this.state.text_new_tiket.length > 5 || this.state.title_new_tiket.length > 5) {
            var url = this.state.api_url + 'method=ticket.add&' + window.location.search.replace('?', '');
            var method = 'POST';
            var async = true;
        
            var xhr = new XMLHttpRequest();
            xhr.open( method, url, async );
            //.then(response => response.json())
            
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        
            xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
            if(xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
                if(xhr.responseText) {
                let text = (JSON.parse(xhr.responseText));
                global.props.this.goTiket(text.response.ticket_id)
                fetch(global.state.api_url + "method=tickets.get&unanswered=1&" + window.location.search.replace('?', ''))
                .then(res => res.json())
                .then(data => {
                    if(data.result) {
                        global.setState({tiket_all: data.response, popout: null, title_new_tiket: "", text_new_tiket: ""})
                    }else{
                        this.showErrorAlert(data.error.message)
                    }
                })
                .catch(err => {
                    this.showErrorAlert()

                })
                }
            }
        }
            
            xhr.send( 'title=' + this.state.title_new_tiket + '&text=' + this.state.text_new_tiket );
            xhr.onerror = ( error ) => {
            this.showErrorAlert()

            console.error( error );
            }
        } else {
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
                    <PanelHeaderButton onClick={() => this.props.this.goBack()}> 
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
                    value={this.state.title_new_tiket} 
                    onChange={(e) => this.onChange(e)}/>

                    <Textarea maxLength="2020" 
                    name="text_new_tiket" 
                    top={this.state.text_new_tiket === null ? "Подробнее о проблеме (0/2020). Не менее 5 символов" : "Подробнее о проблеме (" + this.state.text_new_tiket.length + "/2020). Не менее 5 символов"} 
                    onChange={(e) => this.onChange(e)}
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
  