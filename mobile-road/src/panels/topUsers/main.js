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
import '../../style.css';
// Импортируем панели
import Top from './panels/top';
import OtherProfile from '../../components/other_profile';

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut'


// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


// const queryString = require('query-string');
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
// const hash = queryString.parse(window.location.hash);

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'top',
            activeModal: null,
            modalHistory: [],
            popout: this.props.popout,
            ticket_id: null,
            history: ['top'],
            active_other_profile: 0,
            other_profile: null,
            ban_reason: "",
            comment: '',
            transfer: {
              'avatar': '',
              'comment': ''
            },
            AgeUser: 0,
            top_agents: null,

        

        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.getTopUsers = () => {
          fetch(this.state.api_url + "method=users.getTop&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.setState({top_agents: data.response});
              this.setPopout(null);
            }
          })
          .catch(err => {
            this.showErrorAlert(err)

          })
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
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };
        this.goBack = () => {
          const history = this.state.history;
          this.setActiveModal(null);
          if(history.length === 1) {
              bridge.send("VKWebAppClose", {"status": "success"});
          } else if (history.length > 1) {
              history.pop()
              this.setState({activePanel: history[history.length - 1]})
              // if(history[history.length - 1] === 'ticket'){
              //   this.changeData('need_epic', false)
              // } else{
              //   this.changeData('need_epic', true)
              // }
          }
      }
        this.goPanel = (panel) => {
          let history = this.state.history.slice();
          history.push(panel)
          window.history.pushState( { panel: panel }, panel );
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
          this.showErrorAlert = (error=null) => {
            this.setPopout(
              <Alert
                  actions={[{
                  title: 'Отмена',
                  autoclose: true,
                  mode: 'cancel'
                  }]}
                  onClose={() => this.setPopout(null)}
              >
                <h2>Ошибка</h2>
                {error ? <p>{error}</p> : <p>Что-то пошло не так, попробуйте снова!</p>}
              </Alert>
          )
        }
    }
    ChangeAge(age) {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url + "method=account.setAge&age=" + age + "&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if(data.result) {
          this.setState({popout: null})
          // setTimeout(() => {
          //   this.playAudio()
          // }, 5000)
          
        }
      })
      .catch(err => {
        this.showErrorAlert()
      })
    }
    userBan(user_id, text) {
      this.setPopout(<ScreenSpinner/>)
      fetch(this.state.api_url + "method=account.ban&agent_id=" + user_id + "&banned=true&reason=" + text + "&" + window.location.search.replace('?', ''))
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
        this.showErrorAlert(err)
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
          this.showErrorAlert(err)

        })
    }
    
    componentDidMount(){
      window.addEventListener('popstate', this.handlePopstate); 
      this.getTopUsers()
    }
    componentWillUnmount(){
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
            </ModalRoot>
        )
        return(
            <View 
            id={this.props.id}
            activePanel={this.state.activePanel}
            modal={modal}
            popout={this.state.popout}
            onSwipeBack={this.goBack}
            >
              <Top id="top" this={this} account={this.props.account} top_agents={this.state.top_agents} />
              <OtherProfile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
            </View>   
        )
    }
}