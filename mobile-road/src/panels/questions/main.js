import React from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import { NewTicketPanel, QuestionsPanel } from './panels';
import { Ticket }          from '../../components/tiket';
import { OtherProfile }   from '../../components/other_profile'
import { ReportPanel }        from '../../components/report';
import { FinalAnswerPanel }    from '../../components/AnswerAdded';
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
      <QuestionsPanel id='questions'
        goTicket={goTiket}/>
      <NewTicketPanel id='new_ticket'
      reloadProfile={props.reloadProfile} />
      <Ticket id="ticket" />
      <OtherProfile id="other_profile" />
      <ReportPanel id="report" />
      <FinalAnswerPanel id="answer_added" />
    </View>
  )
}