import React from 'react'; // React

import {
  View,
} from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import { Ticket }          from '../../components/tiket';
import { OtherProfile }   from '../../components/other_profile'
import { ReportPanel }        from '../../components/report';
import { FinalAnswerPanel }    from '../../components/AnswerAdded';
import {
  FaqMain,
  CreateQuestion as FaqCreateQuestion,
  CreateCategory as FaqCreateCategory,
  Question as FaqQuestion,
  QuestionsList as FaqQuestions,

  VerifyPanel,
  PromocodesPanel,
  NotifyPanel,
  MyAnswersPanel,
  InfoPanel,
  Achievements,
  MarketPanel,
  ProfilePanel,
  SettingsPanel,
} from './panels';

import { useSelector } from 'react-redux';


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

      <ProfilePanel id="profile"
      marks_manage={props.marks_manage}
      navigation={props.navigation}
      reloadProfile={props.reloadProfile}
      callbacks={callbacks} />

      <MyAnswersPanel id="qu"
      navigation={props.navigation}
        callbacks={callbacks} />

      <NotifyPanel 
      id='notify'
      base_functions={props.base_functions}
      reloadProfile={props.reloadProfile}
      callbacks={callbacks}
      />
      <Achievements id='achievements'
      navigation={props.navigation}
      reloadProfile={props.reloadProfile}
      callbacks={callbacks}
      />
      <MarketPanel id="market"
        navigation={props.navigation}
        reloadProfile={props.reloadProfile}
        callbacks={callbacks} />

      <SettingsPanel id="settings"
        callbacks={callbacks}
        navigation={props.navigation}
        reloadProfile={props.reloadProfile} />

      <InfoPanel id='info' />

      <VerifyPanel id='verf'
      navigation={props.navigation}
        callbacks={callbacks} />

      <PromocodesPanel id='promocodes'
        navigation={props.navigation}
        reloadProfile={props.reloadProfile}
        callbacks={callbacks}
        setMoneyPromo={setMoneyPromo} />

      <Ticket id="ticket"
      callbacks={callbacks} />

      <OtherProfile id="other_profile"
      callbacks={callbacks} />

      <ReportPanel id="report"
      callbacks={callbacks} />

      <FinalAnswerPanel id="answer_added" />

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