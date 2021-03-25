import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
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
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../store/main';
import { alertCreator, errorAlertCreator, goOtherProfileCreator, goPanelCreator, setActiveModalCreator } from '../../Utils';


var ignore_back = false;
export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const [popout, setPopout] = useState(null);
  const [ticket_id, setTicket] = useState(null);
  const [historyPanelsState, setHistory] = useState(['notif']);
  const [activePanel, setActivePanel] = useState('notif');
  const [activeModal, setModal] = useState(null);
  const [typeres, setTyperes] = useState(0);
  const [id_rep, setIdRep] = useState(0);
  const [modalHistory, setModalHistory] = useState(null);
  const [Transfer, setTransfer] = useState(
    {
      avatar: 1,
      text: '',
      comment: '', 
    }
  )
  const comment = useSelector((state) => state.tickets.comment)

  const {
    other_profile: OtherProfileData,
  } = useSelector((state) => state.account)

  const goPanel = useCallback((panel) => {
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
    if (!ignore_back) {
      ignore_back = true;
      if (history.length === 1) {
        setActiveStory('profile')
      } else if (history.length > 1) {

        if (activePanel === 'notif') {
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
  }, [setPopout, activePanel, historyPanelsState, setActiveStory])
  const handlePopstate = useCallback((e) => {
    e.preventDefault();
    goBack();
  }, [goBack]);
  const showAlert = (title, text) => {
    alertCreator(setPopout, title, text)
  }
  const goTiket = useCallback((id) => {
    setPopout(<ScreenSpinner />)
    setTicket(id)
    goPanel('ticket');
    setPopout(null);
  }, [goPanel, setPopout])

  const openMoneyTransfer = (avatar, text, comment, type) => {
    setTransfer({
      type: type,
      avatar: avatar,
      text: text,
      comment: comment ? comment : (type === 'money_transfer_send') ? '' : 'Агент не оставил комментария 😢'
    })
    setActiveModal('transfer')
  }

  useEffect(() => {
    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', handlePopstate);

    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch, goPanel])
  
  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, goTiket, setActiveModal, showAlert, goOtherProfile, openMoneyTransfer }
  const modal = (
    <ModalRoot
    activeModal={activeModal}
    >
      <ModalPrometay
        id='prom'
        onClose={() => setActiveModal(null)}
        action={() => setActiveModal(null)} />

      <ModalDonut
        id='donut'
        onClose={() => setActiveModal(null)}
        action={() => setActiveModal(null)} />

      <ModalVerif
        id='verif'
        onClose={() => setActiveModal(null)}
        action={() => setActiveModal(null)} />

      <ModalBan
        id='ban_user'
        callbacks={callbacks}
        onClose={() => setActiveModal(null)}
      />
      <ModalComment
        id='comment'
        onClose={() => setActiveModal(null)}
        comment={comment}
        reporting={setReport} />
      
      <ModalCard
        id='transfer'
        onClose={() => setActiveModal(null)}
        icon={<Avatar src={Transfer.avatar} size={72} />}
        header='Перевод монеток'
        subheader={Transfer.comment}
        actions={
        <Button mode='secondary' stretched size='l' onClick={() => setActiveModal(null)}>Закрыть</Button>
      }
      />
      
    </ModalRoot>
)
  return(
    <View 
    id={props.id}
    activePanel={activePanel}
    modal={modal}
    popout={popout}
    history={historyPanelsState}
    onSwipeBack={() => window.history.back()}
    >
      <Notif id="notif"
      callbacks={callbacks}
      reloadProfile={props.reloadProfile} />

      <Tiket id="ticket" 
      callbacks={callbacks}
      ticket_id={ticket_id}  />

      <OtherProfile id="other_profile" 
      callbacks={callbacks} />

      <Reports id="report" 
      callbacks={callbacks}
      id_rep={id_rep} 
      typeres={typeres} />

    </View>   
  )
}
