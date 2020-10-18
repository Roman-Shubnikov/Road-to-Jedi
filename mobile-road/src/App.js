import React from 'react'; // React
import connect from '@vkontakte/vk-bridge'; // VK Connect
import vkQr from '@vkontakte/vk-qr';

import {ConfigProvider, Epic, Tabbar, TabbarItem, Snackbar, List, Div, Input, ModalRoot, Alert, ModalPage, ModalPageHeader, Cell, Button, ScreenSpinner, ActionSheet, ActionSheetItem, ModalCard, Avatar, HeaderContext } from '@vkontakte/vkui';
import View from '@vkontakte/vkui/dist/components/View/View'
import Header from '@vkontakte/vkui/dist/components/Header/Header'

import eruda from 'eruda';
import '@vkontakte/vkui/dist/vkui.css';
import './style.css'
// Импортируем панели
import Home from './panels/questions.js'
import Tiket from './panels/tiket.js'
import Top from './panels/top.js'
import Profile from './panels/profile.js'
import Other_Profile from './panels/other_profile'
import Profile_Help from './panels/profile_help'
import New_Tiket from './panels/new_tiket'
import Notif from './panels/notif.js'
import Money from './panels/money.js'
import Vitas from './panels/vitas.js';
import Qu from './panels/AllQuestions.js'
import Achives from './panels/achives.js';

import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon20PlaceOutline from '@vkontakte/icons/dist/24/place';
import Icon28Notification from '@vkontakte/icons/dist/28/notifications';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon24Qr from '@vkontakte/icons/dist/24/qr';
import Icon28MessagesOutline from '@vkontakte/icons/dist/28/messages_outline';
import Icon24Linked from '@vkontakte/icons/dist/24/linked';
import Icon56FireOutline from '@vkontakte/icons/dist/56/fire_outline';
import Icon56MoneyTransferOutline from '@vkontakte/icons/dist/56/money_transfer_outline'

const queryString = require('query-string');

const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);

function qr(agent_id, sheme) {
  let hex = "foregroundColor"
  if(sheme === "bright_light") {
    hex = "#000"
  }
  if(sheme === "space_gray") {
    hex = "#fff"
  }
  return (
    vkQr.createQR('https://vk.com/app7409818#agent_id=' + agent_id, {
    qrSize: 120,
    isShowLogo: true,
    foregroundColor: hex
  })
  )
}

const blueBackground = {
  backgroundColor: 'var(--accent)'
};


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activePanel: 'questions',
            activeStory: 'questions',
            history: ['questions'],
            scheme: "space_gray",
            activeModal: null,
            label: null,
            title_new_tiket: "",
            text_new_tiket: "",
            aside: 1,
            offset: 0,
            offset_moder: 0,
            offset_profile: 0,
            api_url: "https://xelene.ru/road/php/index.php?",
            api_url_second: "https://xelene.ru/road/php/index.php?",
            status: false,
            is_special_moder: false,
            is_first_start: false,
            popout: <ScreenSpinner/>,
            money: false,
            first_name: "Имя",
            last_name: "Фамилия",
            title_another: "Мои вопросы",
            is_continium: false,
            redaction: false,
            message_id_redac: 1,
            add_comment: false,
            message_id_add: 1,
            comment: "",
            snackbar: null,
            money_transfer_send: "",
            money_transfer_comment: '',
            moneys: [],
            ban_reason: '',
            changed_id: '',

            profile_help: [],
            profile_another_helper: [],
            tiket_send_message: "",
            tiket_all: [],
            tiket_moder: [],
            tiket_helper_moder: [],
            tiket_all_helper: [],
            tiket_info: [],
            tiket_message: [],
            notification: [],
            profile: [],
            test: [],
            top_agents: [],
            other_profile: {
              'id': 0,
              'avatar': {
                'url': ''
              }
            },
            transfer: {
              'avatar': '',
              'comment': ''
            },
            myQuestions: [],
            switchKeys: false,

        };
        this.onStoryChange = this.onStoryChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.closePopout = this.closePopout.bind(this);
        this.setActiveModal = this.setActiveModal.bind(this);
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
          };
    }

    componentDidMount() {
        connect.subscribe(({ detail: { type, data }}) => { 
          console.log(type)
          console.log(data)
        if(type === 'VKWebAppAllowMessagesFromGroupResult') {
          fetch(this.state.api_url_second + "method=notifications.swift&swift=on&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data) {
                this.setState({switchKeys: true})
              }
            })
            .catch(err => {
              this.showErrorAlert()
            })
        }
        if(type === 'VKWebAppAllowMessagesFromGroupFailed') {
          fetch(this.state.api_url_second + "method=notifications.swift&swift=off&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data) {
                this.setState({switchKeys: false})
              }
            })
            .catch(err => {
              this.showErrorAlert()
            })
        }
			  if (type === 'VKWebAppUpdateConfig') {
          this.setState({scheme: data.scheme})
            if(data.scheme === "client_light") {
              this.setState({scheme: "bright_light"})
              } else if(data.scheme === "client_dark") {
                this.setState({scheme: "space_gray"})
              } else {
                this.setState({scheme: data.scheme})
              }
            }
        })
        if(hash.ticket_id !== undefined) {
          this.goTiket(hash.ticket_id)
        }
        if(hash.agent_id !== undefined) {
          this.goOtherProfile(hash.agent_id, true)
        }
        if(hash.new !== undefined) {
          this.goNew_Tiket()
        }
        window.addEventListener('popstate', e => e.preventDefault() & this.goBack(e)); 
        fetch(this.state.api_url + "method=account.get&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.response) {
            this.setState({test: data.response, is_first_start: data.response.is_first_start, popout: null, switchKeys: data.response.noti})
            this.Others()
            if(data.response.special === true) {
              this.setState({is_special_moder: true})
            }
            if(data.response.is_first_start === true) {
              this.setActiveModal("start")
            }
          } else {
            this.setState({popout: 
              <Alert
        actions={[{
          title: 'Повторить',
          autoclose: true,
          style: 'cancel',
          action: () => this.componentDidMount()
        }]}
        onClose={this.closePopout}
      >
        <h2>Ошибка</h2>
        <p>{data.error.message}</p>
            </Alert>})
          }
        })
        .catch(err => {
          this.showErrorAlert()
        })
    }

    goMoney() {
      this.setState({popout: <ScreenSpinner/>})
      setTimeout(() => {
        window.history.pushState({panel: 'money'}, `money`);
        this.setState({
          activePanel: "money",
          history: [...this.state.history, "money"],
          popout: null
        })
      }, 1500)
    }

    openMoneyTransfer(avatar, text, comment) {
      this.setState({transfer: {
        avatar: avatar,
        text: text,
        comment: comment.length > 0 ? comment : 'Агент не оставил комментария 😢'
      }})
      this.setActiveModal('transfer')
    }

    goVitas() {
      this.setState({popout: <ScreenSpinner/>})
      setTimeout(() => {
        window.history.pushState({panel: 'vitas'}, `vitas`);
        this.setState({
          activePanel: "vitas",
          history: [...this.state.history, "vitas"],
          popout: null
        })
      }, 1500)
    }

    showAlert(title, text) {
      this.setState({
        popout: 
          <Alert
            actions={[{
              title: 'Закрыть',
              autoclose: true,
              style: 'cancel'
            }]}
            onClose={this.closePopout}
          >
            <h2>{title}</h2>
            <p>{text}</p>
        </Alert>
      })
    }

    userBan(user_id, text) {
      this.setState({popout: <ScreenSpinner/>})
      console.log(this.state.api_url_second + "method=ban.user&user_id=" + user_id + "&text=" + text + "&" + window.location.search.replace('?', ''))
      fetch(this.state.api_url_second + "method=ban.user&user_id=" + user_id + "&text=" + text + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.response) {
          this.setActiveModal(null);
          this.showAlert('Нормас', 'Пользователь забанен');
        }
      })
      .catch(err => {
        this.showErrorAlert()
      })
    }

    ChangeId() {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url_second + "method=change.id&id=" + this.state.changed_id + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.response) {
          this.setState({snackbar: 
            <Snackbar
              layout="vertical"
              onClose={() => this.setState({ snackbar: null })}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              id Агента успешно сменен
            </Snackbar>, popout: null
          })
          this.LoadProfile()
          window.history.back()
        } else {
          this.showAlert('Ошибка', data.error_text);
        }
      })
      .catch(err => {
        this.showErrorAlert()
      })
    }

    deleteStats() {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url_second + "method=delete.stats&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        console.log(data)
        if(data.response) {
          this.setState({snackbar: 
            <Snackbar
              layout="vertical"
              onClose={() => this.setState({ snackbar: null })}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              Статистика профиля сброшена
            </Snackbar>, popout: null
          })
          this.LoadProfile()
          window.history.back()
        } else {
          this.showAlert('Ошибка', data.error_text);
        }
      })
      .catch(err => {
        this.showErrorAlert()
      })
    }

    LoadProfile() {
      fetch(this.state.api_url + "method=account.get&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
              if(data.response) {
                console.log(data.response)
                  this.setState({profile: data.response})
                }})
              .catch(err => {
                this.showErrorAlert()

              })
    }

    Others() {
      fetch(this.state.api_url + "method=tickets.get&count=20&unanswered=1&offset=" + this.state.offset + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if(data.response) {
          var sliyan = this.state.tiket_all.concat(data.response)
          this.setState({tiket_all: sliyan, tiket_all_helper: data.response, offset: this.state.offset + 20})
        }
      })
      .catch(err => {
        this.showErrorAlert()
      })
      fetch(this.state.api_url + "method=notifications.getCount&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data) {
              this.Notification(data.response)
            }
          })
          .catch(err => {
            this.showErrorAlert()
          })
    }

    changeAvatar(last_selected) {
        console.log(last_selected)
        fetch(this.state.api_url_second + "method=change_avatar&avatar_id=" + last_selected + "&" + window.location.search.replace('?', ''))
        .then(data => data.json())
        .then(data => {
          console.log(data)
            if(data.error_code !== 2 && data.error_code !== 1) {
                this.setState({snackbar: 
                  <Snackbar
                    layout="vertical"
                    onClose={() => this.setState({ snackbar: null })}
                    before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                  >
                    Аватар успешно сменен
                  </Snackbar>
                })
            fetch(this.state.api_url + "method=account.get&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
              if(data.response) {
                console.log(data.response)
                  this.setState({profile: data.response})
                }})
              .catch(err => {
                this.showErrorAlert()

              })
                if(this.state.snackbar !== null) {
                  window.history.back()
                }
            } else {
              console.log(data)
              this.setState({popout: 
                <Alert
          actions={[{
            title: 'Повторить',
            autoclose: true,
            style: 'cancel',
            action: () => this.componentDidMount()
          }]}
          onClose={this.closePopout}
        >
          <h2>Ошибка</h2>
          <p>{data.error_text}</p>
              </Alert>})
            }
          })
        .catch(err => {
            console.log(err)
        })
    }

    goBoard() {
      window.history.pushState({panel: 'tiket'}, `tiket`);
      this.setState({
        activePanel: "onboarding",
        history: [...this.state.history, "onboarding"],})
    }

    sendRayt(mark, message_id) {
      console.log(message_id)
      console.log(mark)
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
            if(data) {
              console.log(data)
              fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.response) {
            this.setState({tiket_message: data.response, activeModal: null, popout: null})
          }
        })
        .catch(err => {
          this.showErrorAlert()
        })
            }
          })
          .catch(err => {
          this.showErrorAlert()
          
          })
      }
    }

    deleteMessage(message_id) {
      this.setState({popout: <ScreenSpinner/>})
        fetch(this.state.api_url + "method=ticket.deleteMessage&message_id=" + message_id + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data) {
              fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.response) {
            this.setState({tiket_message: data.response, popout: null})
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
            }
          })
          .catch(err => {
            this.showErrorAlert()

          })
    }

    Notification(value) {
      if(value > 0) {
        this.setState({label: value})
      }
    }

    onChange(event) {
      var name = event.currentTarget.name;
      var value = event.currentTarget.value;
      this.setState({ [name]: value });
  }

  sendClear(id) {
    this.setState({popout: <ScreenSpinner/>})
    fetch(this.state.api_url + "method=ticket.approveReply&message_id=" + id + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if(data.response) {
          console.log(data.response)
           this.setState({popout: null})
           fetch(this.state.api_url + "method=tickets.get&count=20&unanswered=1&offset=0&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if(data.response) {
          this.setState({tiket_all: data.response, tiket_all_helper: data.response})
        }
      })
      .catch(err => {
        this.showErrorAlert()

      })
        } else {
          this.setState({popout: 
            <Alert
            actions={[{
              title: 'Переподключиться',
              autoclose: true,
              style: 'cancel',
              action: () => this.componentDidMount()
            }]}
            onClose={this.closePopout}
          >
            <h2>Ошибка</h2>
          <p>{data.error.message}</p>
          </Alert>
          })
        }
      })
      .catch(err => {
        this.showErrorAlert()

      })
  }

  Dop() {
    this.setState({popout: <ScreenSpinner/>})
    fetch(this.state.api_url + "method=tickets.getMy&count=20&offset=" + this.state.offset_profile + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        var sliyan = this.state.profile_help.concat(data.response)
        if(data.response) {
          window.history.pushState({panel: 'profile_help'}, `profile_help`);
            this.setState({
                another_title: "Мои вопросы",
                profile_help: sliyan,
                offset_profile: this.state.offset_profile + 20,
                profile_another_helper:  data.response,
                activePanel: "profile_help",
                history: [...this.state.history, "profile_help"],
                popout: null})
        }
      })
      .catch(err => {
        this.showErrorAlert()

      })
}

    goBack = () => {
        const history = this.state.history;
        if(history.length === 1) {
            connect.send("VKWebAppClose", {"status": "success"});
        } else if (history.length > 1) {
            history.pop()
            this.setState({activeView: this.state.help_navigation, activePanel: history[history.length - 1], add_comment: false, redaction: false, tiket_send_message: "", money: false}) 
        }
    }

    goTiket(id) {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + id + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.response) {
            this.setState({tiket_info: data.response})
            fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + id + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.response) {
            console.log(data.response)
            window.history.pushState({panel: 'tiket'}, `tiket`);
            this.setState({tiket_message: data.response, history: [...this.state.history, "tiket"], activeModal: null, activePanel: "tiket", popout: null})
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
          } else {
            this.setState({popout: 
              <Alert
              actions={[{
                title: 'Отмена',
                autoclose: true,
                style: 'cancel'
              }]}
              onClose={this.closePopout}
            >
              <h2>Ошибка</h2>
            <p>{data.error.message}</p>
            </Alert>
            })
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
    }

    getRandomTiket() {
      fetch(this.state.api_url + "method=ticket.getRandom&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data) {
            this.goTiket(data.response.id)
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
    }

    goOtherProfile(id, is_change) {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url + "method=user.getById&id=" + id + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data) {
            console.log(data.response)
            this.setState({other_profile: data.response, popout: null})
            if(is_change) {
              window.history.pushState({panel: 'other_profile'}, `other_profile`);
              this.setState({history: [...this.state.history, "other_profile"], activePanel: "other_profile"})
            }
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
    }

    goNew_Tiket() {
      window.history.pushState({panel: 'new_tiket'}, `new_tiket`);
      this.setState({history: [...this.state.history, "new_tiket"], activePanel: "new_tiket", activeModal: null})
    }

    deleteTicket() {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url + "method=ticket.close&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data) {
            console.log(data.response)
            fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
             .then(data => {
            if(data) {
              this.setState({tiket_info: data.response, popout: null})
            }
          })
        .catch(err => {
          this.showErrorAlert()

        })
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
    }

    openTicket() {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url + "method=ticket.open&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data) {
            console.log(data.response)
            fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
             .then(data => {
            if(data) {
              this.setState({tiket_info: data.response, popout: null})
            }
          })
        .catch(err => {
          this.showErrorAlert()

        })
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
    }

    sendNewVitya() {
      this.setState({popout: <ScreenSpinner/>})
      var global = this;
      if(this.state.text_new_tiket.length >= 5 || this.state.title_new_tiket.length >= 5) {
        var url = this.state.api_url_second + 'method=vitya.add&' + window.location.search.replace('?', '');
        var method = 'POST';
        var async = true;
    
        var xhr = new XMLHttpRequest();
        xhr.open( method, url, async );
        //.then(response => response.json())
        
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
        xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            if(xhr.responseText) {
              global.setState({title_new_tiket: '', text_new_tiket: '',
                popout: 
                <Alert
             actions={[{
               title: 'Отмена',
               autoclose: true,
               style: 'cancel'
             }]}
             onClose={global.closePopout}
           >
             <h2>Красава!</h2>
             <p>{JSON.parse(xhr.responseText).response}</p>
           </Alert>
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

    sendNewMessage() {
      this.setState({popout: <ScreenSpinner/>})
      if(this.state.tiket_send_message.length >= 5) {
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
              if(data) {
                this.setState({tiket_message: data.response, tiket_send_message: "", popout: null, add_comment: false, redaction: false, tiket_send_message: ""})
              }
            })
            .catch(err => {
              this.showErrorAlert()

            })
          }
        }
        
        xhr.send( 'ticket_id=' + this.state.tiket_info['id'] + '&text=' + this.state.tiket_send_message);
    
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
        <p>Текст сообщения должен быть минимум из 5 символов.</p>
      </Alert>
         })
      }
    }

    sendNewTiket() {
      this.setState({popout: <ScreenSpinner/>})
      var global = this;
      if(this.state.text_new_tiket.length >= 5 || this.state.title_new_tiket.length >= 5) {
        var url = this.state.api_url + 'method=ticket.add&' + window.location.search.replace('?', '');
        var method = 'POST';
        var async = true;
    
        var xhr = new XMLHttpRequest();
        xhr.open( method, url, async );
        //.then(response => response.json())
        
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    
        xhr.onreadystatechange = function() {//Вызывает функцию при смене состояния.
          if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            if(xhr.responseText) {
              let text = (JSON.parse(xhr.responseText));
              global.goTiket(text.response.ticket_id)
              global.setState({history: ['questions']})
              fetch(global.state.api_url + "method=tickets.get&unanswered=1&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
                if(data) {
                  global.setState({tiket_all: data.response, popout: null, title_new_tiket: "", text_new_tiket: ""})
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

    sendNewMessage() {
      this.setState({popout: <ScreenSpinner/>})
      if(this.state.tiket_send_message.length >= 5) {
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
              if(data) {
                this.setState({tiket_message: data.response, tiket_send_message: "", popout: null, add_comment: false, redaction: false, tiket_send_message: ""})
              }
            })
            .catch(err => {
              this.showErrorAlert()

            })
          }
        }
        
        xhr.send( 'ticket_id=' + this.state.tiket_info['id'] + '&text=' + this.state.tiket_send_message);
    
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
        <p>Текст сообщения должен быть минимум из 5 символов.</p>
      </Alert>
         })
      }
    }

    
    sendNewMessageRedact() {
      this.setState({popout: <ScreenSpinner/>})
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
            console.log(xhr.responseText)
            fetch(this.state.api_url + "method=ticket.getMessages&ticket_id=" + this.state.tiket_info['id'] + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data) {
                this.setState({tiket_message: data.response, tiket_send_message: "", popout: null, add_comment: false, redaction: false, tiket_send_message: ""})
              }
            })
            .catch(err => {
              console.log(err)
            })
          }
        }
        console.log(this.state.tiket_send_message)
        
        xhr.send('message_id=' + this.state.message_id_redac + '&text=' + this.state.tiket_send_message);
    
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
        <p>Текст сообщения должен быть минимум из 5 символов.</p>
      </Alert>
         })
      }
    }

    allowMessage() {
      if(this.state.switchKeys !== true) {
        connect.send("VKWebAppAllowMessagesFromGroup", {"group_id": 188280516, "key": "null"});
      } else {
        fetch(this.state.api_url_second + "method=notifications.swift&swift=on&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data) {
            this.setState({switchKeys: true})
          }
        })
        .catch(err => {
          this.showErrorAlert()
        })
      }
    }

    showErrorAlert() {
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
          <p>Что-то пошло не так, попробуйте снова!</p>
        </Alert>
    })
  }

    sendNewMessageComment() {
      this.setState({popout: <ScreenSpinner/>})
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
              if(data) {
                this.setState({tiket_message: data.response, tiket_send_message: "", popout: null, add_comment: false, redaction: false, tiket_send_message: ""})
              }
            })
            .catch(err => {
              this.showErrorAlert()

            })
          }
        }
        console.log(this.state.tiket_send_message)
        
        xhr.send('message_id=' + this.state.message_id_add + '&text=' + this.state.tiket_send_message);
    
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
        <p>Текст сообщения должен быть минимум из 5 символов.</p>
      </Alert>
         })
      }
    }

    

    closePopout () {
      this.setState({ popout: null });
    }

    Admin(id, author_id, text, comment, mark = -1) {
      this.setState({popout:
        <ActionSheet onClose={() => this.setState({ popout: null })}>
          {author_id < 10000 ?
          <ActionSheetItem autoclose onClick={() => this.goOtherProfile(author_id, true)}>
            Профиль
          </ActionSheetItem>
          : null}
          { this.state.is_special_moder && mark !== 0 && mark !== 1 ? 
          <ActionSheetItem autoclose onClick={() => this.sendRayt(true, id)}>
            Оценить положительно
          </ActionSheetItem> 
          : null}
          { this.state.is_special_moder && mark !== 0 && mark !== 1 ? 
          <ActionSheetItem autoclose onClick={() => this.sendRayt(false, id)}>
            Оценить отрицательно
          </ActionSheetItem> 
          : null }
          { this.state.is_special_moder === true ? 
          <ActionSheetItem autoclose onClick={() => this.sendClear(id)}>
            Одобрить
          </ActionSheetItem> 
          : null }
          { this.state.is_special_moder === true ? 
          comment === null || comment === undefined? 
          <ActionSheetItem autoclose onClick={() => this.setState({add_comment: true, message_id_add: id})}>
          Добавить комментарий
          </ActionSheetItem> 
          : null
          : null }
          {Number(author_id === this.state.test['id']) ? 
         <ActionSheetItem autoclose onClick={() => this.setState({redaction: true, message_id_redac: id, tiket_send_message: text})}>
         Редактировать
         </ActionSheetItem>
         : null
      }
      {comment === null || comment === undefined ? null : 
          <ActionSheetItem autoclose onClick={() => {this.setState({comment: comment}); this.setActiveModal("comment")}}>
          Просмотреть комментарий
        </ActionSheetItem>
          }
          {Number(author_id) === Number(this.state.test['id']) || this.state.is_special_moder === true ? 
          <ActionSheetItem autoclose onClick={() => this.deleteMessage(id)}>
            Удалить сообщение
          </ActionSheetItem>
          : null}
          {<ActionSheetItem autoclose theme="cancel">Отменить</ActionSheetItem>}
        </ActionSheet>})
    }

    copy(id) {
      this.setState({popout:
        <ActionSheet onClose={() => this.setState({ popout: null })}>
          {console.log(parsedHash.vk_user_id)}
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
          this.state.is_special_moder === true ?
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
          <ActionSheetItem autoclose onClick={() => connect.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#ticket_id=" + id})}>
            Скопировать ссылку
          </ActionSheetItem>
          {<ActionSheetItem autoclose theme="cancel">Отменить</ActionSheetItem>}
        </ActionSheet>})
    }

    closeProm(id) {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url_second + "method=delete.prom&id=" + id + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data) {
            this.goOtherProfile(id, false)
          }
        })
        .catch(err => {
          this.showErrorAlert()
        })
    }

    giveProm(id) {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url_second + "method=add.prom&id=" + id + "&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data) {
            this.goOtherProfile(id, false)
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
    }

    copy1(id, prometey) {
      this.setState({popout:
        <ActionSheet onClose={() => this.setState({ popout: null })}>
          {this.state.is_special_moder ? 
           <ActionSheetItem autoclose onClick={prometey ? () => this.closeProm(id) : () => this.giveProm(id)}>
            {prometey ? 'Забрать прометей' : 'Выдать прометей'}
          </ActionSheetItem>
          : null }
          {this.state.is_special_moder ? 
           <ActionSheetItem autoclose onClick={() => this.setActiveModal('ban_user')}>
            Заблокировать
          </ActionSheetItem>
          : null }
          <ActionSheetItem autoclose onClick={() => connect.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#agent_id=" + id})}>
            Скопировать ссылку
          </ActionSheetItem>
          {<ActionSheetItem autoclose theme="cancel">Отменить</ActionSheetItem>}
        </ActionSheet>})
    }

    setActiveModal(activeModal) {
        activeModal = activeModal || null;
        let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];
    
        if (activeModal === null) {
          modalHistory = [];
        } else if (modalHistory.indexOf(activeModal) !== -1) {
          modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
        } else {
          modalHistory.push(activeModal);
        }
    
        this.setState({
          activeModal,
          modalHistory
        });
      };


    Special_Moder() {
      fetch(this.state.api_url + "method=tickets.get&count=20&unanswered=0&offset=" + this.state.offset_moder + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
      if(data.response) {
        var sliyan = this.state.tiket_moder.concat(data.response)
        this.setState({tiket_moder: sliyan, tiket_helper_moder: data.response, offset_moder: this.state.offset_moder + 20, popout: null})
        this.setState({ activeStory: "special", history: ["special"], activePanel: "special"})
      }
      })
      .catch(err => {
        this.showErrorAlert()

      })
    }

    onStoryChange (e) {
      this.setState({popout: <ScreenSpinner/>})
        if(e.currentTarget.dataset.story === "notif") {
          fetch(this.state.api_url + "method=notifications.get&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data) {
                this.setState({notification: data.response})
                this.setState({label: "", popout: null})
                this.setState({ activeStory: "notif", history: ["notif"], activePanel: "notif"})
              }
            })
            .catch(err => {
              this.showErrorAlert()

            })
          } else if(e.currentTarget.dataset.story === "profile") {
            fetch(this.state.api_url + "method=account.get&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
              if(data.response) {
                  console.log(data.response)
                  this.setState({profile: data.response, popout: null, snackbar: null, switchKeys: data.response.noti})
                  this.setState({ activeStory: "profile", history: ["profile"], activePanel: "profile"})
                }})
              .catch(err => {
                this.showErrorAlert()

              })
            connect.send("VKWebAppGetUserInfo", {});
		        connect.subscribe(({ detail: { type, data }}) => {
			      if (type === 'VKWebAppGetUserInfoResult') {
              this.setState({first_name: data.first_name, last_name: data.last_name})
            }
		      });
        } else if(e.currentTarget.dataset.story === "top") {
          fetch(this.state.api_url + "method=users.getTop&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data) {
              this.setState({top_agents: data.response, popout: null})
              this.setState({ activeStory: "top", history: ["top"], activePanel: "top"})
            }
          })
          .catch(err => {
            this.showErrorAlert()

          })
        } else if(e.currentTarget.dataset.story === "questions") {
          fetch(this.state.api_url + "method=tickets.get&unanswered=1&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
          if(data) {
            this.setState({tiket_all: data.response, popout: null})
            this.setState({ activeStory: "questions", history: ["questions"], activePanel: "questions"})
          }
        })
        .catch(err => {
          this.showErrorAlert()

        })
        }
        else if(e.currentTarget.dataset.story === "special") {
          fetch(this.state.api_url + "method=tickets.get&count=20&unanswered=0&offset=" + this.state.offset + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
          if(data.response) {
            var sliyan = this.state.tiket_moder.concat(data.response)
            this.setState({tiket_moder: sliyan, tiket_helper_moder: data.response, offset: 0, popout: null})
            this.setState({ activeStory: "special", history: ["special"], activePanel: "special"})

        }
      })
      .catch(err => {
        this.showErrorAlert()

      })
        }
        else {
          this.setState({ activeStory: e.currentTarget.dataset.story, history: [e.currentTarget.dataset.story], activePanel: e.currentTarget.dataset.story})
        }
      }

      myQuestions() {
        this.setState({popout: <ScreenSpinner/>})
        fetch(this.state.api_url_second + "method=my.questions&id=" + this.state.profile['id']  + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data) {
              this.setState({myQuestions: data, popout: null, history: [...this.state.history, "qu"], activePanel: "qu"})
              window.history.pushState({panel: 'qu'}, `qu`);
            }
          })
          .catch(err => {
            this.showErrorAlert()
  
          })
      }

      goAchive() {
        this.setState({history: [...this.state.history, "achives"], activePanel: "achives"})
        window.history.pushState({panel: 'achives'}, `achives`);
      }

      sendMoney() {
        fetch(this.state.api_url_second + 'method=money.send&count=' +  this.state.money_transfer_count + '&user_id=' + this.state.money_transfer_send + '&comment=' + this.state.money_transfer_comment + "&" + window.location.search.replace('?', ''))
        .then(data => data.json())
        .then(data => {
          if(typeof data.response !== 'undefined') {
            this.setState({moneys: data.response})
            this.setActiveModal("moneys")
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
           <p>{data.error_text}</p>
         </Alert>
            })
          }
        })
      }
    
    render() {
        const modal = (
            <ModalRoot activeModal={this.state.activeModal}>
              <ModalCard
                id={'prom'}
                onClose={() => this.setActiveModal(null)}
                icon={<Icon56FireOutline fill="#f15b49" width={72} height={72} />}
                caption="Прометей — особенный значок, выдаваемый агентам за хорошее качество ответов."
          actions={[{
            title: 'Класс!',
            mode: 'secondary',
            action: () => {
              this.setActiveModal(null);
            }
          }
          ]}
        />
                <ModalPage
                id="settings"
                onClose={this.modalBack}
                header={
                  <ModalPageHeader
                  right={<Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
                  >
                    Настройки
                  </ModalPageHeader>
                }
                >
                  <Div>
                    <Button onClick={() => this.goNew_Tiket()} level="secondary" style={{height: "35px"}} stretched before={<Icon24Add/>}>Добавить вопрос</Button>
                  </Div>
                  <Div>
                    <Button onClick={() => this.getRandomTiket()} level="secondary" style={{height: "35px", marginTop: "-10px"}} stretched before={<Icon20PlaceOutline/>}>Случайный тикет</Button>
                  </Div>
                </ModalPage>
                <ModalPage
                id="comment"
                onClose={this.modalBack}
                header={
                  <ModalPageHeader
                  right={<Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
                  >
                    Комментарий
                  </ModalPageHeader>
                }
                >
                  <Div>
                    <div style={{whiteSpace: "pre-wrap"}}>{this.state.comment}</div>
                  </Div>
                </ModalPage>
                <ModalPage
                id="share"
                onClose={this.modalBack}
                header={
                  <ModalPageHeader
                  right={<Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
                  >
                    Поделиться
                  </ModalPageHeader>
                }
                >
                  <List>
                    <Cell onClick={() => this.setActiveModal("qr")} before={<Icon24Qr width={28} height={28}/>}>QR-code</Cell>
                    <Cell onClick={() => {connect.send("VKWebAppShare", {"link": "https://vk.com/app7409818#agent_id=" + this.state.profile['id']}); this.setActiveModal(null)}} before={<Icon28MessagesOutline width={28} height={28}/>}>В сообщения</Cell>
                    <Cell onClick={() => {connect.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#agent_id=" + this.state.profile['id']}); this.setActiveModal(null)}} before={<Icon24Linked width={28} height={28}/>}>Скопировать ссылку</Cell>
                  </List>
                </ModalPage>
                <ModalPage
                id="qr"
                onClose={this.modalBack}
                header={
                  <ModalPageHeader
                  right={<Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
                  >
                    QR
                  </ModalPageHeader>
                }
                >
                 {<div className="qr" dangerouslySetInnerHTML={{__html: qr(this.state.profile['id'], this.state.scheme)}}/>}
                 <br/>
                 <div className="qr">Отсканируйте камерой ВКонтакте!</div>
                 <br/>
                </ModalPage>
                <ModalCard
                  id="start"
                  onClose={() => this.setActiveModal(null)}
                  icon={<Avatar src={this.state.test.id !== undefined ? "https://api.xelene.me" + this.state.test.avatar.url : null} size={70} />}
                  caption={<div>Вам присвоен номер #{this.state.test.id !== undefined ? this.state.test.id : "undefined"}<br/><br/>Помните, отвечать нужно вдумчиво. После ответа команда наших модераторов проверит его и даст комментарий, если всё хорошо - вам придет уведомление.<br/><br/>Сервис не имеет отношения к Администрации ВКонтакте</div>}
                  actions={[{
                  title: 'Вперед!',
                  type: 'secondary',
                  action: () => {
                    this.setActiveModal(null);
                  }
          }]}
        >

        </ModalCard>
        <ModalCard
          id='send'
          onClose={() => this.setActiveModal(null)}
          icon={<Icon56MoneyTransferOutline />}
          header="Отправляйте монетки друзьям"
          actions={[{
            title: 'Отправить',
            mode: 'secondary',
            action: () => {
              this.sendMoney();
            }
          }]}
        >
          <Input maxLength="5" onChange={(e) => this.onChange(e)} placeholder="Введите id модератора" name="money_transfer_send" value={this.state.money_transfer_send}/>
          <br/>
          <Input maxLength="5" name="money_transfer_count" onChange={(e) => this.onChange(e)} placeholder="Введите кол-во монеток" value={this.state.money_transfer_count} />
          <br/>
          <Input maxLength="100" name="money_transfer_comment" onChange={(e) => this.onChange(e)} placeholder="Введите комментарий к переводу" value={this.state.money_transfer_comment} />
          
        </ModalCard>
        <ModalCard
          id='ban_user'
          onClose={() => this.setActiveModal(null)}
          icon={<Avatar src={"https://api.xelene.me" + this.state.other_profile['avatar']['url']} size={72} />}
          header="Забанить пользователя"
          actions={[{
            title: 'Забанить! 🤬',
            mode: 'secondary',
            action: () => {
              this.userBan(this.state.other_profile['id'], this.state.ban_reason);
            }
          }]}
        >
          <Input disabled value={this.state.other_profile['id']}/>
          <br/>
          <Input maxLength="100" name="ban_reason" onChange={(e) => this.onChange(e)} placeholder="Введите причину бана" value={this.state.ban_reason} />
          
        </ModalCard>
        <ModalCard
          id='moneys'
          onClose={() => this.setActiveModal(null)}
          icon={<Avatar src={this.state.moneys.avatar} size={72} />}
          header={"Ваш баланс: " + this.state.moneys.money}
          caption={this.state.moneys.text}
          actions={[{
            title: 'Закрыть',
            mode: 'secondary',
            action: () => {
              this.setActiveModal(null);
            }
          }]}
        >
        </ModalCard>
        <ModalCard
          id='transfer'
          onClose={() => this.setActiveModal(null)}
          icon={<Avatar src={this.state.transfer.avatar} size={72} />}
          header='Перевод монеток'
          caption={this.state.transfer.comment}
          actions={[{
            title: 'Закрыть',
            mode: 'secondary',
            action: () => {
              this.setActiveModal(null);
            }
          }]}
        >
        </ModalCard>

          </ModalRoot>
        )
        return(
            <ConfigProvider isWebView={true} scheme={this.state.scheme}> 
            <Epic activeStory={this.state.activeStory}
            tabbar={
                this.state.activePanel !== "tiket" &&
                this.state.activePanel !== "new_tiket" &&
                this.state.activePanel !== "other_profile" &&
                this.state.activePanel !== "money" &&
                <Tabbar>
                  <TabbarItem
                    onClick={this.onStoryChange}
                    selected={this.state.activeStory === 'questions'}
                    data-story="questions"
                  ><Icon28ArticleOutline/></TabbarItem>
                  <TabbarItem
                    onClick={this.onStoryChange}
                    selected={this.state.activeStory === 'top'}
                    data-story="top"
                  ><Icon28FavoriteOutline/></TabbarItem>
                  <TabbarItem
                    onClick={this.onStoryChange}
                    selected={this.state.activeStory === 'notif'}
                    data-story="notif"
                  ><Icon28Notification /></TabbarItem>
                  <TabbarItem
                    onClick={this.onStoryChange}
                    selected={this.state.activeStory === 'profile'}
                    data-story="profile"
                  ><Icon28Profile /></TabbarItem>
                </Tabbar>
              }>
            <View 
            activePanel={this.state.activePanel} 
            history={this.state.history} 
            onSwipeBack={this.goBack}
            id="questions"
            modal={modal}
            popout={this.state.popout}
            >
                <Home id="questions" this={this}/>
                <New_Tiket id="new_tiket" this={this}/>
                <Tiket id="tiket" this={this}/>
                <Profile id="profile" this={this}/>
                <Other_Profile id="other_profile" this={this}/>
            </View>
            <View 
            activePanel={this.state.activePanel} 
            history={this.state.history} 
            onSwipeBack={this.goBack}
            id="top"
            modal={modal}
            popout={this.state.popout}
            >
                <Top id="top" this={this}/>
                <Other_Profile id="other_profile" this={this}/>
            </View>
            <View 
            activePanel={this.state.activePanel} 
            history={this.state.history} 
            onSwipeBack={this.goBack}
            id="profile"
            popout={this.state.popout}
            modal={modal}
            >
                <Profile id="profile" this={this}/>
                <Profile_Help id="profile_help" this={this}/>
                <Qu id='qu' this={this}/>
                <Tiket id="tiket" this={this}/>
                <Other_Profile id="other_profile" this={this}/>
                <Money id="money" this={this}/>
                <New_Tiket id="new_tiket" this={this}/>
                <Vitas id="vitas" this={this}/>
                <Achives id="achives" this={this}/>
            </View>
            <View 
            activePanel={this.state.activePanel} 
            history={this.state.history} 
            onSwipeBack={this.goBack}
            id="notif"
            popout={this.state.popout}
            modal={modal}
            >
                <Notif id="notif" this={this}/>
                <Tiket id="tiket" this={this}/>
                <Other_Profile id="other_profile" this={this}/>
            </View>
            </Epic>
            </ConfigProvider>
        );
    }
}

export default App;