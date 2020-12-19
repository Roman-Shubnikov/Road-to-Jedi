import React from 'react';

import { 
    Panel,
    PanelHeader,
    Button,
    Alert,
    ScreenSpinner,
    Input,
    FormLayout,
    Textarea,
    PanelHeaderBack,
    Checkbox,
    Div,
    InfoRow,
    FormStatus,
    Progress,
    } from '@vkontakte/vkui';
function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
    }
export default class NewTicket extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                title_new_tiket: '',
                text_new_tiket: '',
                check1: false,
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.showAlert = propsbi.showAlert;
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
                fetch(this.state.api_url + "method=special.addNewModerationTicket&" + window.location.search.replace('?', ''), 
                {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'title': this.state.title_new_tiket,
                    'text': this.state.text_new_tiket,
                    'donut_only': this.state.check1
                })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.result) {
                        this.setState({title_new_tiket: "", text_new_tiket: "", check1: false})
                        this.setPopout(null)
                    }else{
                        this.showErrorAlert(data.error.message)
                    }
                })
                .catch(err => {
                    this.props.this.changeData('activeStory', 'disconnect')
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
                    left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Новый вопрос
                </PanelHeader>
                {(this.props.account['bad_answers'] !== null && this.props.account['bad_answers'] !== undefined) ? <Div>
                            <FormStatus onClick={() => this.props.this.setActiveModal('answers')}>
                                <div style={{textAlign: 'center', color: "var(--text_profile)", marginBottom: 15}}>
                                    Вы сгенерировали <span style={{color:'var(--header_text)'}}>{this.props.account['bad_answers']} {enumerate(this.props.account['bad_answers'], ['вопрос', 'вопроса', 'вопросов'])}</span>
                                </div>
                                <InfoRow>
                                    <Progress 
                                    value={this.props.account['bad_answers'] ? Math.floor(this.props.account['bad_answers'] / 200 * 100) : 0} />
                                    <div style={{textAlign: 'right', color: "var(--text_profile)", marginTop: 10, fontSize: 13}}>200</div>
                                </InfoRow>
                                {(this.props.account['marked'] >= 200) ? <div style={{textAlign: 'center', color: "var(--text_profile)", marginBottom: 5}}>
                                    Но это не значит, что нужно расслабляться!
                                </div> : null}
                            </FormStatus>
                        </Div> : null}
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

                    <Checkbox checked={this.state.check1} onChange={() => this.state.check1 ? this.setState({check1: false}) : this.setState({check1: true})}>
                        Только для донов
                    </Checkbox>

                    <Button
                    size="xl" 
                    level="secondary" 
                    stretched 
                    disabled={!Boolean(this.state.text_new_tiket.length > 5) || !Boolean(this.state.title_new_tiket.length > 5)}
                    onClick={
                        () => {
                            this.sendNewTiket();
                        }
                    }>Добавить в очередь</Button>
                </FormLayout>
            </Panel>
            )
            }
        }
  