import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import vkQr from '@vkontakte/vk-qr';


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
import '../../style.css';
// Импортируем панели
import Prof from './panels/profile';
import Market from './panels/market';
import Achievements from './panels/achives';
import MYQuest from './panels/AllQuestions';
import Settings from './panels/settings';
import SchemeChange from './panels/schemechange';
import Info from './panels/info'
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
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'profile',
            activeModal: null,
            modalHistory: [],
            popout: this.props.popout,
            ticket_id: null,
            history: ['profile'],
            active_other_profile: 0,
            other_profile: null,
            ban_reason: "",
            comment: '',
            transfer: {
              'avatar': '',
              'comment': ''
            },
            moneys: null,
            money_transfer_send: null,
            money_transfer_count: null,
            AgeUser: 0,
            snackbar: null,
            active_other_profile:0,
            ticket_id: 0,
        

        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        this.ReloadProfile = this.props.reloadProfile;
        this.ChangeData = this.props.this.changeData;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.setPopout = (value) => {
          this.setState({popout: value})
        }
        this.setSnack = (value) => {
          this.setState({snackbar: value})
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
    sendMoney() {
      fetch(this.state.api_url + 'method=transfers.send&summa=' +  this.state.money_transfer_count + '&send_to=' + this.state.money_transfer_send + "&" + window.location.search.replace('?', ''))
      .then(data => data.json())
      .then(data => {
        if(data.result) {
          this.setState({moneys: data.response})
          this.setActiveModal("moneys")
        } else {
          this.showErrorAlert(data.error.message)
        }
      })
    }
    render() {
        const modal = (
            <ModalRoot
            activeModal={this.state.activeModal}
            >
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
                icon={<Icon56FireOutline style={{color: "var(--prom_icon)"}} width={72} height={72} />}
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
                  }
                }]}
              >
                <Input disabled value={this.state.other_profile ? (this.state.other_profile['id'] < 0) ? -this.state.other_profile['id'] : this.state.other_profile['id'] : null}/>
                <br/>
                <Input maxLength="100" name="ban_reason" onChange={(e) => this.onChange(e)} placeholder="Введите причину бана" value={this.state.ban_reason} />
                
              </ModalCard>
              <ModalCard
                id='send'
                onClose={() => this.setActiveModal(null)}
                icon={<Icon56MoneyTransferOutline />}
                header="Отправляйте монетки друзьям"
                actions={[{
                  title: 'Отправить',
                  mode: 'secondary',
                  disabled: true,
                  action: () => {
                    this.sendMoney();
                  }
                }]}
              >
                <Input maxLength="5" onChange={(e) => this.onChange(e)} placeholder="Введите id агента" name="money_transfer_send" value={this.state.money_transfer_send}/>
                <br/>
                <Input maxLength="5" name="money_transfer_count" onChange={(e) => this.onChange(e)} placeholder="Введите кол-во монеток" value={this.state.money_transfer_count} />
                {/* <br/>
                <Input maxLength="100" name="money_transfer_comment" onChange={(e) => this.onChange(e)} placeholder="Введите комментарий к переводу" value={this.state.money_transfer_comment} /> */}
                
              </ModalCard>
              <ModalCard
                id='moneys'
                onClose={() => this.setActiveModal(null)}
                icon={<Avatar src={this.state.moneys ? this.state.moneys.avatar : null} size={72} />}
                header={this.state.moneys ? "Ваш баланс: " + this.state.moneys.money : null}
                caption={this.state.moneys ? this.state.moneys.text : null}
                actions={[{
                  title: 'Закрыть',
                  mode: 'secondary',
                  action: () => {
                    this.setActiveModal(null);
                    this.setState({moneys: null, money_transfer_count: null, money_transfer_send: null})
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
                    <Cell onClick={() => {bridge.send("VKWebAppShare", {"link": "https://vk.com/app7409818#agent_id=" + this.props.account['id']}); this.setActiveModal(null)}} before={<Icon28MessagesOutline width={28} height={28}/>}>В сообщения</Cell>
                    <Cell onClick={() => {bridge.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#agent_id=" + this.props.account['id']}); this.setActiveModal(null)}} before={<Icon24Linked width={28} height={28}/>}>Скопировать ссылку</Cell>
                  </List>
                </ModalPage>
                <ModalPage
                id="qr"
                onClose={this.modalBack}
                header={
                  <ModalPageHeader
                  right={<Header onClick={this.modalBack}><Icon24Dismiss style={{color: 'var(--placeholder_icon_foreground_primary)'}} /></Header>}
                  >
                    QR
                  </ModalPageHeader>
                }
                >
                 {<div className="qr" dangerouslySetInnerHTML={{__html: qr(this.props.account['id'], this.props.this.state.scheme)}}/>}
                 <br/>
                 <div className="qr">Отсканируйте камерой ВКонтакте!</div>
                 <br/>
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

              <Prof id="profile" this={this} account={this.props.account} />
              <MYQuest id="qu" this={this} account={this.props.account} /> 
              <Market id="market" this={this} account={this.props.account} />
              <Achievements id="achievements" this={this} account={this.props.account} />
              <Settings id="settings" this={this} account={this.props.account} />
              <SchemeChange id="schemechange" this={this} account={this.props.account} />
              <Info id='info' this={this} />
              <Tiket id="ticket" this={this} ticket_id={this.state.ticket_id} account={this.props.account} />
              <Other_Profile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
            </View>   
        )
    }
}