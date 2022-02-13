import React from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import NewTicket      from './panels/new_tiket'
import QuestionsMain      from './panels/questions'
import Tiket          from '../../components/tiket';
import OtherProfile   from '../../components/other_profile'
import Reports        from '../../components/report';
import AnswerAdded    from '../../components/AnswerAdded';
//Импортируем модальные карточки
import { useSelector } from 'react-redux';

export const Questions = props => {
  const { goPanel } = props.navigation;
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  const {showAlert, showErrorAlert, setActiveModal, setPopout} = props.popouts_and_modals;
  const { setReport, goTiket, goOtherProfile } = props.base_functions;
    
  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, goTiket, setActiveModal, showAlert, goOtherProfile }
  
  
  return(
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >
      <QuestionsMain id='questions'
        callbacks={callbacks}/>
      <NewTicket id='new_ticket'
      navigation={props.navigation}
      callbacks={callbacks}
      reloadProfile={props.reloadProfile} />
      <Tiket id="ticket" 
        callbacks={callbacks} />
      <OtherProfile id="other_profile"
        callbacks={callbacks} />
      <Reports id="report" callbacks={callbacks} />
      <AnswerAdded id="answer_added" />
    </View>
  )
}