import React from 'react'; // React

import {
  View,
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Prof           from './panels/profile';
import Market         from './panels/market';
import MYQuest        from './panels/AllQuestions';
import Settings       from './panels/settings';
import SchemeChange   from './panels/schemechange';
import Info           from './panels/info'
import Verfy          from './panels/verfy'
import Promocodes     from './panels/promocode';
import Tiket          from '../../components/tiket';
import OtherProfile   from '../../components/other_profile'
import Reports        from '../../components/report';
import AnswerAdded    from '../../components/AnswerAdded';
import Notify         from './panels/notif';

import { useSelector } from 'react-redux';

import { 
  FaqMain,
  CreateQuestion as FaqCreateQuestion,
  CreateCategory as FaqCreateCategory,
  Question as FaqQuestion,
  QuestionsList as FaqQuestions,

} from './panels/faq';

export const Profile = props => {
  const { setReport, goTiket, goOtherProfile, setMoneyPromo, setSnackbar, setTransfer } = props.base_functions;
  const { goPanel } = props.navigation;
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  const { showAlert, showErrorAlert, setActiveModal, setPopout} = props.popouts_and_modals;

  const openMoneyTransfer = (avatar, text, comment, type) => {
    setTransfer({
      type: type,
      avatar: avatar,
      text: text,
      comment: comment ? comment : (type === 'money_transfer_send') ? '' : 'Агент не оставил комментария 😢'
    })
    setActiveModal('transfer_info')
  }
  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, goTiket, setActiveModal, showAlert, goOtherProfile, setSnackbar, openMoneyTransfer }
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >

      <Prof id="profile"
      marks_manage={props.marks_manage}
      navigation={props.navigation}
      reloadProfile={props.reloadProfile}
      callbacks={callbacks} />

      <MYQuest id="qu"
      navigation={props.navigation}
        callbacks={callbacks} />

      <Notify 
      id='notify'
      base_functions={props.base_functions}
      reloadProfile={props.reloadProfile}
      callbacks={callbacks}
      />

      <Market id="market"
        navigation={props.navigation}
        reloadProfile={props.reloadProfile}
        callbacks={callbacks} />

      <Settings id="settings"
        callbacks={callbacks}
        navigation={props.navigation}
        reloadProfile={props.reloadProfile} />

      <SchemeChange id="schemechange"
      navigation={props.navigation}
      reloadProfile={props.reloadProfile}
      callbacks={callbacks} />

      <Info id='info' />

      <Verfy id='verf'
      navigation={props.navigation}
        callbacks={callbacks} />

      <Promocodes id='promocodes'
        navigation={props.navigation}
        reloadProfile={props.reloadProfile}
        callbacks={callbacks}
        setMoneyPromo={setMoneyPromo} />

      <Tiket id="ticket"
      callbacks={callbacks} />

      <OtherProfile id="other_profile"
      callbacks={callbacks} />

      <Reports id="report"
      callbacks={callbacks} />

      <AnswerAdded id="answer_added" />


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

    </View>
  )
}