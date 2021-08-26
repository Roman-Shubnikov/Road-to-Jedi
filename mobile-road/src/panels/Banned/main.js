import React from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Startov from './panels/ban';


export default props => {
  return (
    <View
      id={props.id}
      activePanel={'ban'}
    >
      <Startov id='ban' />
    </View>
  )
}