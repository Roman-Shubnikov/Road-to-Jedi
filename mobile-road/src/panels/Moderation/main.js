import React, { useCallback } from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';
// Импортируем панели
import Questions    from './panels/panelconstruct';
import OtherProfile from '../../components/other_profile';
import Tiket        from '../../components/tiket';
import Reports      from '../../components/report';
import AnswerAdded    from '../../components/AnswerAdded';

import { useDispatch, useSelector } from 'react-redux';
import { moderationActions } from '../../store/main';
import { API_URL } from '../../config';

var types = {
  'answers': "special.getNewMessages",
  'generator': "special.getNewModerationTickets",
  'verification': "admin.getVerificationRequests",
  'reports': "reports.getReports",
}

export const Moderation = props => {
  const dispatch = useDispatch();
  const setModerationData = useCallback((state) => dispatch(moderationActions.setData(state)), [dispatch])
  const { moderationData } = useSelector((state) => state.moderation)
  const { setReport, goTiket, goOtherProfile } = props.base_functions;
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  const { showAlert, showErrorAlert, setActiveModal, setPopout} = props.popouts_and_modals;
  const { goPanel, goDisconnect } = props.navigation;

  const getInfo = (typeData, need_offset=false) => {
    let method = "method=" + types[typeData] + "&";
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
      .catch(goDisconnect)
  }

  const callbacks = { setPopout, goPanel, showErrorAlert, goTiket, setActiveModal, 
    goOtherProfile, setReport, showAlert, getInfo, setModerationData}
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >
      <Questions id="questions"
        callbacks={callbacks} />

      <OtherProfile id="other_profile"
      callbacks={callbacks} />

      <Tiket id="ticket"
        callbacks={callbacks} />

      <Reports id="report"
        callbacks={callbacks} />

      <AnswerAdded id="answer_added" />
    </View>
  )
}