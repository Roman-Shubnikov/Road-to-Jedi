import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
  Alert,
  Avatar,
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,
  Input,

  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import '../../style.css'
// Импортируем панели
import Notif from './panels/notif';
import Tiket from '../../components/tiket';
import OtherProfile from '../../components/other_profile'

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut'
import ModalComment from '../../Modals/Comment';



// const queryString = require('query-string');
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
// const hash = queryString.parse(window.location.hash);
var ignore_back = false;

export default class Notify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'notif',
            activeModal: null,
            modalHistory: [],
            popout: this.props.popout,
            ticket_id: null,
            history: ['notif'],
            active_other_profile: 0,
            other_profile: null,
            ban_reason: "",
            comment: "",
            transfer: {
              'avatar': '',
              'comment': ''
            },
        

        }
        this.changeData = this.props.this.changeData;
        this.ReloadProfile = this.props.reloadProfile;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.setPopout = (value) => {
          this.setState({popout: value})
        }
        this.handlePopstate = (e) => {
          e.preventDefault();
          this.goBack()
        }
        this.goTiket = (id) => {
          this.setPopout(<ScreenSpinner/>)
          this.setState({ticket_id: id})
          this.goPanel('ticket');
          this.setPopout(null);
        }
        this.onChange = (event) => {
          var name = event.currentTarget.name;
          var value = event.currentTarget.value;
          this.setState({ [name]: value });
      }
        this.goOtherProfile = (id) => {
          this.setState({active_other_profile: id})
          this.goPanel("other_profile")
        }
        this.openMoneyTransfer = (avatar, text, comment) => {
          this.setState({transfer: {
            avatar: avatar,
            text: text,
            comment: comment ? comment : 'Агент не оставил комментария 😢'
          }})
          this.setActiveModal('transfer')
        }
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };
        this.goBack = () => {
          if(!ignore_back){
            ignore_back = true;
            const history = this.state.history;
            if(history.length === 1) {
              this.props.this.changeData("activeStory", 'profile')
            } else if (history.length > 1) {
                history.pop()
                if(this.state.activePanel === 'notif') {
                  bridge.send('VKWebAppDisableSwipeBack');
                }
                this.setState({activePanel: history[history.length - 1]})
                // if(history[history.length - 1] === 'ticket'){
                //   this.changeData('need_epic', false)
                // } else{
                //   this.changeData('need_epic', true)
                // }
                this.setPopout(<ScreenSpinner />)
                setTimeout(() => {
                  this.setPopout(null)
                }, 500)
            }
            setTimeout(() => {ignore_back = false;}, 500)
            
          }else{
            const history = this.state.history;
            window.history.pushState( { panel: history[history.length - 1] }, history[history.length - 1] );
          }
      }
        this.goPanel = (panel) => {
          let history = this.state.history.slice();
          history.push(panel)
          window.history.pushState( { panel: panel }, panel );
          if(panel === 'notif') {
            bridge.send('VKWebAppEnableSwipeBack');
          }
          this.setState({history: history, activePanel: panel})
          // if(panel === 'ticket'){
          //   this.changeData('need_epic', false)
          // } else{
          //   this.changeData('need_epic', true)
          // }
        }
        this.setActiveModal = (activeModal) => {
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
              activeModal: activeModal,
              modalHistory: modalHistory
            });
          };
          this.showAlert = (title, text) => {
            this.setState({
              popout: 
                <Alert
                  actions={[{
                    title: 'Закрыть',
                    autoclose: true,
                    mode: 'cancel'
                  }]}
                  onClose={() => this.setPopout(null)}
                >
                  <h2>{title}</h2>
                  <p>{text}</p>
              </Alert>
            })
          }
          this.showErrorAlert = (error=null, action=null) => {
            this.setPopout(
              <Alert
                  actions={[{
                  title: 'Отмена',
                  autoclose: true,
                  mode: 'cancel',
                  action: action,
                  }]}
                  onClose={() => this.setPopout(null)}
              >
                <h2>Ошибка</h2>
                {error ? <p>{error}</p> : <p>Что-то пошло не так, попробуйте снова!</p>}
              </Alert>
          )
        }
    }
    userBan(user_id, text) {
      this.setPopout(<ScreenSpinner/>)
      fetch(this.state.api_url + "method=account.ban&" + window.location.search.replace('?', ''),
      {method: 'post',
      headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
      body: JSON.stringify({
        'agent_id': user_id,
        'banned': true,
        'reason': text,

    })
      })
      .then(res => res.json())
      .then(data => {
        if(data.result) {
          this.setActiveModal(null);
          this.showAlert('Успех', 'Пользователь забанен');
          this.setPopout(null);
        }else {
          this.showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        this.changeData('activeStory', 'disconnect')
      })
    }
    componentDidMount(){
      bridge.send('VKWebAppEnableSwipeBack');
      window.addEventListener('popstate', this.handlePopstate); 
    }
    componentWillUnmount(){
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', this.handlePopstate)
    }
    render() {
        const modal = (
            <ModalRoot
            activeModal={this.state.activeModal}
            >
              <ModalPrometay
              id='prom'
              onClose={() => this.setActiveModal(null)}
              action={() => this.setActiveModal(null)} />

              <ModalDonut
              id='donut'
              onClose={() => this.setActiveModal(null)}
              action={() => this.setActiveModal(null)} />
              <ModalCard
                id='ban_user'
                onClose={() => this.setActiveModal(null)}
                icon={<Avatar src={this.state.other_profile ? this.state.other_profile['avatar']['url'] : null} size={72} />}
                header="Забанить пользователя"
                actions={[{
                  title: 'Забанить! 🤬',
                  mode: 'secondary',
                  action: () => {
                    this.userBan(this.state.other_profile ? this.state.other_profile['id'] : 0, this.state.ban_reason);
                    console.log(this.state.other_profile['id'])
                  }
                }]}
              >
                <Input disabled value={this.state.other_profile ? (this.state.other_profile['id'] < 0) ? -this.state.other_profile['id'] : this.state.other_profile['id'] : null}/>
                <br/>
                <Input maxLength="100" name="ban_reason" onChange={(e) => this.onChange(e)} placeholder="Введите причину бана" value={this.state.ban_reason} />
                
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
              <ModalComment
                id='comment'
                onClose={this.modalBack}
                comment={this.state.comment} />
            </ModalRoot>
        )
        return(
            <View 
            id={this.props.id}
            activePanel={this.state.activePanel}
            modal={modal}
            popout={this.state.popout}
            history={this.state.history}
            onSwipeBack={() => window.history.back()}
            >
              <Notif id="notif" this={this}/>
              <Tiket id="ticket" this={this} ticket_id={this.state.ticket_id} account={this.props.account} />
              <OtherProfile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
            </View>   
        )
    }
}