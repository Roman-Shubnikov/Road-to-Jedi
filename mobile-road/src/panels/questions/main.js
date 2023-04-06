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
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  const { goTiket } = props.base_functions;
  
  return(
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >
      <QuestionsMain id='questions'
        goTiket={goTiket}/>
      <NewTicket id='new_ticket'
      reloadProfile={props.reloadProfile} />
      <Tiket id="ticket" />
      <OtherProfile id="other_profile" />
      <Reports id="report" />
      <AnswerAdded id="answer_added" />
    </View>
  )
}