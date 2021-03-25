import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  View,
  ScreenSpinner,
  ModalRoot,
  } from '@vkontakte/vkui';

// Импортируем панели
import Top from './panels/top';
import OtherProfile from '../../components/other_profile';
import Report from '../../components/report';

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut';
import ModalVerif from '../../Modals/Verif';
import ModalBan from '../../Modals/Ban';
import { useDispatch, useSelector } from 'react-redux';
import { alertCreator, errorAlertCreator, goOtherProfileCreator, goPanelCreator, setActiveModalCreator } from '../../Utils';
import { viewsActions } from '../../store/main';
var ignore_back = false;
export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const [popout, setPopout] = useState(null);
  const [historyPanelsState, setHistory] = useState(['top']);
  const [activePanel, setActivePanel] = useState('top');
  const [activeModal, setModal] = useState(null);
  const [typeres, setTyperes] = useState(0);
  const [id_rep, setIdRep] = useState(0);
  const [modalHistory, setModalHistory] = useState(null);
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
        bridge.send("VKWebAppClose", { "status": "success" });
      } else if (history.length > 1) {

        if (activePanel === 'top') {
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
  
  useEffect(() => {
    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', handlePopstate);

    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch, goPanel])


  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, setActiveModal, showAlert, goOtherProfile}
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
      <Top id="top"
      callbacks={callbacks} />

      <OtherProfile id="other_profile"
      callbacks={callbacks} />

      <Report id="report" 
      callbacks={callbacks} 
      typeres={typeres} 
      id_rep={id_rep} /> 

    </View>   
  )
}