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
import NewTicket from './panels/new_tiket'
import Questions from './panels/questions'
import Tiket from '../../components/tiket';
import OtherProfile from '../../components/other_profile'

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut'
import ModalComment from '../../Modals/Comment';


const queryString = require('query-string');
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);
var ignore_hash = false;
var ignore_back = false;


export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'questions',
            activeModal: null,
            modalHistory: [],
            popout: this.props.popout,
            ticket_id: null,
            history: ['questions'],
            active_other_profile: 0,
            other_profile: null,
            ban_reason: "",
            comment: '',
            transfer: {
              'avatar': '',
              'comment': ''
            },
            AgeUser: 0,
            offset: 0,
            tiket_all: null,
            tiket_all_helper: null,
            snackbar: null,


        

        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        this.ReloadProfile = this.props.reloadProfile;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.getQuestions = (need_offset=false) => {
          let offset = need_offset ? this.state.need_offset : 0;
          if(!need_offset){
              this.setState({ offset: 20})
          }
          fetch(this.state.api_url + "method=tickets.get&" + window.location.search.replace('?', ''), 
          {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
              // signal: controllertime.signal,
          body: JSON.stringify({
            'count': 20,
            'unanswered': 1,
            'offset': offset,
          })
        })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              // this.setState({tiket_all: []})
              var sliyan = [];
              if(this.state.tiket_all !== null){
                let tickets = this.state.tiket_all.slice();
                if(!need_offset){
                  sliyan = data.response;
                }else{
                  sliyan = data.response ? tickets.concat(data.response) : this.state.tiket_all;
                }
              }else{
                sliyan = data.response

              }
              
              this.setState({tiket_all: sliyan, tiket_all_helper: data.response})
              if(need_offset){
                  this.setState({ offset: this.state.offset + 20 })
              }
            }else{
              this.showErrorAlert(data.error.message)
          }
          })
          .catch(err => {
            this.changeData('activeStory', 'disconnect')
          })
        }
        this.setPopout = (value) => {
          this.setState({popout: value})
          if(value && value.type.name === 'ScreenSpinner'){
            ignore_back = true;
          }else{
            ignore_back = false;
          }
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
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };
        this.goBack = () => {
          // this.setPopout(<ScreenSpinner />)
          if(!ignore_back){
            ignore_back = true;
            const history = this.state.history;
            this.setActiveModal(null);
            if(history.length === 1) {
                bridge.send("VKWebAppClose", {"status": "success"});
            } else if (history.length > 1) {
                history.pop()
                if(this.state.activePanel === 'questions') {
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
          if(panel === 'questions') {
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
    getRandomTiket() {
      fetch(this.state.api_url + "method=ticket.getRandom&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            this.goTiket(data.response.id)
          } else {
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
      this.changeData('need_epic', true)
      if(!ignore_hash){
        if(hash.ticket_id !== undefined){
          this.goTiket(hash.ticket_id)
          // bridge.send("VKWebAppSetLocation", {"location": ""});
        }
        if(hash.agent_id !== undefined) {
          this.goOtherProfile(hash.agent_id);
          // bridge.send("VKWebAppSetLocation", {"location": ""});
      }
        
        //   if(window.history.pushState) {
        //     window.history.pushState('', '/', window.location.pathname + window.location.search)
        // } else {
        //     window.location.hash = '';
        // }
        ignore_hash = true;
        }
        this.getQuestions()
      
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
            history={this.state.history}
            onSwipeBack={() => window.history.back()}
            popout={this.state.popout}
            >
              <Questions id='questions' 
              this={this} 
              account={this.props.account} 
              tiket_all={this.state.tiket_all} 
              first_start={this.props.first_start}
              tiket_all_helper={this.state.tiket_all_helper} />
              <NewTicket id='new_ticket' this={this} account={this.props.account} /> 
              <Tiket id="ticket" this={this} ticket_id={this.state.ticket_id} account={this.props.account} snackbar={this.state.snackbar} />
              <OtherProfile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
            </View>  
        )
    }
}