import React, { useEffect } from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

import {viewsActions} from '../../store/main'

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Startov from './panels/home';
import { useDispatch } from 'react-redux';

export const LoadingScreen = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(viewsActions.setNeedEpic(false))
    return () => {
      dispatch(viewsActions.setNeedEpic(true))
    }
  }, [dispatch])
  return(
      <View 
      id={props.id}
      activePanel={'load'}
      >
        <Startov id='load' />
      </View>   
  )
}
