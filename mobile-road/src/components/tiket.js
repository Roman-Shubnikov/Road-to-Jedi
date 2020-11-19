import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    Button,
    FixedLayout,
    Div,
    ScreenSpinner,
    ActionSheet,
    ActionSheetItem,
    PanelHeaderBack,
    Separator,
    WriteBarIcon,
    WriteBar,
    FormStatus,
    } from '@vkontakte/vkui';

import Icon16ReplyOutline from '@vkontakte/icons/dist/16/reply_outline';

// import Ninja from '../images/Ninja.webp'

import Message from './message'
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const queryString = require('query-string');
const parsedHash = queryString.parse(window.location.search.replace('?', ''));

var months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'ноября',
    'декабря',
];

function fix_time(time) {
    if(time < 10) {
        return "0" + time
    } else {
        return time
    }
}

function add_month(month) {
    let number_month = new Date(month * 1e3).getMonth()
    return months[number_month - 1]
}
export default class Ticket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            tiket_info: null,
            tiket_message: [],
            tiket_send_message: '',
            add_comment: false,
            redaction: false,
            limitreach: false,
        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.setActiveModal = propsbi.setActiveModal;
        this.goOtherProfile = propsbi.goOtherProfile;
        this.sendRayt = this.sendRayt.bind(this);
        this.onChange = (event) => {
          var name = event.currentTarget.name;
          var value = event.currentTarget.value;
          this.setState({ [name]: value });
        }
        this.setSnack = (value) => {
          this.setState({snackbar: value})
        }

    }
    Prepare_ticket(){
        fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + this.props.ticket_id + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            this.setState({tiket_info: data.response.info,
              tiket_message: data.response.messages,limitreach: data.response.limitReach });
              this.setPopout(null);
          } else {
            this.showErrorAlert(data.error.message,() => window.history.back())
          }
        })
        .catch(err => {
          this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})
        })
    }
    sendRayt(mark, message_id) {
        let reyt = 1;
        if(mark === true) {
          reyt = 1;
        } else {
          reyt = 0;
        }
        if(reyt < 2) {
          fetch(this.state.api_url + "method=ticket.markMessage&message_id=" + message_id + "&mark=" + reyt + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.getMessages()
              }else {
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
              this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})
            
            })
        }
      }
      sendClear(id) {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.approveReply&message_id=" + id + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            } else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})
    
          })
      }
      Admin(approved, id, author_id, text, comment,avatar=null, mark = -1){
        if(author_id > 0){
          this.props.this.setPopout(
            <ActionSheet onClose={() => this.setPopout(null)}>
               {author_id > 0 ?
              <ActionSheetItem autoclose onClick={() => {this.setState({tiket_message: []});this.goOtherProfile(author_id);}}>
                Профиль
              </ActionSheetItem>
              : null}
             { this.props.account.special && mark !== 0 && mark !== 1 && author_id > 0 ? 
              <ActionSheetItem autoclose onClick={() => this.sendRayt(true, id)}>
                Оценить положительно
              </ActionSheetItem> 
              : null}
              { this.props.account.special && mark !== 0 && mark !== 1 && author_id > 0 ? 
              <ActionSheetItem autoclose onClick={() => this.sendRayt(false, id)}>
                Оценить отрицательно
              </ActionSheetItem> 
              : null }
              { (this.props.account.special === true && author_id > 0 && !approved) ? 
              <ActionSheetItem autoclose onClick={() => this.sendClear(id)}>
                Одобрить
              </ActionSheetItem> 
              : null }
              {(this.props.account.special === true && (comment === null || comment === undefined)) ? 
              <ActionSheetItem autoclose onClick={() => this.setState({add_comment: true, message_id_add: id})}>
              Добавить комментарий
              </ActionSheetItem> 
              : null }
              {(Number(author_id === this.props.account.id) && this.state.tiket_info['status'] === 0 && mark === -1 && !approved) ? 
             <ActionSheetItem autoclose onClick={() => this.setState({redaction: true, message_id_redac: id, tiket_send_message: text})}>
             Редактировать
             </ActionSheetItem>
             : null}
          {(comment === null || comment === undefined) ? null : 
              <ActionSheetItem autoclose onClick={() => {this.props.this.setState({comment: comment}); this.setActiveModal("comment")}}>
              Просмотреть комментарий
            </ActionSheetItem>}
              {Number(author_id) === Number(this.props.account.id) || this.props.account.special === true ? 
              <ActionSheetItem autoclose onClick={() => this.deleteMessage(id)}>
                Удалить сообщение
              </ActionSheetItem>
              : null}
              {<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
            </ActionSheet>
          )
        }else{
          if(this.props.account.special){
            
            this.props.this.setPopout(
              <ActionSheet onClose={() => this.setPopout(null)}>
                <ActionSheetItem autoclose onClick={() => this.deleteMessage(id)}>
                  Удалить сообщение
                </ActionSheetItem>
                <ActionSheetItem autoclose onClick={() => {this.props.this.setState({other_profile:{'id':author_id,'avatar': {'url': avatar}}});this.setActiveModal('ban_user');}}>
                  Забанить пользователя
                </ActionSheetItem> 
                {(Number(author_id === this.props.account.id) && this.state.tiket_info['status'] === 0) ? 
               <ActionSheetItem autoclose onClick={() => this.setState({redaction: true, message_id_redac: id, tiket_send_message: text})}>
               Редактировать
               </ActionSheetItem>
               : null}
              {<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
              </ActionSheet>
            )
          }else{
            if(Number(author_id === this.props.account.id)){
              this.props.this.setPopout(
                <ActionSheet onClose={() => this.setPopout(null)}>
                  {(Number(author_id === this.props.account.id) && this.state.tiket_info['status'] === 0) ? 
                 <ActionSheetItem autoclose onClick={() => this.setState({redaction: true, message_id_redac: id, tiket_send_message: text})}>
                 Редактировать
                 </ActionSheetItem>
                 : null}
                {<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
                </ActionSheet>
              )
            }
            
          }
          
        }
        
      }
      copy(id) {
        this.props.this.setPopout(
          <ActionSheet onClose={() => this.setPopout(null)}>
            {Number(this.state.tiket_info['author']['id']) === Number(parsedHash.vk_user_id) ? 
            this.state.tiket_info['status'] === 0 ||  this.state.tiket_info['status'] === 1 ?
            <ActionSheetItem autoclose onClick={() => this.deleteTicket()}>
            Закрыть тикет
            </ActionSheetItem>
            : 
            <ActionSheetItem autoclose onClick={() => this.openTicket()}>
            Открыть тикет
            </ActionSheetItem>
            : 
            this.props.account.special === true ?
            this.state.tiket_info['status'] === 0 ||  this.state.tiket_info['status'] === 1 ?
            <ActionSheetItem autoclose onClick={() => this.deleteTicket()}>
            Закрыть тикет
            </ActionSheetItem>
            : 
            <ActionSheetItem autoclose onClick={() => this.openTicket()}>
            Открыть тикет
            </ActionSheetItem>
            : null
          }
            <ActionSheetItem autoclose onClick={() => bridge.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#ticket_id=" + id})}>
              Скопировать ссылку
            </ActionSheetItem>
            {<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
          </ActionSheet>)
      }
      clickable_user_message(author_id){
        console.log(author_id)
        let clickable = true;
        if(author_id < 0){
          if(!this.props.account.special){
            if(!Boolean(Number(author_id === this.props.account.id))){
              clickable = false;
            }
          }
        }
        return clickable;
      }
      sendNewMessage() {
        this.setPopout(<ScreenSpinner/>)
          fetch(this.state.api_url + 'method=ticket.sendMessage&ticket_id=' + this.state.tiket_info['id'] + '&text=' + encodeURIComponent(this.state.tiket_send_message.trim()) + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})

          })
      }
      deleteMessage(message_id) {
        this.setPopout(<ScreenSpinner/>)
          fetch(this.state.api_url + "method=ticket.deleteMessage&message_id=" + message_id + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.getMessages()
              }else {
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
              this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})
  
            })
      }
      deleteTicket() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.close&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})
  
          })
      }
      openTicket() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.open&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})
  
          })
      }
      sendNewMessageRedact() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + 'method=ticket.editMessage&message_id=' + this.state.message_id_redac + '&text=' + encodeURIComponent(this.state.tiket_send_message.trim()) + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})

          })
        
      }
      sendNewMessageComment() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + 'method=ticket.commentMessage&message_id=' + this.state.message_id_add + '&text=' + encodeURIComponent(this.state.tiket_send_message.trim()) + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})

          })
      }
    getMessages(){
      fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if(data.result) {
          this.setState({tiket_message: data.response.messages, tiket_send_message: "",add_comment: false, redaction: false,limitreach: data.response.limitReach})
          this.setPopout(null)
        }else {
          this.showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})

      })
    }
    componentDidMount(){
      this.setPopout(<ScreenSpinner/>)
      this.Prepare_ticket()
    }
    nofinc(){
      return 1
    }
    render(){
        var props = this.props;
        var thisOb = this;
        return(
        <Panel id={this.props.id}>
            <PanelHeader 
                left={<PanelHeaderBack onClick={() => window.history.back()} />}
            >
                {this.state.tiket_info ? <span id="animation" className='pointer' onClick={() => this.copy(this.state.tiket_info['id'])}>Вопрос #{this.state.tiket_info['id']}</span> : null}
            </PanelHeader>
            {/* MESSAGES */}
            {this.state.tiket_info ? <>
            <div className="title_tiket">{new Date(this.state.tiket_info['time'] * 1e3).getDate()} {add_month(this.state.tiket_info['time'])}</div>
            <div className="title_tiket" style={{marginTop: "10px", width: "95%", marginLeft: "10px"}}>Пользователь обратился с вопросом  «{this.state.tiket_info['title']}»</div>
                    <>{this.state.tiket_message ? this.state.tiket_message.map(function(result, i) {
                        var is_mine_ticket = Number(thisOb.state.tiket_info.author['id']) === Number(parsedHash.vk_user_id) ? true : false
                        var is_mine_message = Number(result['author']['id']) === Number(parsedHash.vk_user_id) ? true : false
                        var avatar = result.author.is_moderator ? result['author']['avatar']['url'] : result.author.photo_200
                        var time = fix_time(new Date(result.time * 1e3).getHours()) + ":" + fix_time(new Date(result.time * 1e3).getMinutes())
                        var title_moder = isFinite(result['nickname']) ? `Агент Поддержки #${result['nickname']}` : result['nickname'] ? result['nickname'] : `Агент Поддержки #${result['author']['id']}`;
                        return (
                            Number(thisOb.state.tiket_info.author['id']) === Number(parsedHash.vk_user_id) ?
                            <Message 
                                clickable={true}
                                title={result.author.is_moderator ? title_moder : result.author.first_name + " " + result.author.last_name} 
                                title_icon={result.moderator_comment !== undefined ? <Icon16ReplyOutline width={10} height={10} style={{display: "inline-block"}}/> : false}
                                is_mine={is_mine_message === is_mine_ticket}
                                avatar={avatar}
                                onClick={() => thisOb.Admin(result['approved'],result['id'], result['author'].first_name ? -result['author']['id'] : result['author']['id'] , result['text'], result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null,avatar, result['mark'])}
                                key={i}
                                is_special={thisOb.props.account.special}
                                is_mark={result.mark}
                                time={time}
                                sendRayt_false={() => thisOb.sendRayt(false, result.id)}
                                sendRayt_true={() => thisOb.sendRayt(true, result.id)}
                                approved={result.approved ? true : false}
                                CanselApp={() => props.this.showAlert('Информация', 'Этот ответ оценен отрицательно')}
                                DoneApp={() => props.this.showAlert('Информация', 'Этот ответ оценен положительно')}
                            >
                                {result.text}
                            </Message>
                            
                            :
                            <Message 
                                clickable={!thisOb.props.account.special ? false : true}
                                title={result.author.is_moderator ? title_moder : result.author.first_name + " " + result.author.last_name} 
                                title_icon={result.moderator_comment !== undefined ? <Icon16ReplyOutline width={10} height={10} style={{display: "inline-block"}}/> : false}
                                is_mine={result.author.is_moderator}
                                avatar={avatar}
                                key={i}
                                time={time}
                                onClick={() => thisOb.Admin(result['approved'], result['id'], result['author'].first_name ? -result['author']['id'] : result['author']['id'], result['text'], result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null,avatar, result['mark'])}
                                is_special={thisOb.props.account.special}
                                is_mark={result.mark}
                                sendRayt_false={() => thisOb.sendRayt(false, result.id)}
                                sendRayt_true={() => thisOb.sendRayt(true, result.id)}
                                approved={result.approved ? true : false}
                                CanselApp={() => props.this.showAlert('Информация', 'Этот ответ оценен отрицательно')}
                                DoneApp={() => props.this.showAlert('Информация', 'Этот ответ оценен положительно')}
                            >
                                {result.text}
                            </Message>
                        )}) : null}
                        {!((this.state.tiket_info['status'] === 1) || (this.state.tiket_info['status'] === 2)) ? <div style={{marginBottom: '20vh'}}></div> : <div style={{marginBottom: '5vh'}}></div>}
                      </>
            {/* INPUT */}
            {this.state.tiket_info['status'] === 0 || (this.state.redaction === true || this.state.add_comment === true) ? 
                (this.state.limitreach && !(this.state.redaction || this.state.add_comment)) ? 
                <FixedLayout filled vertical='bottom'>
                  <Div>
                    <FormStatus header='Внимание!' mode='default'>
                      Вы исчерпали лимит сообщений в этот тикет.
                    </FormStatus>
                  </Div>
                </FixedLayout> :
                <FixedLayout vertical='bottom'>
                  <Separator wide />
                    <WriteBar
                      after={
                        <>
                          <WriteBarIcon mode={this.state.redaction ? 'done' : "send"}
                          disabled={!(this.state.tiket_send_message.trim().length >= 5)}
                          onClick={() => {(this.state.tiket_send_message.trim().length >= 5) ? this.state.redaction !== true && this.state.add_comment !== true ? this.sendNewMessage() : this.state.redaction ? this.sendNewMessageRedact() : this.sendNewMessageComment() : this.nofinc()}}
                          />
                          {/* {<WriteBarIcon><Icon20Clear width={34} height={34} /></WriteBarIcon>} */}
                        </>
                      }
                      value={this.state.tiket_send_message}
                      maxLength="2020"
                      name="tiket_send_message"
                      onChange={(e) => this.onChange(e)}
                      placeholder="Сообщение"
                    />
                </FixedLayout>
                
                 : null}
            {this.state.tiket_info['status'] === 1 ? 
                Number(this.state.tiket_info['author']['id']) === Number(parsedHash.vk_user_id) ?
                    <div>
                      <FixedLayout vertical="bottom">
                        <Div style={{display: "flex"}}>
                          <Button size="l" style={{marginRight: "5%"}} stretched onClick={() => this.deleteTicket()}>Проблема решена</Button>
                          <Button size="l" stretched mode="secondary" onClick={() => this.openTicket()}>Проблема не решена</Button>
                        </Div>
                      </FixedLayout>
                        
                    </div>
                : null
            : null}</> : null}
            </Panel>
        )
    }
};
