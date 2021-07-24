import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  View,
  ScreenSpinner,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import NewTicket      from './panels/new_tiket'
import Questions      from './panels/questions'
import Tiket          from '../../components/tiket';
import OtherProfile   from '../../components/other_profile'
import Reports        from '../../components/report';
import AnswerAdded    from '../../components/AnswerAdded';
import { viewsActions } from '../../store/main'
//Импортируем модальные карточки
import { useDispatch, useSelector } from 'react-redux';
import { goPanelCreator, goOtherProfileCreator } from '../../Utils';
import { isEmptyObject } from 'jquery';

var adsCounter = 0;
const queryString = require('query-string');
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);
var ignore_hash = false;
var ignore_back = false;

export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const [ticket_id, setTicket] = useState(null);
  const [historyPanelsState, setHistory] = useState(['questions']);
  const [activePanel, setActivePanel] = useState('questions');
  const { 
    other_profile: OtherProfileData,
    account, 
  } = useSelector((state) => state.account)
  const {showAlert, showErrorAlert, setActiveModal, updateSetReport, setCallbacks, setPopout} = props.popouts_and_modals

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
    if(adsCounter !== 0 && adsCounter % 2 === 0 && !isEmptyObject(account) && !account.donut){
      bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
      // .then(data => console.log(data.result))
      // .catch(error => console.log(error));
    }
    adsCounter++
    setPopout(null);
  }, [goPanel, setPopout, account])

  const goOtherProfile = useCallback((id) => {
      goOtherProfileCreator(goPanel, setActiveStory, showErrorAlert, OtherProfileData, dispatch, id)
    }, [dispatch, goPanel, OtherProfileData, setActiveStory])
    
  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, goTiket, setActiveModal, showAlert, goOtherProfile }
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
    updateSetReport(setReport);
    setCallbacks(callbacks);
    
    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch, goOtherProfile, goTiket])
  
  
  return(
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsState}
      onSwipeBack={() => window.history.back()}
    >
      <Questions id='questions'
        callbacks={callbacks}/>
      <NewTicket id='new_ticket'
      callbacks={callbacks}
      reloadProfile={props.reloadProfile} />
      <Tiket id="ticket" 
        callbacks={callbacks}
        ticket_id={ticket_id} />
      <OtherProfile id="other_profile"
        callbacks={callbacks} />
      <Reports id="report" callbacks={callbacks} id_rep={id_rep} typeres={typeres} />
      <AnswerAdded id="answer_added" goQuestions={() => {setActiveStory('questions');goPanel('questions')}} />
    </View>
  )
}