import React from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Startov from './panels/ban';
import { useSelector } from 'react-redux';

export default props => {
  const BanObject = useSelector((state) => state.account.banInfo)
  return (
    <View
      id={props.id}
      activePanel={'ban'}
    >
      <Startov id='ban' BanObject={BanObject} />
    </View>
  )
}