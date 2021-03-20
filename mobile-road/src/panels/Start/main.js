import React, {useCallback, useState, useEffect} from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
  Alert,
  View,
  ScreenSpinner,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Startov from './panels/start';
import Startov2 from './panels/start2';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../store/main';

var ignore_back = false;

export default props => {
  const [activePanel, setActivePanel] = useState('start');
  const [popout, setPopout] = useState(null);
  const [historyPanelsState, setHistory] = useState(['questions']);
  const dispatch = useDispatch();
  const account = useSelector((state) => state.account.account)
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])


  const goBack = useCallback(() => {
    const history = [...historyPanelsState]
    if (!ignore_back) {
      ignore_back = true;
      if (history.length === 1) {
        bridge.send("VKWebAppClose", { "status": "success" });
      } else if (history.length > 1) {

        if (activePanel === 'load') {
          bridge.send('VKWebAppDisableSwipeBack');
        }
        history.pop()
        setActivePanel(history[history.length - 1])
        setPopout(<ScreenSpinner />)
        setTimeout(() => {
          setPopout(null)
        }, 500)
      }
      setHistory(history)
      setTimeout(() => { ignore_back = false; }, 500)

    } else {
      window.history.pushState({ panel: history[history.length - 1] }, history[history.length - 1]);
    }
  }, [setPopout, activePanel, historyPanelsState])

  const handlePopstate = useCallback((e) => {
    e.preventDefault();
    goBack();
  }, [goBack])
  const goPanel = useCallback((panel) => {
    let history = [...historyPanelsState];
    history.push(panel)
    window.history.pushState({ panel: panel }, panel);
    if (panel === 'questions') {
      bridge.send('VKWebAppEnableSwipeBack');
    }
    setHistory(history);
    setActivePanel(panel)
  }, [historyPanelsState])
  const showErrorAlert = (error = null, action = null) => {
    setPopout(
      <Alert
        actionsLayout="horizontal"
        actions={[{
          title: 'Отмена',
          autoclose: true,
          mode: 'cancel',
          action: action,
        }]}
        onClose={() => setPopout(null)}
        header="Ошибка"
        text={error ? `${error}` : "Что-то пошло не так, попробуйте снова!"}
      />
    )
  }

  useEffect(() => {
    bridge.send('VKWebAppEnableSwipeBack');
    window.addEventListener('popstate', handlePopstate);
    dispatch(viewsActions.setNeedEpic(false))
    return () => {
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [dispatch, handlePopstate])
  const callbacks = { setPopout, goPanel, showErrorAlert, reloadProfile: props.reloadProfile, setActiveStory }
  return (
    <View
      id={props.id}
      activePanel={activePanel}
      popout={popout}
      history={historyPanelsState}
      onSwipeBack={() => window.history.back()}
    >
      <Startov id='start' callbacks={callbacks} account={account} />
      <Startov2 id='start2' callbacks={callbacks} account={account} />
    </View>
  )
}