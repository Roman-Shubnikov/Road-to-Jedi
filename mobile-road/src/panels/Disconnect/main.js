import React, { useState, useEffect, useCallback } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
  View,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Startov from './panels/home';
import { useDispatch } from 'react-redux';
import { viewsActions } from '../../store/main';

var ignore_back = false;

export default props => {
  const dispatch = useDispatch();
  const [activePanel, setActivePanel] = useState('load');
  const [history, setHistory] = useState(['load']);
  const setPopout = props.setPopout;
  const goBack = useCallback(() => {
    if (!ignore_back) {
      ignore_back = true;
      if (history.length === 1) {
        bridge.send("VKWebAppClose", { "status": "success" });
      } else if (history.length > 1) {
        setHistory(history => history.pop())
        if (activePanel === 'load') {
          bridge.send('VKWebAppDisableSwipeBack');
        }
        setActivePanel(history[history.length - 1])
      }
      setTimeout(() => { ignore_back = false; }, 500)

    } else {
      window.history.pushState({ panel: history[history.length - 1] }, history[history.length - 1]);
    }
  }, [history, activePanel])
  const handlePopstate = useCallback((e) => {
    e.preventDefault();
    goBack();
  }, [goBack])
  useEffect(() => {
    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', handlePopstate);
    dispatch(viewsActions.setNeedEpic(false))
    setPopout(null)
    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate, dispatch, setPopout])
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      popout={props.popout}
      history={history}
      onSwipeBack={() => window.history.back()}
    >
      <Startov id='load' restart={props.AppInit} />
    </View>
  )
}