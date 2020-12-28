import React from 'react';

import { 
    Panel,
    PanelHeader,
    ScreenSpinner,
    PanelHeaderBack,
    FormLayout,
    Radio,
    Textarea,
    Button,
    FormItem,
    Group,
    Alert,

    } from '@vkontakte/vkui';


export default class Reports extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                comment: "",
                typerep: "1",
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.onChange = (event) => {
                var name = event.currentTarget.name;
                var value = event.currentTarget.value;
                this.setState({ [name]: value });
            }
        }
        sendReport(){
            this.setPopout(<ScreenSpinner />)
            fetch(this.state.api_url + "method=reports.send&" + window.location.search.replace('?', ''),
                {method: 'post',
                    headers: {"Content-type": "application/json; charset=UTF-8"},
                        // signal: controllertime.signal,
                    body: JSON.stringify({
                        'type': this.props.typeres, // Место нахождение материала
                        'name': Number(this.state.typerep), // Причина
                        'id_rep': this.props.id_rep, 
                        'comment': this.state.comment,
                    })
                    })
                    .then(res => res.json())
                    .then(data => {
                    if(data.result) {
                        this.setPopout(<Alert 
                            actionsLayout="horizontal"
                            actions={[{
                                title: 'Закрыть',
                                autoclose: true,
                                mode: 'cancel'
                            }]}
                            onClose={() => window.history.back()}
                            header="Принято!"
                            text="Ваша жалоба будет рассмотрена модераторами в ближайшее время."
                        />)
                    }else{
                        this.showErrorAlert(data.error.message)
                    }
                    })
                    .catch(err => {
                        this.props.this.changeData('activeStory', 'disconnect')
                    })
        }
        validateComment(title){
            if(title.length > 0){
              let valid = ['error', 'Текст должен быть не больше 200 и не меньше 6 символов' ];
              if(title.length <= 2000 && title.length > 5){
                if(/^[a-zA-ZА-Яа-я0-9_ё .,"':!?*+=-]*$/ui.test(title)){
                  valid = ['valid', '']
                }else{
                  valid = ['error', 'Текст не должен содержать спец. символы'];
                }
              }
        
              return valid
            }else{
                if(this.state.typerep === "8") return ['error', 'При указании причины "Другое", обязательно укажите комментарий']
            }
            return ['default', '']
            
          }
        componentDidMount(){
        }

        render() {
            return (
                <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderBack onClick={() => window.history.back()}></PanelHeaderBack>
                    }>
                        Жалоба
                </PanelHeader>
                <Group>
                    <FormLayout>
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        defaultChecked
                        value="1">Оскорбление</Radio>
                        
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        value="2">Порнография</Radio>
                        
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        value="3">Введение в заблуждение</Radio>
                        
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        value="4">Реклама</Radio>
                        
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        value="5">Вредоносные ссылки</Radio>
                        
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        value="6">Сообщение не по теме</Radio>
                        
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        value="7">Издевательство</Radio>
                        
                        <Radio name="typerep" 
                        onChange={this.onChange}
                        value="8">Другое</Radio>
                        
                        <FormItem 
                        top='Комментарий модератору'
                        bottom={this.validateComment(this.state.comment)[1]}
                        status={this.validateComment(this.state.comment)[0]}>
                            <Textarea  
                            name='comment' 
                            placeholder='Комментарий...'
                            maxLength="200"
                            onChange={this.onChange} 
                            value={this.state.comment} />
                        </FormItem>
                        <FormItem>
                            <Button 
                            disabled={(this.validateComment(this.state.comment)[0] === 'error') || (this.state.comment === "" && this.state.typerep === "8") || (this.state.typerep !== "8" ? false : this.validateComment(this.state.comment)[0] !== 'valid')}
                            size='l'
                            stretched
                            type='submit'
                            onClick={() => {
                                this.sendReport()
                            }}>
                                Отправить жалобу
                            </Button>
                        </FormItem>
                        {/* <FormItem>
                        <Button
                            size='l'
                            stretched
                            type='submit'
                            onClick={() => {
                                console.log(this.props.typeres,
                                    this.state.typerep,
                                    this.props.id_rep, 
                                    this.state.comment,
                                    )
                            }}>
                                Debug
                            </Button>
                        </FormItem> */}
                    </FormLayout>
                </Group>  
            </Panel>
            )
            }
        }
