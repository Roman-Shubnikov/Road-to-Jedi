import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { viewsActions } from "../store/main";
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import { sendHit } from "../metrika";
import { alertCreator, errorAlertCreator } from "../Utils";
import { viewsStructure } from "../config";
import { ScreenSpinner, Snackbar } from "@vkontakte/vkui";
import {
  Icon28CheckCircleFill,
  Icon28CancelCircleFillRed,
} from '@vkontakte/icons';
const queryString = require('query-string');


export const useNavigation = () => {
    const dispatch = useDispatch();
    const { activeStory, historyPanels, snackbar, activePanel, popout } = useSelector((state) => state.views)
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
    const setActiveScene = useCallback((story, panel) => dispatch(viewsActions.setActiveScene(story, panel)), [dispatch]);
    const setPopout = useCallback((popout) => dispatch(viewsActions.setPopout(popout)), [dispatch]);
    const setHistoryPanels = useCallback((history) => dispatch(viewsActions.setHistory(history)), [dispatch]);
    const setSnackbar = useCallback((payload) => dispatch(viewsActions.setSnackbar(payload)), [dispatch])
    const hash = useMemo(() => queryString.parse(window.location.hash), []);

    const setHash = (hash) => {
      bridge.send("VKWebAppSetLocation", { "location": hash });
      window.location.hash = "#"+hash;
    }
    const setBigLoader = (state=true) => {
      if(state) return setPopout(<ScreenSpinner />);
      setPopout(null);
    }
    const getSimpleSnack = useCallback((text, icon) => {
      setSnackbar(
        <Snackbar
        onClose={() => setSnackbar(null)}
        before={icon}>
          {text}
        </Snackbar>
      )
    }, [setSnackbar])
    const setSuccessfulSnack = useCallback((text) => {
      getSimpleSnack(text, <Icon28CheckCircleFill />);
    }, [getSimpleSnack])
    const setAbortSnack = useCallback((text) => {
      getSimpleSnack(text, <Icon28CancelCircleFillRed />);
    }, [getSimpleSnack])

    const goPanel = useCallback((view, panel, forcePanel=false, replaceState=false) => {
    
        const checkVisitedView = (view) => {
          let history = [...historyPanels];
          history.reverse();
          let index = history.findIndex(item => item.view === view)
          if(index !== -1) {
           return history.length - index
          } else {
            return null;
          }
        }
        const historyChange = (history, view, panel, replaceState) => {
          if(replaceState){
            history.pop();
            history.push({view, panel });
            window.history.replaceState({ view, panel }, panel);
          } else {
            history.push({view, panel });
            window.history.pushState({ view, panel }, panel);
          }
          return history;
        }
        if(view === null) view = activeStory;
        let history = [...historyPanels];
        if(forcePanel){
          history = historyChange(history, view, panel, replaceState)
        }else{
          let index = checkVisitedView(view);
          if(index !== null){
            let new_history = history.slice(0, index);
            history = new_history
            window.history.pushState({ view, panel }, panel);
            ({view, panel} = history[history.length - 1])
          } else {
            history = historyChange(history, view, panel, replaceState)
          }
        }
        setHistoryPanels(history);
        setActiveScene(view, panel)
        bridge.send('VKWebAppEnableSwipeBack');
        sendHit(view+'_'+panel);
      }, [setActiveScene, historyPanels, activeStory, setHistoryPanels])
    
    const showAlert = (title, text) => {
        alertCreator(setPopout, title, text)
    }
    const showErrorAlert = (error = null, action = null) => {
        errorAlertCreator(setPopout, error, action)
      }
    const goDisconnect = useCallback((e=null) => {
        console.log(e)
        dispatch(viewsActions.setGlobalError(e))
        goPanel(viewsStructure.Disconnect.navName, viewsStructure.Disconnect.panels.homepanel, true);
    }, [dispatch, goPanel])
    return {
      setAbortSnack,
      setSuccessfulSnack,
      getSimpleSnack,
      setHash,
      goPanel,
      goDisconnect,
      setSnackbar,
      setPopout,
      setBigLoader,
      showAlert,
      showErrorAlert,
      setActiveStory,
      activePanel,
      snackbar,
      activeStory,
      historyPanels,
      hash,
      popout,
    }
}