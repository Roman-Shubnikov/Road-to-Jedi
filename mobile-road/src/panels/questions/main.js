import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Button,
  Group,
  Alert,
  Avatar,
  Placeholder,
  Separator,
  PullToRefresh,
  PanelSpinner,
  InfoRow,
  Header,
  Counter,
  SimpleCell,
  PromoBanner,
  FixedLayout,
  Cell,
  Div,
  HorizontalScroll,
  View,
  Switch,
  ScreenSpinner,
  ActionSheet,
  ActionSheetItem,
  Snackbar,
  ModalRoot,
  ModalCard,
  ModalPage,
  ModalPageHeader,
  Tabbar,
  TabbarItem,
  Epic,
  Input,
  FormLayout,
  List,
  Slider,
  ConfigProvider,
  platform
  } from '@vkontakte/vkui';

import eruda from 'eruda';
import '@vkontakte/vkui/dist/vkui.css';
import '../../style.css'
// Импортируем панели
import NewTicket from './panels/new_tiket'
import Questions from './panels/questions'
import Tiket from '../../components/tiket';
import Other_Profile from '../../components/other_profile'

import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon28Notification from '@vkontakte/icons/dist/28/notifications';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon24Qr from '@vkontakte/icons/dist/24/qr';
import Icon28MessagesOutline from '@vkontakte/icons/dist/28/messages_outline';
import Icon24Linked from '@vkontakte/icons/dist/24/linked';
import Icon56FireOutline from '@vkontakte/icons/dist/56/fire_outline';
import Icon56MoneyTransferOutline from '@vkontakte/icons/dist/56/money_transfer_outline'
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';
import Icon20PlaceOutline from '@vkontakte/icons/dist/20/place_outline';
import Icon24BrushOutline from '@vkontakte/icons/dist/24/brush_outline';
import Icon20Stars from '@vkontakte/icons/dist/20/stars';
import Icon28CoinsOutline from '@vkontakte/icons/dist/28/coins_outline';
import Icon28BillheadOutline from '@vkontakte/icons/dist/28/billhead_outline';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';

const queryString = require('query-string');
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const parsedHash = queryString.parse(window.location.search.replace('?', ''));
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

        

        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.setPopout = (value) => {
          this.setState({popout: value})
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
              if(history[history.length - 1] === 'ticket'){
                this.changeData('need_epic', false)
              } else{
                this.changeData('need_epic', true)
              }
          }
      }
        this.goPanel = (panel) => {
          this.setState({history: [...this.state.history, panel], activePanel: panel})
          if(panel === 'ticket'){
            this.changeData('need_epic', false)
          } else{
            this.changeData('need_epic', true)
          }
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
          this.closePopout = () => {
            this.setState({ popout: null });
          }
          this.showAlert = (title, text) => {
            this.setState({
              popout: 
                <Alert
                  actions={[{
                    title: 'Закрыть',
                    autoclose: true,
                    mode: 'cancel'
                  }]}
                  onClose={this.closePopout}
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
                  onClose={() => this.closePopout}
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
        if(this.props.ticket_id !== undefined){
          this.goTiket(this.props.ticket_id)
          if(window.history.pushState) {
            window.history.pushState('', '/', window.location.pathname + window.location.search)
        } else {
            window.location.hash = '';
        }
        }
        if(this.props.agent_id !== undefined) {
          this.goOtherProfile(this.props.agent_id);
          if(window.history.pushState) {
            window.history.pushState('', '/', window.location.pathname + window.location.search)
        } else {
            window.location.hash = '';
        }
        }
      
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
              <img className="AvaModalPage" src={this.props.account.id !== undefined ? this.props.account.avatar.url : null} size={70} />
              <Header
              subtitle='Помните, отвечать нужно вдумчиво.'>Вам присвоен номер #{this.props.account.id !== undefined ? this.props.account.id : "undefined"}</Header>
              <FormLayout>
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
                <Div>
                  <SimpleCell disabled
                  before={<Icon28CoinsOutline />}>
                    Зарабатывай монеты
                  </SimpleCell>
                  <SimpleCell disabled
                  before={<Icon28BillheadOutline />}>
                    Отвечай на вопросы
                  </SimpleCell>
                  <SimpleCell disabled
                  before={<Icon28FavoriteOutline />}>
                    Участвуй в рейтинге
                  </SimpleCell>
                  <SimpleCell disabled
                  before={<Icon28FireOutline />}>
                    Получай отметку огня
                  </SimpleCell>
                </Div>
                <Div>
                  <Button 
                  mode="secondary" 
                  size='xl'
                  stretched
                  onClick={() => {
                    this.playAudio()
                    
                    this.ChangeAge(this.state.AgeUser);
                    this.setActiveModal(null);
                  }}>Вперёд!</Button>
                </Div>
                
                <Cell></Cell>
            </ModalPage>
              <ModalPage
                id="settings"
                onClose={this.modalBack}
                header={
                  <ModalPageHeader
                  right={<Header onClick={this.modalBack}><Icon24Dismiss style={{color: 'var(--placeholder_icon_foreground_primary)'}} /></Header>}
                  >
                    Настройки
                  </ModalPageHeader>
                }
                >
                  <Div style={{display:'flex'}}>
                    <Button onClick={() => {
                      this.setActiveModal(null);
                      this.getRandomTiket();

                    }} 
                    stretched 
                    size='l'
                    // style={{marginRight: '2%'}}
                    before={<Icon20PlaceOutline />}>Случайный тикет</Button>
                    <Button onClick={() => {
                      this.setActiveModal(null);
                      this.props.this.changeData('scheme',(this.props.this.state.scheme === 'bright_light') ? 'space_gray' : 'bright_light')
                    }}
                    stretched 
                    size='l'
                    style={{marginLeft: '5%'}}
                    before={<Icon20Stars />}>Сменить тему</Button>
                  </Div>
                </ModalPage>
              <ModalCard
                id={'prom'}
                onClose={() => this.setActiveModal(null)}
                icon={<Icon56FireOutline style={{color: "var(--dynamic_red)"}} width={72} height={72} />}
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
            >
              <Questions id='questions' this={this} account={this.props.account} />
              <NewTicket id='new_ticket' this={this} account={this.props.account} /> 
              <Tiket id="ticket" this={this} ticket_id={this.state.ticket_id} account={this.props.account} />
              <Other_Profile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
            </View>   
        )
    }
}