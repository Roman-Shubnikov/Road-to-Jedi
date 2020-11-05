import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  Button,
  Group,
  Alert,
  Avatar,
  Separator,
  Header,
  SimpleCell,
  Div,
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,
  ModalPage,
  ModalPageHeader,
  Input,
  FormLayout,
  FormStatus,
  Slider,
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

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon28CoinsOutline from '@vkontakte/icons/dist/28/coins_outline';
import Icon28BillheadOutline from '@vkontakte/icons/dist/28/billhead_outline';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';

const queryString = require('query-string');
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);

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


        

        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        this.ReloadProfile = this.props.reloadProfile;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.getQuestions = (need_offset=false) => {
          let url = need_offset ? "method=tickets.get&count=20&unanswered=1&offset=" + this.state.offset : "method=tickets.get&count=20&unanswered=1";
          if(!need_offset){
              this.setState({ offset: 20})
          }
          fetch(this.state.api_url + url + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.setState({tiket_all: []})
              if(this.state.tiket_all){
                  var sliyan = data.response ? this.state.tiket_all.concat(data.response) : this.state.tiket_all;
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
        this.showErrorAlert(err)
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
        if(hash.ticket_id !== undefined){
          this.goTiket(hash.ticket_id)
          bridge.send("VKWebAppSetLocation", {"location": ""});
        }
        if(hash.agent_id !== undefined) {
          this.goOtherProfile(hash.agent_id);
          bridge.send("VKWebAppSetLocation", {"location": ""});
        //   if(window.history.pushState) {
        //     window.history.pushState('', '/', window.location.pathname + window.location.search)
        // } else {
        //     window.location.hash = '';
        // }
        }
        this.getQuestions()
      
    }
    componentWillUnmount(){
      window.removeEventListener('popstate', this.handlePopstate)
    }
    render() {
        const modal = (
            <ModalRoot
            activeModal={this.state.activeModal}
            ><ModalPage
            id="start"
            onClose={this.modalBack}
            dynamicContentHeight
            header={
              <ModalPageHeader>
                Добро пожаловать в игру
              </ModalPageHeader>
            }>
              <Div style={{marginTop: 0}}>
                <img className="AvaModalPage" 
                src={this.props.account.id !== undefined ? this.props.account.avatar.url : null} 
                size={70}
                alt='твоя ава' />
                  <Header
                  subtitle='Помните, отвечать нужно вдумчиво.'>Вам присвоен номер #{this.props.account.id !== undefined ? this.props.account.id : "undefined"}</Header>
                <Separator />
                <FormLayout>
                  <FormStatus header="Внимание! Важная информация" mode="error">
                    Сервис не имеет отношения к Администрации Вконтакте, а так же их разработкам.
                  </FormStatus>
                    <Slider
                      min={10}
                      max={100}
                      step={1}
                      value={this.state.AgeUser}
                      onChange={e => {
                        this.setState({AgeUser: e});
                      }}
                      top={`Укажите свой возраст: ${this.state.AgeUser}`}
                    />
                  </FormLayout>
                  <Group>
                    <SimpleCell disabled multiline
                    before={<Icon28CoinsOutline />}>
                      Зарабатывай монеты
                    </SimpleCell>
                    <SimpleCell disabled multiline
                    before={<Icon28BillheadOutline />}>
                      Отвечай на вопросы
                    </SimpleCell>
                    <SimpleCell disabled multiline
                    before={<Icon28FavoriteOutline />}>
                      Участвуй в рейтинге
                    </SimpleCell>
                    <SimpleCell disabled multiline
                    before={<Icon28FireOutline />}>
                      Получай отметку огня
                    </SimpleCell>
                  </Group>
                  
                  <Div>
                    <Button 
                    mode="secondary" 
                    size='xl'
                    stretched
                    onClick={() => {
                      // this.playAudio()
                      
                      this.ChangeAge(this.state.AgeUser);
                      this.setActiveModal(null);
                      setTimeout(() => {
                        this.ReloadProfile();
                      },2000);
                    }}>Вперёд!</Button>
                  </Div>
                </Div>
            </ModalPage>
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
              <Questions id='questions' this={this} account={this.props.account} tiket_all={this.state.tiket_all} tiket_all_helper={this.state.tiket_all_helper} />
              <NewTicket id='new_ticket' this={this} account={this.props.account} /> 
              <Tiket id="ticket" this={this} ticket_id={this.state.ticket_id} account={this.props.account} />
              <OtherProfile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
            </View>  
        )
    }
}