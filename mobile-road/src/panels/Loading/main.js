import React, { useEffect, useState, useCallback } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
  View,
  } from '@vkontakte/vkui';

import {viewsActions} from '../../store/main'

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Startov from './panels/home';
import { useDispatch } from 'react-redux';

var ignore_back = false;

export default props => {
  const [history, setHistory] = useState(['start']);
  const [activePanel, setActivePanel] = useState('load');
  const dispatch = useDispatch();


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
    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [dispatch, handlePopstate])
  return(
      <View 
      id={props.id}
      activePanel={activePanel}
      history={history}
      onSwipeBack={() => window.history.back()}
      >
        <Startov id='load' />
        {/* <Startov2 id='start2' account={this.props.account} this={this} /> */}
      </View>   
  )
}
