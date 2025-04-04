import React from 'react'; // React


import { 
  View
} from '@vkontakte/vkui';

// Импортируем панели
import { TopPanel } from './panels/top';
import { OtherProfile } from '../../components/other_profile';
import { ReportPanel } from '../../components/report';
import { useSelector } from 'react-redux';
export const Top = props => {
  const { goPanel } = props.navigation;
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  const {showAlert, showErrorAlert, setActiveModal, setPopout} = props.popouts_and_modals;
  const { setReport, goOtherProfile } = props.base_functions;
  const callbacks = { setPopout, goPanel, setReport, showErrorAlert, setActiveModal, showAlert, goOtherProfile}
  return(
    <View 
    id={props.id}
    activePanel={activePanel}
    history={historyPanelsView}
    onSwipeBack={() => window.history.back()}
    >
      <TopPanel id="top"
      navigation={props.navigation}
      callbacks={callbacks} />

      <OtherProfile id="other_profile"
      callbacks={callbacks} />

      <ReportPanel id="report" 
      callbacks={callbacks} /> 

    </View>   
  )
}