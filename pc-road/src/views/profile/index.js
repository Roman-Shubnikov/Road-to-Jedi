import React from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import {
  Home,
} from './panels';
import { useSelector } from 'react-redux';

export const Profile = props => {
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)

  return (
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >
      <Home id='home' />
    </View>
  )
}