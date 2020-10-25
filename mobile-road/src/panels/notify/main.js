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
import Notif from './panels/notif';
import Tiket from './panels/tiket';
import Other_Profile from '../other_profile'

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

export default class Notify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'notif',
            activeModal: null,
            modalHistory: [],
            popout: null,
            tiket_info: null,
            history: ['notif'],
            transfer: {
              'avatar': '',
              'comment': ''
            },

        }
        this.copy = this.props.this.copy;
        this.Admin = (id, author_id, text, comment, mark = -1) => {
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
        this.setPopout = (value) => {
          this.setState({popout: value})
        }
        this.goTiket = (id) => {
          this.setPopout(<ScreenSpinner/>)
          fetch(this.state.api_url + "method=ticket.getById&ticket_id=" + id + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.setState({tiket_info: data.response.info,
                  tiket_message: data.response.messages, });
                  this.goPanel('tiket');
                  this.setPopout(null);
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
              console.log(err)
              this.showErrorAlert()
    
            })
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
          const history = this.state.history;
          console.log(history.length)
          if(history.length === 1) {
              bridge.send("VKWebAppClose", {"status": "success"});
          } else if (history.length > 1) {
              history.pop()
              this.setState({activePanel: history[history.length - 1]})
          }
      }
        this.goPanel = (panel) => {
          this.setState({history: [...this.state.history, panel], activePanel: panel})
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
          this.showErrorAlert = () => {
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
    }
    render() {
        const modal = (
            <ModalRoot
            activeModal={this.state.activeModal}
            >
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
            >
              <Notif id="notif" this={this}/>
              <Tiket id="tiket" this={this}/>
              <Other_Profile id="other_profile" this={this}/>
            </View>   
        )
    }
}