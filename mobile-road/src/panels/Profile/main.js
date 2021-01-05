import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import vkQr from '@vkontakte/vk-qr';
// import {svg2png} from 'svg-png-converter'

import {
  Alert,
  Avatar,
  Header,
  Cell,
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Input,
  List,
  Snackbar,
  ANDROID,
  IOS,
  withPlatform,
  FormLayout,
  Button,
  FormItem,
} from '@vkontakte/vkui';

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
import Verfy from './panels/verfy'
import Promocodes from './panels/promocode';
import NewTicket from './panels/new_tiket'
import Tiket from '../../components/tiket';
import OtherProfile from '../../components/other_profile'
import Reports from '../../components/report';

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut'
import ModalComment from '../../Modals/Comment';
import ModalBan from '../../Modals/Ban';
import ModalVerif from '../../Modals/Verif';

import Icon24Dismiss from '@vkontakte/icons/dist/24/dismiss';
import Icon24Qr from '@vkontakte/icons/dist/24/qr';
// import Icon28MessagesOutline      from '@vkontakte/icons/dist/28/messages_outline';
import Icon24Linked from '@vkontakte/icons/dist/24/linked';
import Icon56MoneyTransferOutline from '@vkontakte/icons/dist/56/money_transfer_outline'
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon28NewsfeedOutline from '@vkontakte/icons/dist/28/newsfeed_outline';
import Icon28StoryAddOutline from '@vkontakte/icons/dist/28/story_add_outline';
import Icon28SortOutline          from '@vkontakte/icons/dist/28/sort_outline';

import InvalidQR from './images/qr_invalid.svg'
import ValidQR from './images/qr_valid.svg'



const queryString = require('query-string');
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// var click_qr = false;
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);

function qr(agent_id, sheme) {
  let hex = "foregroundColor"
  if (sheme === "bright_light") {
    hex = "#000"
  }
  if (sheme === "space_gray") {
    hex = "#fff"
  }
  return (
    vkQr.createQR('https://vk.com/app7409818#agent_id=' + agent_id, {
      qrSize: 120,
      isShowLogo: true,
      foregroundColor: hex,
      className: 'svgqr'
    })
  )
}
const blueBackground = {
  backgroundColor: 'var(--accent)'
};
const POST_TEXTS = {
  prometay: {
    text: "Раздаю отличные ответы в [https://vk.com/jedi_road_app|Road to Jedi] по максимуму — это я от усердия теперь горю или мне наконец-то дали значок Прометея в Профиле RtJ? 🎉\n\n#RoadtoJedi #Прометей",
    image: "photo605436158_457240007"
  },
  verif: {
    text: "Доказал, что достоин, — верифицировал Профиль [https://vk.com/jedi_road_app|Road to Jedi].\n\nА у вас уже есть такая галочка?\n\n#RoadtoJedi #Верификация",
    image: "photo605436158_457240006"
  },
  donut: {
    text: "Поддерживаю любимое сообщество и приложение [https://vk.com/jedi_road_app|Road to Jedi].\n\nПриятно чувствовать себя агентом и выделяться среди остальных ;)\n\n#RoadtoJedi #VKDonut",
    image: "photo605436158_457240005"
  }

}
const HISTORY_IMAGES = {
  prometay: {
    image: "https://sun9-25.userapi.com/impf/y-48TlRZRKfvy6XPPv60iFFHRA1MVPknRFG8TA/ZgjfvgntI3A.jpg?size=607x1080&quality=96&sign=3bbcb679fce21acee714391359f764bd"
  },
  verif: {
    image: "https://sun9-32.userapi.com/impf/GTxLdOv-QScQqakIoBgM9cKQHLMx53ajTEWJrw/lsWE91Rdf4g.jpg?size=454x807&quality=96&sign=238abb9ba7b1fea3e26e2354c16a65dd"
  },
  donut: {
    image: "https://sun9-32.userapi.com/impf/ZSrMdpua6pPTqA6HYVXjEGm1QHkiPerFPVpBlQ/2q3uSkrkrsk.jpg?size=454x807&quality=96&sign=6d7c6695992142447101ae34ff36ff04"
  }
}
function enumerate (num, dec) {
  if (num > 100) num = num % 100;
  if (num <= 20 && num >= 10) return dec[2];
  if (num > 20) num = num % 10;
  return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
}
var ignore_back = false;
var ignore_promo = false;
export default withPlatform(class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api_url: "https://xelene.ru/road/php/index.php?",
      activePanel: 'profile',
      activeModal: null,
      modalHistory: [],
      popout: null,
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
      money_transfer_send: '',
      money_transfer_count: '',
      money_transfer_comment: '',
      AgeUser: 0,
      snackbar: null,
      myQuestions: [],
      moneyPromo: 0,
      sharing_type: 'prometay',
      id_rep: 1,
      typeres: 1,
    }
    this.changeData = this.props.this.changeData;
    this.playAudio = this.props.this.playAudio;
    this.ReloadProfile = this.props.reloadProfile;

    this.setReport = (typeres, id_rep) => {
      this.setState({typeres, id_rep})
      this.goPanel("report")
    }
    this.setPopout = (value) => {
      this.setState({ popout: value })
      if (value && value.type.name === 'ScreenSpinner') {
        ignore_back = true;
      } else {
        ignore_back = false;
      }
    }
    this.setMoneyPromo = (value) => {
      this.setState({ moneyPromo: value })
    }
    this.myQuestions = () => {
      fetch(this.state.api_url + "method=tickets.getByModeratorAnswers&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            this.setState({ myQuestions: data.response })
            setTimeout(() => {
              this.setState({ fetching: false });
              this.setPopout(null);
            }, 500)

          } else {
            this.showErrorAlert(data.error.message)
          }
        })
        .catch(err => {
          this.changeData('activeStory', 'disconnect')

        })
    }
    this.handlePopstate = (e) => {
      e.preventDefault();
      this.goBack()
    }
    this.setSnack = (value) => {
      this.setState({ snackbar: value })
    }
    this.goTiket = (id) => {
      this.setPopout(<ScreenSpinner />)
      this.setState({ ticket_id: id })
      this.goPanel('ticket');
      this.setPopout(null);
    }
    this.onChange = (event) => {
      var name = event.currentTarget.name;
      var value = event.currentTarget.value;
      this.setState({ [name]: value });
    }
    this.goOtherProfile = (id) => {
      this.setState({ active_other_profile: id })
      this.goPanel("other_profile")
    }
    this.modalBack = () => {
      this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
    };
    this.goBack = () => {
      if (!ignore_back) {
        ignore_back = true;
        const history = this.state.history;
        if (history.length === 1) {
          bridge.send("VKWebAppClose", { "status": "success" });
        } else if (history.length > 1) {
          history.pop()
          this.setActiveModal(null);
          if (this.state.activePanel === 'profile') {
            bridge.send('VKWebAppDisableSwipeBack');
          }
          this.setState({ activePanel: history[history.length - 1] })
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
        setTimeout(() => { ignore_back = false; }, 500)

      } else {
        const history = this.state.history;
        window.history.pushState({ panel: history[history.length - 1] }, history[history.length - 1]);
      }
    }
    this.goPanel = (panel) => {
      let history = this.state.history.slice();
      history.push(panel)
      window.history.pushState({ panel: panel }, panel);
      if (panel === 'profile') {
        bridge.send('VKWebAppEnableSwipeBack');
      }
      this.setState({ history: history, activePanel: panel, snackbar: null })
      // if(panel === 'ticket'){
      //   this.changeData('need_epic', false)
      // } else{
      //   this.changeData('need_epic', true)
      // }
    }
    this.setActiveModal = (activeModal) => {
      ignore_back = true
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
      setTimeout(() => {
        ignore_back = false
      }, 500)
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

  sendMoney() {
    this.setPopout(<ScreenSpinner />)
    fetch(this.state.api_url + 'method=transfers.send&' + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        // signal: controllertime.signal,
        body: JSON.stringify({
          'summa': this.state.money_transfer_count,
          'send_to': this.state.money_transfer_send,
          'comment': this.state.money_transfer_comment,
        })
      })
      .then(data => data.json())
      .then(data => {
        if (data.result) {
          setTimeout(() => {
            this.ReloadProfile();
            this.setPopout(null)
            this.setState({ moneys: data.response, money_transfer_comment: '', money_transfer_count: '', money_transfer_send: '' })
            this.setActiveModal("moneys")
          }, 4000)

        } else {
          this.showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        this.changeData('activeStory', 'disconnect')
      })
  }
  validateInputs(title) {
    if (title.length > 0) {
      let valid = ['error', 'Заполните это поле'];
      if (/^[a-zA-ZА-Яа-я0-9_ .,"'!?\-=+]*$/ui.test(title)) {
        valid = ['valid', '']
      } else {
        valid = ['error', 'Поле не должно содержать спец. символы'];
      }

      return valid
    }
    return ['default', '']

  }

  componentDidMount() {

    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', this.handlePopstate);
    this.myQuestions();
    if (hash.promo !== undefined && !ignore_promo) {
      ignore_promo = true
      this.goPanel('promocodes');
    }
  }
  componentWillUnmount() {
    bridge.send('VKWebAppDisableSwipeBack');
    window.removeEventListener('popstate', this.handlePopstate)
  }
  render() {
    // var QR = new Blob([qr(this.props.account['id'], this.props.this.state.scheme)], {
    //   type: 'image/png'
    // });
    // var hrefqr = URL.createObjectURL(QR);
    const { platform } = this.props;
    const modal = (
      <ModalRoot
        activeModal={this.state.activeModal}
      >

        <ModalPrometay
          id='prom'
          onClose={() => this.setActiveModal(null)}
          action={() => this.setActiveModal(null)}
          action2={() => { this.setState({ sharing_type: 'prometay' }); this.setActiveModal('share2') }} />

        <ModalDonut
          id='donut'
          onClose={() => this.setActiveModal(null)}
          action={() => this.setActiveModal(null)}
          action2={() => { this.setState({ sharing_type: 'donut' }); this.setActiveModal('share2') }} />

        <ModalVerif
          id='verif'
          onClose={() => this.setActiveModal(null)}
          action={() => this.setActiveModal(null)}
          action2={() => { this.setState({ sharing_type: 'verif' }); this.setActiveModal('share2') }} />

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
          id='send'
          onClose={() => this.setActiveModal(null)}
          icon={<Icon56MoneyTransferOutline />}
          header="Отправляйте монетки друзьям"
        >
          <FormLayout>
            <FormItem
            status={this.validateInputs(this.state.money_transfer_send)[0]}
            bottom={this.validateInputs(this.state.money_transfer_send)[1]}>
              <Input maxLength="15"
                onChange={(e) => this.onChange(e)}
                placeholder="Введите id или ник агента"
                name="money_transfer_send"
                value={this.state.money_transfer_send}
                 />
            </FormItem>
            <FormItem>
              <Input maxLength="5"
                type='number'
                name="money_transfer_count"
                onChange={(e) => this.onChange(e)}
                placeholder="Введите кол-во монеток"
                value={this.state.money_transfer_count} />
            </FormItem>
            <FormItem
            status={this.validateInputs(this.state.money_transfer_comment)[0]}
            bottom={this.validateInputs(this.state.money_transfer_comment)[1]}>
              <Input
                maxLength="100"
                name="money_transfer_comment"
                onChange={(e) => this.onChange(e)}
                placeholder="Введите комментарий к переводу"
                value={this.state.money_transfer_comment}
                 />
            </FormItem>
            <FormItem>
              <Button
                disabled={
                  !this.state.money_transfer_send || !this.state.money_transfer_count
                }
                size='l'
                stretched
                mode='secondary'
                type='submit'
                onClick={() => {
                  this.setActiveModal(null)
                  this.sendMoney();
                }}>Отправить</Button>
            </FormItem>
          </FormLayout>
        </ModalCard>
        
        <ModalCard
          id='moneys'
          onClose={() => this.setActiveModal(null)}
          icon={<Avatar src={this.state.moneys ? this.state.moneys.avatar : null} size={72} />}
          header={this.state.moneys ? "Ваш баланс: " + this.state.moneys.money : null}
          subheader={this.state.moneys ? this.state.moneys.text : null}
          actions={
            <Button mode='secondary' 
            size='l'
            onClick={() => {
              this.setActiveModal(null);
              this.setState({ moneys: null, money_transfer_count: '', money_transfer_send: '' })
            }}>Закрыть</Button>
          }
        >
        </ModalCard>
        <ModalCard
          id='transfer'
          onClose={() => this.setActiveModal(null)}
          icon={<Avatar src={this.state.transfer.avatar} size={72} />}
          header='Перевод монеток'
          subheader={this.state.transfer.comment}
          actions={
            <Button
            onClick={() => {
              this.setActiveModal(null);
            }}
            size='l'
            mode='secondary'>Закрыть</Button>
          }
        >
        </ModalCard>
        <ModalPage
          id="share"
          onClose={this.modalBack}
          header={
            <ModalPageHeader
              right={platform === IOS && <Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
              left={platform === ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
            >
              Поделиться
                  </ModalPageHeader>
          }
        >
          <List>
            <Cell onClick={() => this.setActiveModal("qr")} before={<Icon24Qr width={28} height={28} />}>QR-code</Cell>
            {/* <Cell onClick={() => {bridge.send("VKWebAppShowWallPostBox", {"message": "https://vk.com/app7409818#agent_id=" + this.props.account['id']}); this.setActiveModal(null);}} before={<Icon28MessagesOutline width={28} height={28}/>}>В сообщения</Cell> */}
            <Cell onClick={() => {
              bridge.send("VKWebAppCopyText", { text: "https://vk.com/app7409818#agent_id=" + this.props.account['id'] }); this.setActiveModal(null); this.setSnack(<Snackbar
                layout="vertical"
                onClose={() => this.setSnack(null)}
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
              >
                Ссылка скопирована
                  </Snackbar>);
            }} before={<Icon24Linked width={28} height={28} />}>Скопировать ссылку</Cell>
          </List>
        </ModalPage>

        <ModalPage
          id="share2"
          onClose={this.modalBack}
          header={
            <ModalPageHeader
              right={platform === IOS && <Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
              left={platform === ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
            >
              Рассказать
                  </ModalPageHeader>
          }
        >
          <List>
            <Cell
              onClick={() => bridge.send("VKWebAppShowWallPostBox",
                {
                  message: POST_TEXTS[this.state.sharing_type]['text'],
                  attachments: POST_TEXTS[this.state.sharing_type]['image']
                })}
              before={<Icon28NewsfeedOutline />}>
              На стене
                    </Cell>
            <Cell before={<Icon28StoryAddOutline />}
              onClick={() => {
                bridge.send("VKWebAppShowStoryBox",
                  {
                    background_type: "image",
                    url: HISTORY_IMAGES[this.state.sharing_type]['image'],
                    attachment: {
                      "type": "url",
                      "url": "https://vk.com/jedi_road_app",
                      "text": "learn_more"
                    }
                  })
              }}>
              В истории
                    </Cell>
          </List>
        </ModalPage>

        <ModalPage
          id="qr"
          onClose={this.modalBack}
          dynamicContentHeight
          header={
            <ModalPageHeader
              // right={<Header onClick={this.modalBack}><Icon24Dismiss style={{color: 'var(--placeholder_icon_foreground_primary)'}} /></Header>}
              right={platform === IOS && <Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
              left={platform === ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
            >
              QR
                  </ModalPageHeader>
          }
        >
          {<div className="qr" dangerouslySetInnerHTML={{ __html: qr(this.props.account['id'], this.props.this.state.scheme) }} />}
          <br />
          <div className="qr" >Отсканируйте камерой ВКонтакте!</div>
          <br />
          {/* <div className="qr">или</div>
                 <br/>
                 <Div>
                   <Button className='qrdown' onClick={() => {platformname ? 
                    this.GenerateFileQr(QR) : this.GenerateFileQr(QR);console.log('click') }} download='QR.svg'>Скачать svg</Button>
                 </Div> */}
        </ModalPage>
        
        
        <ModalCard
          id='invalid_qr'
          onClose={this.modalBack}
          icon={<img src={InvalidQR} alt='QR' />}
          header="Промокод недействительный"
          caption={
            <span>
              Увы, активировать промокод не получится, так как он использовался ранее или его никогда не существовало.
                </span>}
          actions={
            <Button mode='secondary' onClick={this.modalBack}>Понятно</Button>
          } />
        <ModalCard 
          id='answers'
          onClose={() => this.setActiveModal(null)}
          icon={<Icon28SortOutline width={56} height={56} />}
          header={'Вы сгенерировали ' + this.props.account['bad_answers'] + " " + enumerate(this.props.account['bad_answers'], ['вопрос', 'вопроса', 'вопросов'])}
          caption={(200 - this.props.account['bad_answers'] < 0) ? "Порог достигнут" : "Для преодоления порога необходимо оценить ещё " + 
          (200 - this.props.account['bad_answers']) + 
          " " + enumerate(this.props.account['bad_answers'], ['вопрос', 'вопроса', 'вопросов']) + " за неделю"}
          actions={
            <Button
            onClick={() => {
              this.setActiveModal(null);
            }}
            size='l'
            mode='secondary'>Понятно</Button>
          }>
          </ModalCard>
        <ModalCard
          id='valid_qr'
          onClose={this.modalBack}
          icon={<img src={ValidQR} alt='QR' />}
          header="Вы активировали промокод!"
          caption={
            <span>
              Поздравляем! На Ваш виртуальный счет было начислено {this.state.moneyPromo} монеток.
                </span>}
          actions={
            <Button mode='primary' onClick={this.modalBack}>Ура!</Button>
          } />
      </ModalRoot>
    )
    return (
      <View
        id={this.props.id}
        activePanel={this.state.activePanel}
        modal={modal}
        popout={this.state.popout}
        history={this.state.history}
        onSwipeBack={() => window.history.back()}
      >

        <Prof id="profile" this={this} 
        account={this.props.account} />

        <MYQuest id="qu" this={this} 
        account={this.props.account} 
        myQuestions={this.state.myQuestions} />

        <Market id="market" this={this} 
        account={this.props.account} />

        <Achievements id="achievements" 
        this={this} 
        account={this.props.account} />

        <Settings id="settings" 
        this={this} 
        account={this.props.account} 
        popout={this.state.popout} />

        <SchemeChange id="schemechange" 
        this={this} 
        default_scheme={this.props.default_scheme} 
        account={this.props.account} />

        <Info id='info' 
        this={this} />

        <Verfy id='verf' 
        this={this} 
        account={this.props.account} />

        <Promocodes id='promocodes' 
        this={this} 
        account={this.state.account} 
        setMoneyPromo={this.setMoneyPromo} />

        <NewTicket id='new_ticket'
          this={this}
          account={this.props.account} />

        <Tiket id="ticket"
          this={this}
          ticket_id={this.state.ticket_id}
          account={this.props.account} />

        <OtherProfile id="other_profile"
          this={this}
          agent_id={this.state.active_other_profile}
          account={this.props.account} />

        <Reports id="report" 
        this={this} 
        id_rep={this.state.id_rep} 
        typeres={this.state.typeres} /> 

      </View>
    )
  }
}
)