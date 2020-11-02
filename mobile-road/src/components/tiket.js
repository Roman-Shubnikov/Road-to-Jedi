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
    Textarea,
    PanelHeaderBack
    } from '@vkontakte/vkui';

import Icon24Up from '@vkontakte/icons/dist/24/up';
import Icon16ReplyOutline from '@vkontakte/icons/dist/16/reply_outline';
import Ninja from '../images/Ninja.webp'

import Message from './message'
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
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
    return months[number_month]
}

export default class Ticket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            tiket_info: [],
            tiket_message: [],
            tiket_send_message: '',
            add_comment: false,
            redaction: false,
            


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

    }
    Prepare_ticket(){
        fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + this.props.ticket_id + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            this.setState({tiket_info: data.response.info,
              tiket_message: data.response.messages });
              this.setPopout(null);
          } else {
            this.showErrorAlert(data.error.message)
          }
        })
        .catch(err => {
          this.showErrorAlert(err)

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
          
                fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
                  .then(res => res.json())
                  .then(data => {
                    if(data.result) {
                      this.setState({tiket_message: data.response})
                      this.setActiveModal(null);
                      this.setPopout(null);
                    }else {
                      this.showErrorAlert(data.error.message)
                    }
                    })
                    .catch(err => {
                      this.showErrorAlert(err)
                    })
              }else {
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
                this.showErrorAlert(err)
            
            })
        }
      }
      sendClear(id) {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.approveReply&message_id=" + id + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.setPopout(null)
            } else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert(err)
    
          })
      }
      Admin(id, author_id, text, comment,avatar=null, mark = -1){
        this.props.this.setPopout(
          <ActionSheet onClose={() => this.setPopout(null)}>
             {author_id > 0 ?
            <ActionSheetItem autoclose onClick={() => this.goOtherProfile(author_id)}>
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
            { this.props.account.special === true && author_id > 0 ? 
            <ActionSheetItem autoclose onClick={() => this.sendClear(id)}>
              Одобрить
            </ActionSheetItem> 
            : null }
            { (this.props.account.special === true && author_id < 0) ? 
            <ActionSheetItem autoclose onClick={() => {this.props.this.setState({other_profile:{'id':author_id,'avatar': {'url': avatar}}});this.setActiveModal('ban_user');}}>
              Забанить пользователя
            </ActionSheetItem> 
            : null }
            { this.props.account.special === true && author_id > 0 ? 
            comment === null || comment === undefined? 
            <ActionSheetItem autoclose onClick={() => this.setState({add_comment: true, message_id_add: id})}>
            Добавить комментарий
            </ActionSheetItem> 
            : null
            : null }
            {Number(author_id === this.props.account.id) ? 
           <ActionSheetItem autoclose onClick={() => this.setState({redaction: true, message_id_redac: id, tiket_send_message: text})}>
           Редактировать
           </ActionSheetItem>
           : null}
        {comment === null || comment === undefined ? null : 
            <ActionSheetItem autoclose onClick={() => {this.props.this.setState({comment: comment}); this.setActiveModal("comment")}}>
            Просмотреть комментарий
          </ActionSheetItem>
            }
            {Number(author_id) === Number(this.props.account.id) || this.props.account.special === true ? 
            <ActionSheetItem autoclose onClick={() => this.deleteMessage(id)}>
              Удалить сообщение
            </ActionSheetItem>
            : null}
            {<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}
          </ActionSheet>
        )
      }
      copy(id) {
        this.setPopout(
          <ActionSheet onClose={() => this.setState({ popout: null })}>
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
      sendNewMessage() {
        if(this.state.tiket_send_message.length >= 5) {
          this.setPopout(<ScreenSpinner/>)
          var url = this.state.api_url + 'method=ticket.sendMessage&' + window.location.search.replace('?', '');
          var method = 'POST';
          var async = true;
      
          var xhr = new XMLHttpRequest();
          xhr.open( method, url, async );
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      
          xhr.onreadystatechange = () => {
            if(xhr.status === 4) return;
            if ( xhr.status === 200 ) {
              fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
                if(data.result) {
                  this.setState({tiket_message: data.response, tiket_send_message: "",add_comment: false, redaction: false})
                  this.setPopout(null)
                }else {
                  this.showErrorAlert(data.error.message)
                }
              })
              .catch(err => {
                this.showErrorAlert(err)
  
              })
            }
          }
          
          xhr.send( 'ticket_id=' + this.state.tiket_info['id'] + '&text=' + this.state.tiket_send_message);
      
          xhr.onerror = ( error ) => {
            this.showErrorAlert(error)
  
            console.error( error );
          }
        } else {
            // this.showErrorAlert("Текст сообщения должен быть минимум из 5 символов.")
        }
      }
      deleteMessage(message_id) {
        this.setPopout(<ScreenSpinner/>)
          fetch(this.state.api_url + "method=ticket.deleteMessage&message_id=" + message_id + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
                  .then(res => res.json())
                  .then(data => {
                    if(data.result) {
                      this.setState({tiket_message: data.response})
                      this.setPopout(null)
                    }else {
                      this.showErrorAlert(data.error.message)
                    }
                  })
                  .catch(err => {
                    this.showErrorAlert(err)
          
                  })
              }else {
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
                this.showErrorAlert(err)
  
            })
      }
      deleteTicket() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.close&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
              .then(res => res.json())
               .then(data => {
              if(data.result) {
                this.setState({tiket_info: data.response.info})
                this.setPopout(null)
              }else {
                this.showErrorAlert(data.error.message)
              }
              })
              .catch(err => {
                this.showErrorAlert(err)
      
              })
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert(err)
  
          })
      }
      openTicket() {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=ticket.open&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
              .then(res => res.json())
               .then(data => {
              if(data.result) {
                this.setState({tiket_info: data.response.info})
                this.setPopout(null)
              }else {
                this.showErrorAlert(data.error.message)
              }
            })
          .catch(err => {
            this.showErrorAlert(err)
  
          })
            }else {
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.showErrorAlert(err)
  
          })
      }
      sendNewMessageRedact() {
        this.setPopout(<ScreenSpinner/>)
        if(this.state.tiket_send_message.length >= 5) {
          var url = this.state.api_url + 'method=ticket.editMessage&' + window.location.search.replace('?', '');
          var method = 'POST';
          var async = true;
      
          var xhr = new XMLHttpRequest();
          xhr.open( method, url, async );
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      
          xhr.onreadystatechange = () => {
            if(xhr.status === 4) return;
            if ( xhr.status === 200 ) {
              fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
                if(data.result) {
                  this.setState({tiket_message: data.response, tiket_send_message: "", add_comment: false, redaction: false})
                  this.setPopout(null)
                }else {
                  this.showErrorAlert(data.error.message)
                }
              })
              .catch(err => {
                console.log(err)
              })
            }
          }
          
          xhr.send('message_id=' + this.state.message_id_redac + '&text=' + this.state.tiket_send_message);
      
          xhr.onerror = ( error ) => {
            this.showErrorAlert(error)
  
            console.error( error );
          }
        } else {
            this.showErrorAlert("Текст сообщения должен быть минимум из 5 символов.")
        }
      }
      sendNewMessageComment() {
        this.setPopout(<ScreenSpinner/>)
        if(this.state.tiket_send_message.length >= 5) {
          var url = this.state.api_url + 'method=ticket.commentMessage&' + window.location.search.replace('?', '');
          var method = 'POST';
          var async = true;
      
          var xhr = new XMLHttpRequest();
          xhr.open( method, url, async );
          xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      
          xhr.onreadystatechange = () => {
            if(xhr.status === 4) return;
            if ( xhr.status === 200 ) {
              console.log(xhr.responseText)
              fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
                if(data.result) {
                  this.setState({tiket_message: data.response, tiket_send_message: "",add_comment: false, redaction: false})
                }else{
                  this.showErrorAlert(data.error.message)
                }
              })
              .catch(err => {
                this.showErrorAlert(err)
  
              })
            }
          }
          xhr.send('message_id=' + this.state.message_id_add + '&text=' + this.state.tiket_send_message);
      
          xhr.onerror = ( error ) => {
            this.showErrorAlert(error)
          }
        } else {
          this.showErrorAlert("Текст сообщения должен быть минимум из 5 символов.")
        }
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
                left={<PanelHeaderBack onClick={() => this.props.this.goBack()} />}
            >
                <span id="animation" onClick={() => this.copy(this.state.tiket_info['id'])}>Вопрос #{this.state.tiket_info['id']}</span>
            </PanelHeader>
            {/* MESSAGES */}
            <div className="title_tiket">{new Date(this.state.tiket_info['time'] * 1e3).getDate()} {add_month(this.state.tiket_info['time'])}</div>
            <div className="title_tiket" style={{marginTop: "10px", width: "95%", marginLeft: "10px"}}>Пользователь обратился с вопросом  «{this.state.tiket_info['title']}»</div>
                    {this.state.tiket_message ? this.state.tiket_message.map(function(result, i) {
                        var is_mine_ticket = Number(thisOb.state.tiket_info.author['id']) === Number(parsedHash.vk_user_id) ? true : false


                        var is_mine_message = Number(result['author']['id']) === Number(parsedHash.vk_user_id) ? true : false
                        var avatar = result.author.is_moderator ? result['author']['avatar']['url'] : result.author.photo_200
                        var time = fix_time(new Date(result.time * 1e3).getHours()) + ":" + fix_time(new Date(result.time * 1e3).getMinutes())
                        var title_moder = isFinite(result['nickname']) ? `Агент Поддержки #${result['nickname']}` : result['nickname'] ? result['nickname'] : `Агент Поддержки #${result['author']['id']}`;
                        return (
                            Number(thisOb.state.tiket_info.author['id']) === Number(parsedHash.vk_user_id) ?
                            <Message 
                                title={result.author.id === 526444378 ? "Витёк" : result.author.is_moderator ? title_moder : result.author.first_name + " " + result.author.last_name} 
                                title_icon={result.moderator_comment !== undefined ? <Icon16ReplyOutline width={10} height={10} style={{display: "inline-block"}}/> : false}
                                is_mine={is_mine_message === is_mine_ticket}
                                avatar={avatar}
                                onClick={() => thisOb.Admin(result['id'], result['author'].first_name ? -result['author']['id'] : result['author']['id'] , result['text'], result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null,avatar, result['mark'])}
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
                                title={result.author.id === 526444378 ? "Витёк" : result.author.is_moderator ? title_moder : result.author.first_name + " " + result.author.last_name} 
                                title_icon={result.moderator_comment !== undefined ? <Icon16ReplyOutline width={10} height={10} style={{display: "inline-block"}}/> : false}
                                is_mine={result.author.is_moderator}
                                avatar={result.author.id === 526444378 ? Ninja : avatar}
                                key={i}
                                time={time}
                                onClick={() => thisOb.Admin(result['id'], result['author'].first_name ? -result['author']['id'] : result['author']['id'], result['text'], result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null,avatar, result['mark'])}
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
            {/* INPUT */}
            {this.state.tiket_info['status'] === 0 || (this.state.redaction === true || this.state.add_comment === true) ? 
                //  <div id="other" className="other">
                //     <div className="down_input_message">
                //         <textarea maxLength="2020" name="tiket_send_message" value={this.state.tiket_send_message} onChange={(e) => this.onChange(e)} placeholder={this.state.add_comment ? "Комментарий... (Не менее 6 символов)" : "Ответ... (Не менее 6 символов)"} className="textarea"></textarea>
                //     </div>
                //     <div className="send_text" onClick={() => {(this.state.tiket_send_message.length > 5) ? this.state.redaction !== true && this.state.add_comment !== true ? this.sendNewMessage() : this.state.redaction ? this.sendNewMessageRedact() : this.sendNewMessageComment() : this.nofinc()}}>
                //         <Icon24Up style={{color: (this.state.tiket_send_message.length > 5) ? "var(--dynamic_green)" : "var(--dynamic_orange)"}} />
                //     </div>
                // </div>
                <Div className="message_sending">
                    <Textarea 
                    maxLength="2020" 
                    value={this.state.tiket_send_message}
                    name="tiket_send_message"
                    onChange={(e) => this.onChange(e)} 
                    placeholder={this.state.add_comment ? "Комментарий... (Не менее 6 символов)" : "Ответ... (Не менее 6 символов)"}
                    style={{width: platformname ? "82%" : "85%"}}></Textarea>
                    <div className="send_text" 
                    onClick={() => {(this.state.tiket_send_message.length > 5) ? this.state.redaction !== true && this.state.add_comment !== true ? this.sendNewMessage() : this.state.redaction ? this.sendNewMessageRedact() : this.sendNewMessageComment() : this.nofinc()}}
                    style={{background: (this.state.tiket_send_message.length > 5) ? "var(--button_send)" : "#98A0AD"}} >
                        <Icon24Up width={30} height={30} />
                    </div>
                </Div>
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
            : null}
                <br/>
                <br/>
                <br/>
            </Panel>
        )
    }
};
