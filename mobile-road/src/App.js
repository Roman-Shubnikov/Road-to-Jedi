import React, { useCallback, useEffect, useRef, useState } from 'react'; // React
import {useDispatch, useSelector} from "react-redux";
import bridge from '@vkontakte/vk-bridge'; // VK Brige

// import music from './music/Soloriver.mp3';
import { API_URL } from "./config";

import { 
  ScreenSpinner,
  Tabbar,
  TabbarItem,
  Epic,
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  VKCOM,
  ViewWidth,
  SplitLayout,
  SplitCol,
  Panel,
  PanelHeader,
  Group,
  Root,
  Platform,
  ViewHeight,
  usePlatform,
  useAdaptivity,
  Alert,
  Badge,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './styles/style.css'
import {accountActions, viewsActions} from './store/main'
// Импортируем панели
import Questions      from './panels/questions/main';
import Advice         from './panels/Advice/main';
import Top            from './panels/topUsers/main';
import Notification   from './panels/notify/main';
import Profile        from './panels/Profile/main';
import Start          from './panels/Start/main';
import Banned         from './panels/Banned/main';
import LoadingScreen  from './panels/Loading/main';
import Unsupport      from './panels/Unsupport/main';
import Disconnect     from './panels/Disconnect/main';
import Moderation     from './panels/Moderation/main';

import {
  Icon28CompassOutline,
  Icon28WorkOutline,
  Icon28ArticleOutline,
  Icon28Profile,
  Icon28BankOutline,

} from '@vkontakte/icons'

import EpicItemPC from './components/EpicItem';
import { isEmptyObject } from 'jquery';


const queryString = require('query-string');
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);

function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}
var DESKTOP_SIZE = 1000;
var TABLET_SIZE = 900;
var SMALL_TABLET_SIZE = 768;
var MOBILE_SIZE = 320;
var MOBILE_LANDSCAPE_HEIGHT = 414;
var MEDIUM_HEIGHT = 720;
var ignore_promo = false;


function calculateAdaptivity(windowWidth, windowHeight) {
  var viewWidth = ViewWidth.SMALL_MOBILE;
  var viewHeight = ViewHeight.SMALL;

  if (windowWidth >= DESKTOP_SIZE) {
    viewWidth = ViewWidth.DESKTOP;
  } else if (windowWidth >= TABLET_SIZE) {
    viewWidth = ViewWidth.TABLET;
  } else if (windowWidth >= SMALL_TABLET_SIZE) {
    viewWidth = ViewWidth.SMALL_TABLET;
  } else if (windowWidth >= MOBILE_SIZE) {
    viewWidth = ViewWidth.MOBILE;
  } else {
    viewWidth = ViewWidth.SMALL_MOBILE;
  }

  if (windowHeight >= MEDIUM_HEIGHT) {
    viewHeight = ViewHeight.MEDIUM;
  } else if (windowHeight > MOBILE_LANDSCAPE_HEIGHT) {
    viewHeight = ViewHeight.SMALL;
  } else {
    viewHeight = ViewHeight.EXTRA_SMALL;
  }
  return {
    viewWidth: viewWidth,
    viewHeight: viewHeight,
  };
}

const App = () => {
  const [popout, setPopout] = useState(() => <ScreenSpinner/>);
  const [LoadWebView, setLoadWebView] = useState(false);
  const dispatch = useDispatch();
  const { account, schemeSettings } = useSelector((state) => state.account)
  const { scheme, default_scheme } = schemeSettings;
  const activeStory = useSelector((state) => state.views.activeStory)
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const setBanObject = useCallback((payload) => dispatch(accountActions.setBanObject(payload)), [dispatch])
  const setScheme = useCallback((payload) => dispatch(accountActions.setScheme(payload)), [dispatch])
  const need_epic = useSelector((state) => state.views.need_epic)
  // const adress_token = "vk_access_token_settings=&vk_app_id=7409818&vk_are_notifications_enabled=0&vk_is_app_user=1&vk_is_favorite=0&vk_language=ru&vk_platform=desktop_web&vk_ref=other&vk_ts=1614870020&vk_user_id=413636725&sign=jlrDcgr_3Eru2vMajX5MJZYEk-XYZ51RBmbQ4ce8B1I";

  const fetchAccount = useCallback(() => {
    fetch(API_URL + "method=account.get&" + window.location.search.replace('?', ''))
    .then(res => res.json())
    .then(data => {
    setPopout(null)
    if(data.result) {
      dispatch(accountActions.setAccount(data.response))
    }else{
      if (data.error.error_code !== 5){
        setPopout(
          <Alert
          actionsLayout="horizontal"
          actions = {
            [{
              title: 'Отмена',
              autoclose: true,
              mode: 'cancel',
              action: () => AppInit(),
            }]}
          onClose = {() => {setPopout(null);AppInit()}}
          header = "Ошибка"
            text={ data.error.message }>
            
          </Alert>
        )
      } else {
        setBanObject(data.error.error_obj)
        setActiveStory('banned')
        setLoadWebView(true)
      }
      dispatch(viewsActions.setActiveStory('disconnect'))
      }
    })
    .catch(err => {
      dispatch(viewsActions.setActiveStory('disconnect'))

    })
    // eslint-disable-next-line 
  }, [account, activeStory, default_scheme, dispatch, setActiveStory])

  const AppInit = useCallback(() => {
    setBanObject(null);
    fetchAccount()
    if( activeStory === 'disconnect'){
      setActiveStory('questions')
    }
    
    
  }, [fetchAccount, setBanObject, setActiveStory, activeStory])

  const bridgecallback = useCallback(({ detail: { type, data } }) => {
    if (type === 'VKWebAppViewHide') {
      console.log('closing...')
    }
    if (type === 'VKWebAppViewRestore') {
      AppInit();
    }
    if (type === 'VKWebAppUpdateConfig') {
      setScheme({ ...schemeSettings, default_scheme: data.scheme })
      
    }
  }, [AppInit, setScheme, schemeSettings])
  useEffect(() => {
    if (!isEmpty(account)) {
      switch (Number(account.scheme)) {
        case 0:
          setScheme({ scheme: default_scheme })
          if (platformname) {
            switch (default_scheme) {
              case 'bright_light':
                bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF" });
                break;
              case 'space_gray':
                bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "light", "action_bar_color": "#19191A", 'navigation_bar_color': "#19191A" });
                break;
              default:
                bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF" });
            }
          }
          break;
        case 1:
          setScheme({ scheme: 'bright_light' })
          if (platformname) {
            bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF" });
          }
          break;
        case 2:
          setScheme({ scheme: 'space_gray' })
          if (platformname) {
            bridge.send("VKWebAppSetViewSettings", { "status_bar_style": "light", "action_bar_color": "#19191A", 'navigation_bar_color': "#19191A" });
          }
          break;
        default:
          
      }
    }
  }, [account, default_scheme, setScheme])
  useEffect(() => {
    AppInit();
    bridge.send('VKWebAppInit', {});
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    if(!isEmptyObject(account)){
      if (account.is_first_start) { 
        setActiveStory('start')
      }else{
        if (hash.promo !== undefined && !ignore_promo) {
          ignore_promo = true;
          setActiveStory('profile');
        }
        if (activeStory === 'loading' || activeStory === 'start'){
          setActiveStory('questions');
        }
        
      }
      setLoadWebView(true)
      // if(activeStory !== 'disconnect'){
      //   dispatch(viewsActions.setNeedEpic(true))
      // }
    }
    
  }, [account, dispatch, setActiveStory, activeStory])
  useEffect(() => {
    bridge.subscribe(bridgecallback);
    
    return () => bridge.unsubscribe(bridgecallback);
  }, [account, bridgecallback])
  
  const platformwithPlat = usePlatform();
  const platform = useRef();
  const viewWidth = useAdaptivity().viewWidth;
  const isDesktop = useRef();
  const hasHeader = useRef()
  
  useEffect(() => {
    if (platformname) {
      platform.current = platformwithPlat;
    } else {
      platform.current = Platform.VKCOM;
    }
  }, [platformwithPlat])

  
  useEffect(() => {
    hasHeader.current = platform.current !== VKCOM;
    isDesktop.current = viewWidth >= ViewWidth.SMALL_TABLET;
  }, [viewWidth, platform])

  return(
    <>
        {!LoadWebView ? <div style={{width: '100vw', height: '100vh', backgroundColor: 'var(--background_page_my)', zIndex: 20, position: 'absolute', textAlign:'center'}}>
            <h1 style={{margin: '50vh 0'}}>Загрузка...</h1>
            </div> : null}
          <webview 
          onLoad={() => {setLoadWebView(true);document.body.style.overflow = "auto"}}
          >

            
        <ConfigProvider scheme={scheme}
              platform={platform.current}
              > 
              <AppRoot>
                <SplitLayout
              header={hasHeader.current && <PanelHeader separator={false} />}
                style={{ justifyContent: "center" }}>

              {isDesktop.current && need_epic && (<SplitCol fixed width="280px" maxWidth="280px">
                    <Panel>
                  {hasHeader.current && <PanelHeader/>}
                      <Group>
                        <EpicItemPC
                        icon={<Icon28ArticleOutline />}
                        story="questions"
                        activeStory={activeStory}
                        changeActiveStory={setActiveStory}>
                          Вопросы
                        </EpicItemPC>
                        <EpicItemPC
                        icon={<Icon28CompassOutline />}
                        story="advice"
                        activeStory={activeStory}
                        changeActiveStory={setActiveStory}>
                          Обзор
                        </EpicItemPC>
                        <EpicItemPC
                        icon={<Icon28BankOutline />}
                        story="top"
                        activeStory={activeStory}
                        changeActiveStory={setActiveStory}>
                          Пантеон
                        </EpicItemPC>
                        {account.special && 
                        <EpicItemPC
                        icon={<Icon28WorkOutline />}
                        story="moderation"
                        activeStory={activeStory}
                        changeActiveStory={setActiveStory}>
                          Модерация
                        </EpicItemPC>}
                        <EpicItemPC
                        icon={<Icon28Profile />}
                        story="profile"
                        activeStory={activeStory}
                        badge={account.notif_count ? <Badge mode="prominent" /> : null}
                        changeActiveStory={setActiveStory}>
                        
                          Профиль
                        </EpicItemPC>
                      </Group>
                      
                    </Panel>
                  </SplitCol>)}

                  <SplitCol
                animate={!isDesktop.current}
                spaced={isDesktop.current}
                width={isDesktop.current ? '560px' : '100%'}
                maxWidth={isDesktop.current ? '560px' : '100%'}
                  >
                {!isDesktop.current ? <Epic activeStory={activeStory}
                      tabbar={
                        need_epic && !isDesktop.current &&
                        <Tabbar>
                          <TabbarItem
                            onClick={(e) => {setActiveStory(e.currentTarget.dataset.story)}} 
                            selected={activeStory === 'questions'}
                            data-story="questions"
                            text='Вопросы'
                          ><Icon28ArticleOutline/></TabbarItem>
                          <TabbarItem
                            onClick={(e) => {setActiveStory(e.currentTarget.dataset.story)}} 
                            selected={activeStory === 'advice'}
                            data-story="advice"
                            text='Обзор'
                          ><Icon28CompassOutline/></TabbarItem>
                          <TabbarItem
                            onClick={(e) => {setActiveStory(e.currentTarget.dataset.story)}} 
                            selected={activeStory === 'top'}
                            data-story="top"
                            text='Пантеон'
                          ><Icon28BankOutline /></TabbarItem>
                          {account.special ? <TabbarItem
                            onClick={(e) => {setActiveStory(e.currentTarget.dataset.story)}} 
                            selected={activeStory === 'moderation'}
                            data-story="moderation"
                            text='Модерация'
                          ><Icon28WorkOutline /></TabbarItem> : null}
                          <TabbarItem
                            indicator={account.notif_count ? <Badge mode="prominent" /> : null}
                            onClick={(e) => {setActiveStory(e.currentTarget.dataset.story)}} 
                            selected={activeStory === 'profile' || activeStory === "notif"}
                            data-story="profile"
                            text='Профиль'
                          ><Icon28Profile /></TabbarItem>
                          
                        </Tabbar>
                      }
                      >
                      <Questions 
                      id='questions'
                      scheme={scheme}
                      reloadProfile={fetchAccount}
                      popout={popout} />

                      <Advice 
                      id="advice"
                      reloadProfile={fetchAccount}
                      popout={popout} />

                      <Top 
                      id='top'
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      popout={popout} />

                      <Notification 
                      id="notif"
                      scheme={scheme}
                      reloadProfile={fetchAccount}
                      popout={popout}
                      />

                      <Profile 
                      id="profile"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      default_scheme={default_scheme}
                      popout={popout} />

                      <Moderation 
                      id="moderation"
                      reloadProfile={fetchAccount}
                      />
                      
                      <Start 
                      id="start"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      popout={popout} />

                      <Banned 
                      id="banned"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      popout={popout} />

                      <Unsupport 
                      id="unsupport"
                      reloadProfile={fetchAccount} />

                      <Disconnect
                      id="disconnect"
                      popout={popout}
                      setPopout={setPopout}
                      AppInit={AppInit}
                      reloadProfile={fetchAccount} />

                      <LoadingScreen 
                      id="loading" />
                    </Epic>
                     : 
                    <Root activeView={activeStory}>
                      <Questions 
                      id='questions'
                      scheme={scheme}
                      reloadProfile={fetchAccount}
                      popout={popout} />

                      <Advice 
                      id="advice"
                      reloadProfile={fetchAccount}
                      popout={popout} />

                      <Top 
                      id='top'
                      scheme={scheme}
                      reloadProfile={fetchAccount}
                      popout={popout} />

                      <Notification 
                      id="notif"
                      scheme={scheme}
                      reloadProfile={fetchAccount}
                      popout={popout}
                      />

                      <Profile 
                      id="profile"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      default_scheme={default_scheme}
                      popout={popout} />

                      <Moderation 
                      id="moderation"
                      reloadProfile={fetchAccount}
                      />
                      
                      <Start 
                      id="start"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      popout={popout} />

                      <Banned 
                      id="banned"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      popout={popout} />

                      <Unsupport 
                      id="unsupport"
                      reloadProfile={fetchAccount} />

                    <Disconnect
                      id="disconnect"
                      popout={popout}
                      setPopout={setPopout}
                      AppInit={AppInit}
                      reloadProfile={fetchAccount} />
                      <LoadingScreen 
                      id="loading" />
                      
                    </Root>
                    
                    }
                  </SplitCol>
                </SplitLayout>
              </AppRoot>
            </ConfigProvider>
            
          </webview>
          </>
  )

}

export default () => (
  <AdaptivityProvider viewWidth={ calculateAdaptivity( document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
    <App />
  </AdaptivityProvider>
);
