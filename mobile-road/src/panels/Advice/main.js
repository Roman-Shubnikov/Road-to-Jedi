import React from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

// Импортируем панели
import AdviceMain             from './panels/adv';
import Donuts             from './panels/donuts';
import Premium            from './panels/premium';
import OtherProfile       from '../../components/other_profile';
import Reports            from '../../components/report';
import TestingAgents from './panels/testbyagent';
import { useSelector } from 'react-redux';

export const Advice = props => {
  const {showErrorAlert, setActiveModal, setPopout} = props.popouts_and_modals;
  const { setReport, goOtherProfile } = props.base_functions;
  const { goPanel } = props.navigation;
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  const callbacks = { setPopout, setReport, showErrorAlert, setActiveModal, goOtherProfile, goPanel }
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >
      <AdviceMain id="advice"
        navigation={props.navigation}
        callbacks={callbacks} />
      <Premium id="premium"
        navigation={props.navigation}
        callbacks={callbacks}
        reloadProfile={props.reloadProfile} />

      <Donuts id="donuts"
      goPanel={goPanel}
        callbacks={callbacks} />
      <TestingAgents 
      id="testingagents"
      navigation={props.navigation}
      callbacks={callbacks}
      />

      <OtherProfile id="other_profile"
        callbacks={callbacks} />

      <Reports id="report"
        callbacks={callbacks} />
    </View>
  )

}