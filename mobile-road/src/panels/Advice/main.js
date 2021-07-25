import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  View,
  ScreenSpinner,
  ModalRoot,
  } from '@vkontakte/vkui';

// Импортируем панели
import Advice             from './panels/adv';
import Donuts             from './panels/donuts';
import Premium            from './panels/premium';
import FaqMain            from './panels/faq/main';
import FaqQuestions       from './panels/faq/questionsList';
import FaqQuestion        from './panels/faq/question';
import FaqCreateCategory  from './panels/faq/createCategory';
import FaqCreateQuestion  from './panels/faq/createQuestion';
import OtherProfile       from '../../components/other_profile';
import Reports            from '../../components/report';
import TestingAgents from './panels/testbyagent';

//Импортируем модальные карточки
import ModalPrometay  from '../../Modals/Prometay';
import ModalDonut     from '../../Modals/Donut'
import ModalBan       from '../../Modals/Ban';
import ModalVerif     from '../../Modals/Verif'
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../store/main';
import { errorAlertCreator, setActiveModalCreator, goPanelCreator, goOtherProfileCreator } from '../../Utils';

const queryString = require('query-string');
const hash = queryString.parse(window.location.hash);
var ignore_back = false;
var ignore_promo = false;

export default props => {
  const dispatch = useDispatch();
  const [popout, setPopout] = useState(() => (props.popout));
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const [typeres, setTyperes] = useState(0);
  const [id_rep, setIdRep] = useState(0);
  const [modalHistory, setModalHistory] = useState(null);
  const [historyPanelsState, setHistory] = useState(['advice']);
  const [activePanel, setActivePanel] = useState('advice');
  const [activeModal, setModal] = useState(null);
  const {
    other_profile: OtherProfileData
  } = useSelector((state) => state.account)

  const goPanel = useCallback((panel) => {
    goPanelCreator(setHistory, setActivePanel, historyPanelsState, panel)
    if (panel === 'questions') {
      bridge.send('VKWebAppEnableSwipeBack');
    }
  }, [historyPanelsState])
  const setReport = (typeres, id_rep) => {
    setTyperes(typeres);
    setIdRep(id_rep);
    goPanel("report")
  }
  const setActiveModal = (activeModal) => {
    setActiveModalCreator(setModal, setModalHistory, modalHistory, activeModal)
  }
  const showErrorAlert = (error = null, action = null) => {
    errorAlertCreator(setPopout, error, action)
  }
  const goOtherProfile = useCallback((id) => {
    goOtherProfileCreator(goPanel, setActiveStory, showErrorAlert, OtherProfileData, dispatch, id)
  }, [dispatch, goPanel, OtherProfileData, setActiveStory])
  
  const goBack = useCallback(() => {
    const history = [...historyPanelsState]
    if (!ignore_back) {
      ignore_back = true;
      if (history.length === 1) {
        bridge.send("VKWebAppClose", { "status": "success" });
      } else if (history.length > 1) {

        if (activePanel === 'load') {
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

  useEffect(() => {
    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', handlePopstate);
    dispatch(viewsActions.setNeedEpic(true))
    if ("help" in hash && !ignore_promo) {
      ignore_promo = true
      goPanel('faqMain');
    }

    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch, goPanel])

  const callbacks = { setPopout, setReport, showErrorAlert, setActiveModal, goOtherProfile, goPanel }
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
      />
    </ModalRoot>
  )
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      modal={modal}
      history={historyPanelsState}
      onSwipeBack={() => window.history.back()}
      popout={popout}
    >
      <Advice id="advice" 
        callbacks={callbacks} />
      <Premium id="premium"
        callbacks={callbacks}
        reloadProfile={props.reloadProfile} />

      <Donuts id="donuts"
      setActiveStory={setActiveStory}
        callbacks={callbacks} />
      <TestingAgents 
      id="testingagents"
      callbacks={callbacks}
      />
      
      <FaqMain id="faqMain"
      callbacks={callbacks}
      />
      <FaqQuestions id='faqQuestions'
      callbacks={callbacks} />

      <FaqCreateCategory id='faqCreateCategory'
      callbacks={callbacks} />
      <FaqCreateQuestion id='faqCreateQuestion' 
      callbacks={callbacks}
      />
      <FaqQuestion id='faqQuestion' 
      callbacks={callbacks} />

      <OtherProfile id="other_profile"
        callbacks={callbacks} />

      <Reports id="report"
        id_rep={id_rep}
        typeres={typeres}
        callbacks={callbacks} />
    </View>
  )

}