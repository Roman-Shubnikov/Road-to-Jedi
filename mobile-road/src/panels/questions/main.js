import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  View,
  ScreenSpinner,
  ModalRoot,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import NewTicket from './panels/new_tiket'
import Questions from './panels/questions'
import Tiket from '../../components/tiket';
import OtherProfile from '../../components/other_profile'
import Reports from '../../components/report';
import { viewsActions } from '../../store/main'
//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut'
import ModalComment from '../../Modals/Comment';
import ModalBan from '../../Modals/Ban';
import ModalVerif from '../../Modals/Verif'
import { useDispatch, useSelector } from 'react-redux';
import { errorAlertCreator, alertCreator, setActiveModalCreator, goPanelCreator, goOtherProfileCreator } from '../../Utils';


const queryString = require('query-string');
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);
var ignore_hash = false;
var ignore_back = false;

export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const [popout, setPopout] = useState(null);
  const [ticket_id, setTicket] = useState(null);
  const [historyPanelsState, setHistory] = useState(['questions']);
  const [activePanel, setActivePanel] = useState('questions');
  const [activeModal, setModal] = useState(null);
  const [modalHistory, setModalHistory] = useState(null);
  const { 
    other_profile: OtherProfileData 
  } = useSelector((state) => state.account)
  const comment = useSelector((state) => state.tickets.comment)

  const [typeres, setTyperes] = useState(0);
  const [id_rep, setIdRep] = useState(0);
  

  const goBack = useCallback(() => {
    const history = [...historyPanelsState]
      if(!ignore_back){
        ignore_back = true;
        if (history.length === 1) {
            bridge.send("VKWebAppClose", {"status": "success"});
        } else if (history.length > 1) {
          
          if(activePanel === 'load') {
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
        setTimeout(() => {ignore_back = false;}, 500)
        
      }else{
        window.history.pushState({ panel: history[history.length - 1] }, history[history.length - 1] );
      }
  }, [setPopout, activePanel, historyPanelsState])
  const setReport = (typeres, id_rep) => {
    setTyperes(typeres);
    setIdRep(id_rep);
    goPanel("report")
  }
  const goPanel = useCallback((panel) => {
    goPanelCreator(setHistory, setActivePanel, historyPanelsState, panel)
    if(panel === 'questions') {
      bridge.send('VKWebAppEnableSwipeBack');
    }
  }, [historyPanelsState])

  const handlePopstate = useCallback((e) => {
    e.preventDefault();
    goBack();
  }, [goBack]);

  const goTiket = useCallback((id) => {
    setPopout(<ScreenSpinner/>)
    setTicket(id)
    goPanel('ticket');
    setPopout(null);
  }, [goPanel, setPopout])

  const goOtherProfile = useCallback((id) => {
      goOtherProfileCreator(goPanel, setActiveStory, showErrorAlert, OtherProfileData, dispatch, id)
    }, [dispatch, goPanel, OtherProfileData, setActiveStory])
    
  const setActiveModal = (activeModal) => {
    setActiveModalCreator(setModal, setModalHistory, modalHistory, activeModal)
  }
  const showErrorAlert = (error = null, action = null) => {
    errorAlertCreator(setPopout, error, action)
  }
  const showAlert = (title, text) => {
    alertCreator(setPopout, title, text)
  }
  
  useEffect(() => {
    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', handlePopstate);
    dispatch(viewsActions.setNeedEpic(true))
    if (!ignore_hash) {
      if (hash.ticket_id !== undefined) {
        goTiket(hash.ticket_id)
      }
      if (hash.agent_id !== undefined) {
        goOtherProfile(hash.agent_id);
      }
      ignore_hash = true;
    }
    
    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch, goOtherProfile, goTiket])
  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, goTiket, setActiveModal, showAlert, goOtherProfile }
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
        onClose={() => setActiveModal(null)}
        callbacks={callbacks}
      />
      <ModalComment
        id='comment'
        comment={comment}
        onClose={() => setActiveModal(null)}
        reporting={setReport} />
    </ModalRoot>
  )
  
  return(
    <View
      id={props.id}
      activePanel={activePanel}
      modal={modal}
      history={historyPanelsState}
      onSwipeBack={() => window.history.back()}
      popout={popout}
    >
      <Questions id='questions'
        callbacks={callbacks}/>
      <NewTicket id='new_ticket'
      callbacks={callbacks} />
      <Tiket id="ticket" 
        callbacks={callbacks}
        ticket_id={ticket_id} />
      <OtherProfile id="other_profile"
        callbacks={callbacks} />
      <Reports id="report" callbacks={callbacks} id_rep={id_rep} typeres={typeres} />
    </View>
  )
}