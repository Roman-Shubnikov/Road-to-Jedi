import React, { useEffect } from 'react'; // React

import { 
  View,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Startov from './panels/home';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../store/main';

export const Disconnect = props => {
  const dispatch = useDispatch();
  const { activePanel, historyPanelsView } = useSelector((state) => state.views)
  useEffect(() => {
    dispatch(viewsActions.setNeedEpic(false))
    return () => {
      dispatch(viewsActions.setNeedEpic(true))
    }
    }, [dispatch])
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      history={historyPanelsView}
      onSwipeBack={() => window.history.back()}
    >
      <Startov id='load' restart={props.AppInit} />
    </View>
  )
}