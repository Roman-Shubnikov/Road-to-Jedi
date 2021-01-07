import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
  Alert,
  Avatar,
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,
  Button

  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Notif from './panels/notif';
import Tiket from '../../components/tiket';
import OtherProfile from '../../components/other_profile'
import Reports from '../../components/report';

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut';
import ModalVerif from '../../Modals/Verif';
import ModalComment from '../../Modals/Comment';
import ModalBan from '../../Modals/Ban';



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
        this.setReport = (typeres, id_rep) => {
          this.setState({typeres, id_rep})
          this.goPanel("report")
        }
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
                actionsLayout="horizontal"
                  actions={[{
                    title: 'Закрыть',
                    autoclose: true,
                    mode: 'cancel'
                  }]}
                  onClose={() => this.setPopout(null)}
                  header={title}
                  text={text}
                />
            })
          }
          this.showErrorAlert = (error = null, action = null) => {
            this.setPopout(
              <Alert
                actionsLayout="horizontal"
                actions={[{
                  title: 'Отмена',
                  autoclose: true,
                  mode: 'cancel',
                  action: action,
                }]}
                onClose={() => this.setPopout(null)}
                header="Ошибка"
                text={error ? `${error}` : "Что-то пошло не так, попробуйте снова!"}
              />
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

              <ModalVerif
              id='verif'
              onClose={() => this.setActiveModal(null)}
              action={() => this.setActiveModal(null)} />
              
              <ModalBan 
              id='ban_user'
              onClose={() => this.setActiveModal(null)}
              other_profile={this.state.other_profile}
              this={this}
              />

              <ModalComment
                id='comment'
                onClose={this.modalBack}
                comment={this.state.comment}
                reporting={this.setReport} />
              
              <ModalCard
                id='transfer'
                onClose={() => this.setActiveModal(null)}
                icon={<Avatar src={this.state.transfer.avatar} size={72} />}
                header='Перевод монеток'
                subheader={this.state.transfer.comment}
                actions={
                <Button mode='secondary' stretched size='l' onClick={() => this.setActiveModal(null)}>Закрыть</Button>
              }
              />
              
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
              <Reports id="report" this={this} id_rep={this.state.id_rep} typeres={this.state.typeres} />
            </View>   
        )
    }
}