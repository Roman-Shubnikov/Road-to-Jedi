import React, { useCallback } from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';
// Импортируем панели
import OtherProfile from '../../components/other_profile';
import Tiket        from '../../components/tiket';
import Reports      from '../../components/report';
import AnswerAdded    from '../../components/AnswerAdded';

import { useDispatch, useSelector } from 'react-redux';
import { moderationActions } from '../../store/main';
import { API_URL } from '../../config';
import { RequestsMain } from './panels';



export const MRequests = props => {
  const dispatch = useDispatch();
  const setModerationData = useCallback((state) => dispatch(moderationActions.setData(state)), [dispatch])
  const { moderationData } = useSelector((state) => state.moderation)
  const { setReport, goTiket, goOtherProfile } = props.base_functions;
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  const { showAlert, showErrorAlert, setActiveModal, setPopout} = props.popouts_and_modals;
  const { goPanel, goDisconnect } = props.navigation;


  const callbacks = { setPopout, goPanel, showErrorAlert, goTiket, setActiveModal, 
    goOtherProfile, setReport, showAlert, setModerationData}
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >
      <RequestsMain id='requests'
      navigation={props.navigation} />

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