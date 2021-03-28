import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import vkQr from '@vkontakte/vk-qr';
// import {svg2png} from 'svg-png-converter'

import {
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
  FormLayout,
  Button,
  FormItem,
  usePlatform,
  VKCOM,
  Textarea,
  CellButton,
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Prof from './panels/profile';
import Market from './panels/market';
import MYQuest from './panels/AllQuestions';
import Settings from './panels/settings';
import SchemeChange from './panels/schemechange';
import Info from './panels/info'
import Verfy from './panels/verfy'
import Promocodes from './panels/promocode';
import Tiket from '../../components/tiket';
import OtherProfile from '../../components/other_profile'
import Reports from '../../components/report';

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut'
import ModalComment from '../../Modals/Comment';
import ModalBan from '../../Modals/Ban';
import ModalVerif from '../../Modals/Verif';


import {
  Icon24Linked,
  Icon56MoneyTransferOutline,
  Icon16CheckCircle,
  Icon28NewsfeedOutline,
  Icon28StoryAddOutline,
  Icon24Qr,
  Icon24Dismiss,
  Icon56GhostOutline,


} from '@vkontakte/icons'

import InvalidQR from './images/qr_invalid.svg'
import ValidQR from './images/qr_valid.svg'


import { API_URL, LINK_APP } from '../../config';
import { alertCreator, errorAlertCreator, goOtherProfileCreator, goPanelCreator, recog_number, setActiveModalCreator } from '../../Utils';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../store/main';



const queryString = require('query-string');
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
    vkQr.createQR(LINK_APP + '#agent_id=' + agent_id, {
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
var ignore_back = false;
var ignore_promo = false;


export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const [popout, setPopout] = useState(null);
  const [ticket_id, setTicket] = useState(null);
  const [historyPanelsState, setHistory] = useState(['profile']);
  const [activePanel, setActivePanel] = useState('profile');
  const [activeModal, setModal] = useState(null);
  const [modalHistory, setModalHistory] = useState(null);
  const [sharing_type, setSharingType] = useState('prometay');
  const comment = useSelector((state) => state.tickets.comment)
  const [Transfers, setTransfers] = useState({ to_id: '', count: '', comment: '', dataTrans: null});
  const [snackbar, setSnackbar] = useState(null);
  const [moneyPromo, setMoneyPromo] = useState(0);
  const [newStatus, setNewStatus] = useState('');
  const {
    other_profile: OtherProfileData,
    account,
  } = useSelector((state) => state.account)
  const [typeres, setTyperes] = useState(0);
  const [id_rep, setIdRep] = useState(0);
  const platform = usePlatform()
  const levels = account.levels;
  const exp_to_next_lvl = levels.exp_to_lvl - levels.exp;

  const goPanel = useCallback((panel) => {
    setSnackbar(null)
    goPanelCreator(setHistory, setActivePanel, historyPanelsState, panel)
    if (panel === 'profile') {
      bridge.send('VKWebAppEnableSwipeBack');
    }
  }, [historyPanelsState])
  const goOtherProfile = useCallback((id) => {
    goOtherProfileCreator(goPanel, setActiveStory, showErrorAlert, OtherProfileData, dispatch, id)
  }, [dispatch, goPanel, OtherProfileData, setActiveStory])
  const setActiveModal = (activeModal) => {
    setActiveModalCreator(setModal, setModalHistory, modalHistory, activeModal)
  }
  const showErrorAlert = (error = null, action = null) => {
    errorAlertCreator(setPopout, error, action)
  }
  const setReport = (typeres, id_rep) => {
    setTyperes(typeres);
    setIdRep(id_rep);
    goPanel("report")
  }
  const goBack = useCallback(() => {
    const history = [...historyPanelsState]
    setSnackbar(null)
    if (!ignore_back) {
      ignore_back = true;
      if (history.length === 1) {
        bridge.send("VKWebAppClose", { "status": "success" });
      } else if (history.length > 1) {

        if (activePanel === 'profile') {
          bridge.send('VKWebAppDisableSwipeBack');
        }
        history.pop()
        setActivePanel(history[history.length - 1])
        setPopout(<ScreenSpinner />)
        setTimeout(() => {
          setPopout(null)
        }, 500)
      }
      setHistory(history)
      setTimeout(() => { ignore_back = false; }, 500)

    } else {
      window.history.pushState({ panel: history[history.length - 1] }, history[history.length - 1]);
    }
  }, [setPopout, activePanel, historyPanelsState])
  const handlePopstate = useCallback((e) => {
    e.preventDefault();
    goBack();
  }, [goBack]);
  const showAlert = (title, text) => {
    alertCreator(setPopout, title, text)
  }
  const sendMoney = () => {
    setPopout(<ScreenSpinner />)
    fetch(API_URL + 'method=transfers.send&' + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'summa': Transfers.count,
          'send_to': Transfers.to_id,
          'comment': Transfers.comment
        })
      })
      .then(data => data.json())
      .then(data => {
        if (data.result) {
          setTimeout(() => {
            props.reloadProfile();
            setPopout(null)
            setTransfers({ ...Transfers, comment: '', count: '', to_id: '', dataTrans: data.response})
            setActiveModal("moneys")
          }, 2000)

        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        setActiveStory('disconnect');
      })
  }
  
  const goTiket = useCallback((id) => {
    setPopout(<ScreenSpinner />)
    setTicket(id)
    goPanel('ticket');
    setPopout(null);
  }, [goPanel, setPopout])
  const validateInputs = (title) => {
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
  const saveNewStatus = () => {
    setPopout(<ScreenSpinner/>)
    fetch(API_URL + "method=account.changeStatus&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'status': newStatus.trim(),
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.result) {
              
              setActiveModal(null)
              setTimeout(() => {
                  props.reloadProfile();
                  setPopout(null);
              }, 1000)
            } else {
                showErrorAlert(data.error.message)
            }
        })
        .catch(err => {
            setActiveStory('disconnect');
        })
}
  useEffect(() => {
    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', handlePopstate);
    if (hash.promo !== undefined && !ignore_promo) {
      ignore_promo = true
      goPanel('promocodes');
    }
    const img1 = new Image();
    const img2 = new Image();
    img1.src = InvalidQR;
    img2.src = ValidQR;

    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch, goPanel])
  const modal = (
    <ModalRoot
      activeModal={activeModal}
    >

      <ModalPrometay
        id='prom'
        onClose={() => setActiveModal(null)}
        action={() => setActiveModal(null)}
        action2={(activePanel === 'profile') ? () => { setSharingType('prometay' ); setActiveModal('share2') } : undefined} />

      <ModalDonut
        id='donut'
        onClose={() => setActiveModal(null)}
        action={() => setActiveModal(null)}
        action2={(activePanel === 'profile') ? () => { setSharingType('donut'); setActiveModal('share2') } : undefined} />

      <ModalVerif
        id='verif'
        onClose={() => setActiveModal(null)}
        action={() => setActiveModal(null)}
        action2={(activePanel === 'profile') ? () => { setSharingType('verif'); setActiveModal('share2') } : undefined} />

      <ModalBan
        id='ban_user'
        onClose={() => setActiveModal(null)}
      />
      <ModalComment
        id='comment'
        onClose={() => setActiveModal(null)}
        comment={comment}
        reporting={setReport} />

      <ModalCard 
      id='fantoms'
      onClose={() => setActiveModal(null)}
      icon={<Icon56GhostOutline/>}
      header={`Вы собрали ${recog_number(levels.exp)} фантомов и заработали ${levels.lvl} уровень`}
      subheader={`Чтобы начать собирать фантомов, перейдите в магазин и приобретите.\nДо следующего уровня не хватает ${exp_to_next_lvl} фантомов`}
      actions={<Button stretched size='l' onClick={() => setActiveModal(null)}>Понятно</Button>}>
        <CellButton expandable centered hasActive={false} hasHover={false} onClick={() => {goPanel('market');setActiveModal(null)}}>Приобретите их</CellButton>
      </ModalCard>

      <ModalCard
        id='send'
        onClose={() => setActiveModal(null)}
        icon={<Icon56MoneyTransferOutline />}
        header="Отправляйте монетки друзьям"
      >
        <FormLayout>
          <FormItem
            status={validateInputs(Transfers.to_id)[0]}
            bottom={validateInputs(Transfers.to_id)[1]}>
            <Input maxLength="15"
              onChange={(e) => setTransfers({ ...Transfers, to_id: e.currentTarget.value})}
              placeholder="Введите id или ник агента"
              value={Transfers.to_id}
            />
          </FormItem>
          <FormItem>
            <Input maxLength="5"
              type='number'
              onChange={(e) => setTransfers({ ...Transfers, count: e.currentTarget.value })}
              placeholder="Введите кол-во монеток"
              value={Transfers.count} />
          </FormItem>
          <FormItem
            status={validateInputs(Transfers.comment)[0]}
            bottom={validateInputs(Transfers.comment)[1]}>
            <Input
              maxLength="100"
              name="money_transfer_comment"
              onChange={(e) => setTransfers({ ...Transfers, comment: e.currentTarget.value })}
              placeholder="Введите комментарий к переводу"
              value={Transfers.comment}
            />
          </FormItem>
          <FormItem>
            <Button
              disabled={
                !Transfers.to_id || !Transfers.count
              }
              size='l'
              stretched
              mode='secondary'
              type='submit'
              onClick={() => {
                setActiveModal(null)
                sendMoney();
              }}>Отправить</Button>
          </FormItem>
        </FormLayout>
      </ModalCard>

      <ModalCard
        id='moneys'
        onClose={() => setActiveModal(null)}
        icon={<Avatar src={Transfers.dataTrans ? Transfers.dataTrans.avatar : null} size={72} />}
        header={Transfers.dataTrans ? "Ваш баланс: " + Transfers.dataTrans.money : null}
        subheader={Transfers.dataTrans ? Transfers.dataTrans.text : null}
        actions={
          <Button mode='secondary'
            size='l'
            stretched
            onClick={() => {
              setActiveModal(null);
              setTransfers({...Transfers, dataTrans: null})
            }}>Закрыть</Button>
        }
      >
      </ModalCard>

      <ModalCard
        id='statuschange'
        onClose={() => setActiveModal(null)}
        header='Введите новый статус'
        subheader='Будте креативны, но не нарушайте правила'
        actions={[
          <Button mode='secondary'
          key={1}
            size='l'
            stretched
            onClick={() => setActiveModal(null)}>Отмена</Button>,
            <Button mode='primary'
            key={2}
            size='l'
            stretched
            onClick={() => saveNewStatus()}>Сохранить</Button>
          ]
        }
      >
        <Textarea maxLength="140" onChange={(e) => setNewStatus(e.currentTarget.value)} defaultValue={newStatus} />
      </ModalCard>

      <ModalPage
        id="share"
        onClose={() => setActiveModal(null)}
        header={
          <ModalPageHeader
            right={platform === IOS && <Header onClick={() => setActiveModal(null)}><Icon24Dismiss /></Header>}
            left={platform === ANDROID && <PanelHeaderButton onClick={() => setActiveModal(null)}><Icon24Dismiss /></PanelHeaderButton>}
          >
            Поделиться
                  </ModalPageHeader>
        }
      >
        <List>
          <Cell onClick={() => setActiveModal("qr")} before={<Icon24Qr width={28} height={28} />}>QR-code</Cell>
          <Cell onClick={() => {
            bridge.send("VKWebAppCopyText", { text: LINK_APP + "#agent_id=" + account['id'] }); setActiveModal(null); setSnackbar(<Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              Ссылка скопирована
                  </Snackbar>);
          }} before={<Icon24Linked width={28} height={28} />}>Скопировать ссылку</Cell>
        </List>
      </ModalPage>

      <ModalPage
        id="share2"
        onClose={() => setActiveModal(null)}
        header={
          <ModalPageHeader
            right={platform === IOS && <Header onClick={() => setActiveModal(null)}><Icon24Dismiss /></Header>}
            left={platform === ANDROID && <PanelHeaderButton onClick={() => setActiveModal(null)}><Icon24Dismiss /></PanelHeaderButton>}
          >
            Рассказать
                  </ModalPageHeader>
        }
      >
        <List>
          <Cell
            onClick={() => bridge.send("VKWebAppShowWallPostBox",
              {
                message: POST_TEXTS[sharing_type]['text'],
                attachments: POST_TEXTS[sharing_type]['image']
              })}
            before={<Icon28NewsfeedOutline />}>
            На стене
                    </Cell>
          <Cell before={<Icon28StoryAddOutline />}
            onClick={() => {
              bridge.send("VKWebAppShowStoryBox",
                {
                  background_type: "image",
                  url: HISTORY_IMAGES[sharing_type]['image'],
                  attachment: {
                    "type": "url",
                    "url": LINK_APP,
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
        onClose={() => setActiveModal(null)}
        dynamicContentHeight
        header={
          <ModalPageHeader
            right={platform === IOS && <Header onClick={() => setActiveModal(null)}><Icon24Dismiss /></Header>}
            left={platform === ANDROID && <PanelHeaderButton onClick={() => setActiveModal(null)}><Icon24Dismiss /></PanelHeaderButton>}
          >
            QR
                  </ModalPageHeader>
        }
      >
        {<div className="qr" dangerouslySetInnerHTML={{ __html: qr(account.id, platform === VKCOM ? 'bright_light' : props.scheme) }} />}
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
        onClose={() => setActiveModal(null)}
        icon={<img src={InvalidQR} alt='QR' />}
        header="Промокод недействительный"
        caption={
          <span>
            Увы, активировать промокод не получится, так как он использовался ранее или его никогда не существовало.
                </span>}
        actions={
          <Button mode='secondary' stretched size='l' onClick={() => setActiveModal(null)}>Понятно</Button>
        } />
      
      <ModalCard
        id='valid_qr'
        onClose={() => setActiveModal(null)}
        icon={<img src={ValidQR} alt='QR' />}
        header="Вы активировали промокод!"
        caption={
          <span>
            Поздравляем! На Ваш виртуальный счет было начислено {moneyPromo} монеток.
                </span>}
        actions={
          <Button mode='primary' stretched size='l' onClick={() => setActiveModal(null)}>Ура!</Button>
        } />
    </ModalRoot>
  )
  
  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, goTiket, setActiveModal, showAlert, goOtherProfile, setSnackbar, setNewStatus }
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      modal={modal}
      popout={popout}
      history={historyPanelsState}
      onSwipeBack={() => window.history.back()}
    >

      <Prof id="profile"
      snackbar={snackbar}
      reloadProfile={props.reloadProfile}
      callbacks={callbacks} />

      <MYQuest id="qu"
        callbacks={callbacks} />

      <Market id="market"
        snackbar={snackbar}
        reloadProfile={props.reloadProfile}
        callbacks={callbacks} />

      <Settings id="settings"
        callbacks={callbacks}
        snackbar={snackbar}
        reloadProfile={props.reloadProfile} />

      <SchemeChange id="schemechange"
      reloadProfile={props.reloadProfile}
      callbacks={callbacks} />

      <Info id='info' />

      <Verfy id='verf'
        callbacks={callbacks} />

      <Promocodes id='promocodes'
        reloadProfile={props.reloadProfile}
        callbacks={callbacks}
        setMoneyPromo={setMoneyPromo} />

      <Tiket id="ticket"
      callbacks={callbacks}
      ticket_id={ticket_id} />

      <OtherProfile id="other_profile"
      callbacks={callbacks} />

      <Reports id="report"
      callbacks={callbacks}
        id_rep={id_rep}
        typeres={typeres} />

    </View>
  )
}