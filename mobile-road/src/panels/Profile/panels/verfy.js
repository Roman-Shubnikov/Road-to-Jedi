import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
    Panel,
    PanelHeader,
    SimpleCell,
    PanelHeaderBack,
    Div,
    FormLayout,
    FormLayoutGroup,
    Input,
    Textarea,
    Checkbox,
    Button,
    FormStatus,
    Link,
    Placeholder,
    FixedLayout,
    ScreenSpinner,

    } from '@vkontakte/vkui';

import Icon28SmartphoneOutline from '@vkontakte/icons/dist/28/smartphone_outline';
import VerfIcon from '../../../images/verfload.png';

// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


export default class Verfy extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            check1: false,
            check2: false,
            title: '',
            description: '',
            // number: '',
            // numberstatus: true,
            // sign_number: '',
            verfstatus: -1,

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
    }
    handleForm(){
      this.setPopout(<ScreenSpinner />);
      fetch(this.state.api_url + 
      "method=account.sendRequestVerf&title=" + this.state.title + 
      "&description=" + this.state.description + 
      // "&phone_number=" + this.state.number + 
      // "&phone_sign=" + this.state.sign_number + 
      "&cond1=1&cond2=1&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
      if(data.result) {
        this.checkVerfStatus()
      }else{
          this.showErrorAlert(data.error.message)
      }
      })
      .catch(err => {
          this.showErrorAlert(err)

      })

    }
    checkVerfStatus(){
      fetch(this.state.api_url + 
        "method=account.getVerfStatus&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
        if(data.result) {
          this.setState({verfstatus: data.response})
          this.setPopout(null);
        }else{
            this.showErrorAlert(data.error.message)
        }
        })
        .catch(err => {
            this.showErrorAlert(err)

        })
    }
    validateTitle(title){
      let valid = 'error';
      if(title.length <= 2000 && title.length > 5){
        valid = 'valid'
      }

      return valid
    }
    validateDesc(title){
      let valid = 'error';
      if(title.length <= 2000 && title.length > 10){
        valid = 'valid'
      }

      return valid
    }
    componentDidMount(){
      this.setPopout(<ScreenSpinner />);
      this.checkVerfStatus();
    }

    render() {
        // var props = this.props.this;
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={<>
                    <PanelHeaderBack onClick={() => window.history.back()}></PanelHeaderBack>
                    </>}>
                    Верификация
                </PanelHeader>
                {(this.state.verfstatus !== -1) ? (this.state.verfstatus === 2) ? <><Placeholder 
                icon={<img src={VerfIcon} alt='Ожидайте рассмотрения' />}
                // action={<Div>
                //   <Button size="xl" onClick={() => {window.history.back()}}>Вернуться к настройкам</Button>
                // </Div>}
                header='Вы отправили заявку на верификацию'>Вы отправили заявку на верификацию, по
                                                            окончанию проверки — мы сообщим Вам
                                                            о результатах официального статуса.
                                                            <br /><br />Администрация проекта не сообщает о
                                                            процессе рассмотрения
                                                            верификации.</Placeholder>
                                                              </> : <>
                <FormLayout>
                  {/* {this.state.numberstatus ? null : <FormStatus header='Некорректное заполнение формы' mode='error'>
                    Вы должны указать номер телефона. Если этого не сделать, то пройти процедуру верефикации не получится
                  </FormStatus>} */}
                  <FormLayoutGroup top="Общая информация" bottom={this.validateTitle(this.state.title) === 'valid' ? '' : 'Текст должен быть не больше 2000 и не меньше 6 символов'}>
                    <Input 
                    maxLength="2000" 
                    onChange={this.onChange}
                    name='title'
                    status={this.validateTitle(this.state.title)}
                    placeholder='Введите свой текст...' />
                  </FormLayoutGroup>
                  <FormLayoutGroup top="Почему вы решили верифицировать профиль" bottom={this.validateDesc(this.state.description) === 'valid' ? '' : 'Текст должен быть не больше 2000 и не меньше 11 символов'}>
                    <Textarea 
                    maxLength="2000" 
                    status={this.validateDesc(this.state.description)}
                    name='description'
                    onChange={this.onChange}
                    placeholder='Введите свой текст...' />
                  </FormLayoutGroup>
                  {/* <SimpleCell
                  description="Нажмите чтобы указать номер телефона"
                  onClick={() => bridge.send("VKWebAppGetPhoneNumber", {})
                  .then(data => {
                    this.setState({number: data.phone_number, sign_number: data.sign, numberstatus: true})
                  })
                  .catch(error => {
                    this.setState({numberstatus: false})
                  })}
                  before={<Icon28SmartphoneOutline/>}>Ваш номер телефона</SimpleCell> */}
                  {/* {this.state.number ? <Input
                  top='Ваш номер'
                  disabled
                  value={this.state.number} /> : null} */}
                  <Checkbox checked={this.state.check1} onChange={() => this.state.check1 ? this.setState({check1: false}) : this.setState({check1: true})}>
                    Согласен с <Link 
                    href='https://vk.com/@jedi_road-chto-takoe-verifikaciya-i-kak-ee-poluchit-galochku'
                    target="_blank" rel="noopener noreferrer">
                    правилами
                      </Link> верификации
                  </Checkbox>
                  <Checkbox checked={this.state.check2} onChange={() => this.state.check2 ? this.setState({check2: false}) : this.setState({check2: true})}>
                    Готов к телефонному разговору с модератором отдела верификации
                  </Checkbox>
                </FormLayout>
                <Div>
                  <Button 
                  size='xl' 
                  stretched
                  disabled={
                    !this.state.check1 || 
                    !this.state.check2 || 
                    !this.state.title ||
                    !this.state.description
                    // !this.state.number
                  }
                  onClick={() => this.handleForm()}
                  >Отправить на рассмотрение</Button>
                </Div></>: null}
                {this.props.this.state.snackbar}
            </Panel>
        )
    }
}