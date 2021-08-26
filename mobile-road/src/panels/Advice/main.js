import React from 'react'; // React

import { 
  View,
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
import { useSelector } from 'react-redux';

export default props => {
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
      <Advice id="advice"
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
      
      <FaqMain id="faqMain"
      navigation={props.navigation}
      callbacks={callbacks}
      />
      <FaqQuestions id='faqQuestions'
      navigation={props.navigation}
      callbacks={callbacks} />

      <FaqCreateCategory id='faqCreateCategory'
      navigation={props.navigation}
      callbacks={callbacks} />
      <FaqCreateQuestion id='faqCreateQuestion' 
      navigation={props.navigation}
      callbacks={callbacks}
      />
      <FaqQuestion id='faqQuestion' 
      navigation={props.navigation}
      callbacks={callbacks} />

      <OtherProfile id="other_profile"
        callbacks={callbacks} />

      <Reports id="report"
        callbacks={callbacks} />
    </View>
  )

}