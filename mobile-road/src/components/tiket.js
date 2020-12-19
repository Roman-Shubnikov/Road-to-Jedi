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
    Snackbar,
    Avatar,
    } from '@vkontakte/vkui';

import Icon16ReplyOutline           from '@vkontakte/icons/dist/16/reply_outline';
import Icon16CheckCircle            from '@vkontakte/icons/dist/16/check_circle';
import Icon16StarCircleFillYellow   from '@vkontakte/icons/dist/16/star_circle_fill_yellow';

// import Moderator_img from '../images/10007.png'

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
const blueBackground = {
  backgroundColor: 'var(--accent)'
};
export default class Ticket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            tiket_info: null,
            tiket_message: [],
            tiket_send_message: '',
            add_comment: false,
            edit_comment: false,
            redaction: false,
            limitreach: false,
            snackbar: null,
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
        fetch(this.state.api_url + "method=ticket.getById&" + window.location.search.replace('?', ''),
        {method: 'post',
      headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
      body: JSON.stringify({
        'ticket_id': this.props.ticket_id,

    })
      })
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
          this.props.this.changeData('activeStory', 'disconnect')
        })
    }
    sendRayt(mark, message_id) {
      fetch(this.state.api_url + "method=ticket.markMessage&" + window.location.search.replace('?', ''),
      {method: 'post',
      headers: {"Content-type": "application/json; charset=UTF-8"},
      // signal: controllertime.signal,
      body: JSON.stringify({
        'message_id': message_id,
        'mark': mark,
      })
        })
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            this.getMessages()
          }else {
            this.showErrorAlert(data.error.message)
          }
        })
        .catch(err => {
          this.props.this.changeData('activeStory', 'disconnect')
        
        })
      }
      unsendRayt(message_id) {
        fetch(this.state.api_url + "method=ticket.unmarkMessage&" + window.location.search.replace('?', ''),
        {method: 'post',
        headers: {"Content-type": "application/json; charset=UTF-8"},
        // signal: controllertime.signal,
        body: JSON.stringify({
          'message_id': message_id,
        })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')
          
          })
        }
      sendClear(id) {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.approveReply&" + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'message_id': id,
          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            } else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')
    
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
             { this.props.account.special && mark === -1 && author_id > 0 ? 
              <ActionSheetItem autoclose onClick={() => this.sendRayt(1, id)}>
                Оценить положительно
              </ActionSheetItem> 
              : null}
              { this.props.account.special && mark === -1 && author_id > 0 && !(comment === null || comment === undefined) ? 
              <ActionSheetItem autoclose onClick={() => this.sendRayt(0, id)}>
                Оценить отрицательно
              </ActionSheetItem> 
              : null }
              { this.props.account.special && mark !== -1 && author_id > 0 ? 
              <ActionSheetItem autoclose onClick={() => this.unsendRayt(id)}>
                Удалить оценку
              </ActionSheetItem> 
              : null }
              { (this.props.account.special && author_id > 0 && !approved) ? 
              <ActionSheetItem autoclose onClick={() => this.sendClear(id)}>
                Одобрить
              </ActionSheetItem> 
              : null }
              {(this.props.account.special && (comment === null || comment === undefined)) ? 
              <ActionSheetItem autoclose onClick={() => this.setState({add_comment: true, message_id_add: id})}>
              Добавить комментарий
              </ActionSheetItem> 
              : null }
              {(this.props.account.special && !(comment === null || comment === undefined)) ? 
              <ActionSheetItem autoclose onClick={() => this.setState({edit_comment: true, message_id_redac: id,tiket_send_message: comment})}>
              Редактировать комментарий
              </ActionSheetItem> 
              : null }
              {(this.props.account.special && !(comment === null || comment === undefined)) ? 
              <ActionSheetItem autoclose onClick={() => this.deleteComment(id)}>
                Удалить комментарий
              </ActionSheetItem>
              : null}
              {(Number(author_id === this.props.account.id) && this.state.tiket_info['status'] === 0 && mark === -1 && !approved) ? 
             <ActionSheetItem autoclose onClick={() => this.setState({redaction: true, message_id_redac: id, tiket_send_message: text})}>
             Редактировать
             </ActionSheetItem>
             : null}
              <ActionSheetItem autoclose onClick={() => {
                  bridge.send("VKWebAppCopyText", {text: text});
                  this.setSnack(<Snackbar
                    layout="vertical"
                    before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                    onClose={() => this.setSnack(null)}>
                      Текст скопирован
                    </Snackbar>)
              }}>
                  Скопировать текст
                </ActionSheetItem>
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
              <ActionSheetItem autoclose onClick={() => {
              bridge.send("VKWebAppCopyText", {text: text});
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Текст скопирован
                </Snackbar>)
              }}>
              Скопировать текст
            </ActionSheetItem>
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
                <ActionSheetItem autoclose onClick={() => {
                  bridge.send("VKWebAppCopyText", {text: text});
                  this.setSnack(<Snackbar
                    layout="vertical"
                    before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                    onClose={() => this.setSnack(null)}>
                      Текст скопирован
                    </Snackbar>)
              }}>
                  Скопировать текст
                </ActionSheetItem>
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
            <ActionSheetItem autoclose onClick={() => {
              bridge.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#ticket_id=" + id});
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Ссылка скопирована
                </Snackbar>)
          }}>
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
          fetch(this.state.api_url + 'method=ticket.sendMessage&' + window.location.search.replace('?', ''),
          {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'ticket_id': this.state.tiket_info['id'],
            'text': this.state.tiket_send_message.trim(),
          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')

          })
      }
      deleteMessage(message_id) {
        this.setPopout(<ScreenSpinner/>)
          fetch(this.state.api_url + "method=ticket.deleteMessage&" + window.location.search.replace('?', ''),
          {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'message_id': message_id,
          })
            })
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.getMessages()
                this.setSnack(<Snackbar
                  layout="vertical"
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                  onClose={() => this.setSnack(null)}>
                    Сообщение удалено
                  </Snackbar>)
              }else {
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
              this.props.this.changeData('activeStory', 'disconnect')
  
            })
      }
      deleteTicket() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.close&" + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'ticket_id': this.state.tiket_info['id'],

          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Тикет удалён
                </Snackbar>)
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')
  
          })
      }
      openTicket() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.open&" + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'ticket_id': this.state.tiket_info['id'],
          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Тикет открыт
                </Snackbar>)
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')
  
          })
      }
      sendNewMessageRedact() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + 'method=ticket.editMessage&' + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'message_id': this.state.message_id_redac,
            'text': this.state.tiket_send_message.trim(),
          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Сообщение отредактировано
                </Snackbar>)
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')

          })
      }
      editComment(){
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + 'method=ticket.editComment&' + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'message_id': this.state.message_id_redac,
            'text': this.state.tiket_send_message.trim(),
          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Комментарий отредактирован
                </Snackbar>)
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')

          })
      }
      deleteComment(message_id){
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + 'method=ticket.deleteComment&' + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'message_id': message_id
          })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Комментарий удалён
                </Snackbar>)
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')

          })
      }
      sendNewMessageComment() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + 'method=ticket.commentMessage&' + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'message_id': this.state.message_id_add,
            'text': this.state.tiket_send_message.trim(),
          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.getMessages()
              this.setSnack(<Snackbar
                layout="vertical"
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                onClose={() => this.setSnack(null)}>
                  Комментарий отправлен
                </Snackbar>)
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')

          })
      }
    getMessages(){
      fetch(this.state.api_url + "method=ticket.getMessages&" + window.location.search.replace('?', ''),
      {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
          body: JSON.stringify({
            'ticket_id': this.state.tiket_info['id'],
          })
            })
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
        this.props.this.changeData('activeStory', 'disconnect')

      })
    }
    componentDidMount(){
      this.setPopout(<ScreenSpinner/>)
      this.Prepare_ticket()
    }
    detectFunction(){
      this.setState({tiket_send_message: "",add_comment: false, redaction: false,edit_comment: false})
      if(this.state.redaction){
        this.sendNewMessageRedact();
      }else if(this.state.add_comment){
        this.sendNewMessageComment();
      }else if(this.state.edit_comment){
        this.editComment();
      }else{
        this.sendNewMessage();
      }
    }
    detectPlaceholder(){
      let placeholder = 'Сообщение';
      if(this.state.add_comment){
        placeholder = 'Комментарий'
      }
      return placeholder;
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
                {this.state.tiket_info ? <span id="animation" className='pointer' 
                onClick={() => this.copy(this.state.tiket_info['id'])}>Вопрос #{this.state.tiket_info['id']} {this.state.tiket_info['donut'] ? <Icon16StarCircleFillYellow width={16} height={16} style={{marginTop: '13%', display: 'inline-block'}} /> : null}</span> : null}
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
                                commentclick={() => {thisOb.props.this.setState({comment: result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null}); thisOb.setActiveModal("comment")}}
                                comment={result.moderator_comment !== undefined}
                                sendRayt_false={() => thisOb.sendRayt(0, result.id)}
                                sendRayt_true={() => thisOb.sendRayt(1, result.id)}
                                approved={result.approved ? true : false}
                                CanselApp={() => props.this.showAlert('Информация', 'Этот ответ оценен отрицательно')}
                                DoneApp={() => props.this.showAlert('Информация', 'Этот ответ оценен положительно')}
                            >
                                {result.text}
                            </Message>
                            
                            :
                            <>
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
                                sendRayt_false={() => thisOb.sendRayt(0, result.id)}
                                sendRayt_true={() => thisOb.sendRayt(1, result.id)}
                                commentclick={() => {thisOb.props.this.setState({comment: result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null}); thisOb.setActiveModal("comment")}}
                                comment={result.moderator_comment !== undefined}
                                approved={result.approved ? true : false}
                                CanselApp={() => props.this.showAlert('Информация', 'Этот ответ оценен отрицательно')}
                                DoneApp={() => props.this.showAlert('Информация', 'Этот ответ оценен положительно')}
                            >
                                {result.text}
                            </Message>
                            {/* {((result.moderator_comment !== undefined) && (result['author']['id'] === thisOb.props.account['id'])) ? <Message 
                                clickable={false}
                                title={"Модератор"} 
                                is_mine={false}
                                avatar={Moderator_img}
                                key={i}
                                time={time}
                                onClick={() => {}}

                            >
                                {result['moderator_comment']['text']}
                            </Message> : null} */}
                            </>
                        )}) : null}
                        {!((this.state.tiket_info['status'] === 1) || (this.state.tiket_info['status'] === 2)) ? <div style={{marginBottom: '20vh'}}></div> : <div style={{marginBottom: '5vh'}}></div>}
                      </>
            {/* INPUT */}
            {this.state.tiket_info['status'] === 0 || (this.state.redaction === true || this.state.add_comment === true) ? 
                (this.state.limitreach && !(this.state.redaction || this.state.add_comment)) ? 
                <FixedLayout filled vertical='bottom' style={{zIndex: 20}}>
                  <Div>
                    <FormStatus header='Внимание!' mode='default'>
                      Вы исчерпали лимит сообщений в этот тикет.
                    </FormStatus>
                  </Div>
                </FixedLayout> : 
                this.props.account.generator ?
                <FixedLayout filled vertical='bottom' style={{zIndex: 20}}>
                  <Div>
                    <FormStatus header='Внимание!' mode='default'>
                      Вы являетесь генератором. Вам запрещено отвечать на вопросы
                    </FormStatus>
                  </Div>
                </FixedLayout>
                :
                <FixedLayout filled vertical='bottom' style={{zIndex: 2}}>
                  <Separator wide />
                    <WriteBar
                      after={
                        <>
                          <WriteBarIcon mode={(this.state.redaction || this.state.edit_comment) ? 'done' : "send"}
                          disabled={!(this.state.tiket_send_message.trim().length >= 5)}
                          onClick={() => {this.detectFunction()}}
                          />
                          {/* {<WriteBarIcon><Icon20Clear width={34} height={34} /></WriteBarIcon>} */}
                        </>
                      }
                      value={this.state.tiket_send_message}
                      maxLength="4040"
                      name="tiket_send_message"
                      onChange={(e) => this.onChange(e)}
                      placeholder={this.detectPlaceholder()}
                    />
                </FixedLayout>
                
                 : null}
            {this.state.tiket_info['status'] === 1 ? 
                Number(this.state.tiket_info['author']['id']) === Number(parsedHash.vk_user_id) ?
                    <div>
                      <FixedLayout vertical="bottom" style={{zIndex: 20}} filled>
                        <Div style={{display: "flex"}}>
                          <Button size="l" style={{marginRight: "5%"}} stretched onClick={() => this.deleteTicket()}>Проблема решена</Button>
                          <Button size="l" stretched mode="secondary" onClick={() => this.openTicket()}>Проблема не решена</Button>
                        </Div>
                      </FixedLayout>
                        
                    </div>
                : null
            : null}
            {this.state.snackbar}
            </> : null}
            </Panel>
        )
    }
};
