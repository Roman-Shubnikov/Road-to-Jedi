import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,
  Button,


  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Questions    from './panels/panelconstruct';
import OtherProfile from '../../components/other_profile';
import Tiket        from '../../components/tiket';
import Reports      from '../../components/report';

//Импортируем модальные карточки
import ModalPrometay  from '../../Modals/Prometay';
import ModalDonut     from '../../Modals/Donut';
import ModalComment   from '../../Modals/Comment';
import ModalVerif     from '../../Modals/Verif';
import ModalBan       from '../../Modals/Ban';


import Icon28SortOutline          from '@vkontakte/icons/dist/28/sort_outline';
import { alertCreator, enumerate, errorAlertCreator, goOtherProfileCreator, goPanelCreator, setActiveModalCreator } from '../../Utils';
import { useDispatch, useSelector } from 'react-redux';
import { moderationActions, viewsActions } from '../../store/main';
import { API_URL, SPECIAL_NORM } from '../../config';

var ignore_back = false;
var types = {
  'answers': "method=special.getNewMessages&",
  'generator': "method=special.getNewModerationTickets&",
  'verification': "method=admin.getVerificationRequests&",
  'reports': "method=reports.getReports&",
}

export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const setModerationData = useCallback((state) => dispatch(moderationActions.setData(state)), [dispatch])
  const { moderationData } = useSelector((state) => state.moderation)
  const [modalHistory, setModalHistory] = useState(null);
  const [historyPanelsState, setHistory] = useState(['questions']);
  const [popout, setPopout] = useState(null);
  const [activePanel, setActivePanel] = useState('questions');
  const [activeModal, setModal] = useState(null);
  const [typeres, setTyperes] = useState(0);
  const [id_rep, setIdRep] = useState(0);
  const [ticket_id, setTicket] = useState(null);
  const comment = useSelector((state) => state.tickets.comment)
  const {
    account,
    other_profile: OtherProfileData,
  } = useSelector((state) => state.account)

  const showErrorAlert = (error = null, action = null) => {
    errorAlertCreator(setPopout, error, action)
  }
  const showAlert = (title, text) => {
    alertCreator(setPopout, title, text)
  }
  const goPanel = useCallback((panel) => {
    goPanelCreator(setHistory, setActivePanel, historyPanelsState, panel)
    if (panel === 'questions') {
      bridge.send('VKWebAppEnableSwipeBack');
    }
  }, [historyPanelsState])

  const goTiket = useCallback((id) => {
    setPopout(<ScreenSpinner />)
    setTicket(id)
    goPanel('ticket');
    setPopout(null);
  }, [goPanel, setPopout])

  const setReport = (typeres, id_rep) => {
    setTyperes(typeres);
    setIdRep(id_rep);
    goPanel("report")
  }

  const getInfo = (typeData, need_offset=false) => {
    let method = types[typeData];
    let MainData = {...moderationData}
    let currentData = {...MainData[typeData]};

    if (!need_offset) {
      currentData.offset = 20;
    }
    let offset = need_offset ? currentData.offset : 0;
    fetch(API_URL + method + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'offset': offset,
          'count': currentData.count,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          var sumData = [];
          if (currentData.data !== null) {
            if (!need_offset) {
              sumData = data.response;
            } else {
              sumData = data.response ? currentData.data.concat(data.response) : currentData.data;
            }
          } else {
            sumData = data.response
          }
          currentData.data = sumData;
          currentData.data_helper = data.response;

          if (need_offset) {
            currentData.offset += 20;
          }
          MainData[typeData] = currentData;
          setModerationData(MainData);
          setPopout(null);
        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        setActiveStory('disconnect')

      })
  }
  const setActiveModal = (activeModal) => {
    setActiveModalCreator(setModal, setModalHistory, modalHistory, activeModal)
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

    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch])

  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, goTiket, setActiveModal, goOtherProfile, showAlert, getInfo, setModerationData}
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

      <ModalCard
        id='answers'
        onClose={() => setActiveModal(null)}
        icon={<Icon28SortOutline width={56} height={56} />}
        header={'Вы оценили ' + account['marked'] + " " + enumerate(account['marked'], ['ответ', 'ответа', 'ответов'])}
        subheader={(SPECIAL_NORM - account['marked'] < 0) ? "Порог достигнут" : "Для преодоления порога необходимо оценить ещё " +
          (SPECIAL_NORM - account['marked']) +
          " " + enumerate(account['marked'], ['ответ', 'ответа', 'ответов']) + " за неделю"}
        actions={<Button mode='primary' stretched size='l' onClick={() => setActiveModal(null)}>Понятно</Button>}>
      </ModalCard>
      <ModalComment
        id='comment'
        onClose={() => setActiveModal(null)}
        comment={comment}
        reporting={setReport} />
    </ModalRoot>
  )
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      modal={modal}
      popout={popout}
      history={historyPanelsState}
      onSwipeBack={() => window.history.back()}
    >
      <Questions id="questions"
        callbacks={callbacks} />

      <OtherProfile id="other_profile"
      callbacks={callbacks} />

      <Tiket id="ticket"
        callbacks={callbacks}
        ticket_id={ticket_id} />

      <Reports id="report"
        callbacks={callbacks}
        id_rep={id_rep}
        typeres={typeres} />

    </View>
  )
}