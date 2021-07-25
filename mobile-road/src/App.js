import React, { useCallback, useEffect, useRef, useState } from 'react'; // React
import {useDispatch, useSelector} from "react-redux";
import bridge from '@vkontakte/vk-bridge'; // VK Brige

// import music from './music/Soloriver.mp3';
import { API_URL, LINK_APP, PERMISSIONS, POST_TEXTS, HISTORY_IMAGES } from "./config";

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
  ModalRoot,
  SimpleCell,
  Avatar,
  ModalPage,
  ModalPageHeader,
  IOS,
  ANDROID,
  Cell,
  Header,
  List,
  PanelHeaderButton,

  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './styles/style.css';
import ModalComment from './Modals/Comment';
import ModalPrometay from './Modals/Prometay';
import ModalDonut from './Modals/Donut';
import ModalBan from './Modals/Ban';
import ModalVerif from './Modals/Verif'
import {accountActions, viewsActions} from './store/main'
// Импортируем панели
import Questions      from './panels/questions/main';
import Advice         from './panels/Advice/main';
import Top            from './panels/topUsers/main';
import Notification   from './panels/notify/main';
import Profile        from './panels/Profile/main';
// import Start          from './panels/Start/main';
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
  Icon12Fire,
  Icon16StarCircleFillYellow,
  Icon16Verified,
  Icon28DiamondOutline,
  Icon24Dismiss,
  Icon28NewsfeedOutline,
  Icon28StoryAddOutline,

} from '@vkontakte/icons'
import { modalslist } from './modals';
import EpicItemPC from './components/EpicItem';
import { isEmptyObject } from 'jquery';
import { alertCreator, errorAlertCreator, setActiveModalCreator } from './Utils';


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
  const [activeModal, setModal] = useState(null);
  const [modalHistory, setModalHistory] = useState(null);
  const dispatch = useDispatch();
  const { account, schemeSettings } = useSelector((state) => state.account)
  const { scheme, default_scheme } = schemeSettings;
  const activeStory = useSelector((state) => state.views.activeStory)
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const setBanObject = useCallback((payload) => dispatch(accountActions.setBanObject(payload)), [dispatch])
  const setScheme = useCallback((payload) => dispatch(accountActions.setScheme(payload)), [dispatch])
  const [isMyMark, setIsMyMark] = useState(false);
  const [sharing_type, setSharingType] = useState('prometay');
  const need_epic = useSelector((state) => state.views.need_epic)
  const permissions = account.permissions;
  const moderator_permission = permissions >= PERMISSIONS.special;
  const agent_permission = permissions >= PERMISSIONS.agent;
  const comment_special = useSelector((state) => state.tickets.comment)
  // const [setReport, updateSetReport] = useState(() => undefined)
  const [callbacks, setCallbacks] = useState({});
  const setReport = useRef(null);
  const updateSetReport = (func) => {
    setReport.current = func;
  }
  const setActiveModal = (activeModal) => {
    setActiveModalCreator(setModal, setModalHistory, modalHistory, activeModal)
  }
  const showErrorAlert = (error = null, action = null) => {
    errorAlertCreator(setPopout, error, action)
  }
  const showAlert = (title, text) => {
    alertCreator(setPopout, title, text)
  }
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
        dispatch(viewsActions.setActiveStory('disconnect'))
      } else {
        setBanObject(data.error.error_obj)
        setActiveStory('banned')
        setLoadWebView(true)
      }
      
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
        if (hash.promo !== undefined && !ignore_promo) {
          ignore_promo = true;
          setActiveStory('profile');
        }else if ("help" in hash && !ignore_promo) {
          ignore_promo = true;
          setActiveStory('advice');
        }else if (activeStory === 'loading'){
          setActiveStory('questions');
        }
      setLoadWebView(true)
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

  const popouts_and_modals = {showAlert, showErrorAlert, setActiveModal, updateSetReport, setCallbacks, setPopout}
  const modals = (
    <ModalRoot
    activeModal={activeModal}>
      <ModalComment
        id='comment'
        comment={comment_special}
        onClose={() => setActiveModal(null)}
        reporting={setReport.current} />
      <ModalPrometay
        id='prom'
        onClose={() => {setActiveModal(null);setIsMyMark(false)}}
        action={() => setActiveModal(null)}
        action2={isMyMark ? () => { setSharingType('prometay'); setActiveModal('share2') } : undefined} />

      <ModalDonut
        id='donut'
        onClose={() => {setActiveModal(null);setIsMyMark(false)}}
        action={() => setActiveModal(null)}
        action2={isMyMark ? () => { setSharingType('donut'); setActiveModal('share2') } : undefined} />

      <ModalVerif
        id='verif'
        onClose={() => {setActiveModal(null);setIsMyMark(false)}}
        action={() => setActiveModal(null)}
        action2={isMyMark ? () => { setSharingType('verif'); setActiveModal('share2') } : undefined} />

      <ModalBan
        id='ban_user'
        onClose={() => setActiveModal(null)}
        callbacks={callbacks}
      />
      <ModalPage
        id="share2"
        onClose={() => setActiveModal(null)}
        header={
          <ModalPageHeader
            right={platform === IOS && <Header onClick={() => setActiveModal(null)}><Icon24Dismiss /></Header>}
            left={platform === ANDROID && <PanelHeaderButton onClick={() => setActiveModal(null)}><Icon24Dismiss /></PanelHeaderButton>}
          >
            Рассказать
                  </ModalPageHeader>
        }
      >
        <List>
          <Cell
            onClick={() => bridge.send("VKWebAppShowWallPostBox",
              {
                message: POST_TEXTS[sharing_type]['text'],
                attachments: POST_TEXTS[sharing_type]['image']
              })}
            before={<Icon28NewsfeedOutline />}>
            На стене
                    </Cell>
          <Cell before={<Icon28StoryAddOutline />}
            onClick={() => {
              bridge.send("VKWebAppShowStoryBox",
                {
                  background_type: "image",
                  url: HISTORY_IMAGES[sharing_type]['image'],
                  attachment: {
                    "type": "url",
                    "url": LINK_APP,
                    "text": "learn_more"
                  }
                })
            }}>
            В истории
                    </Cell>
        </List>
      </ModalPage>
      {modalslist}
    </ModalRoot>
  )

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
              style={{ justifyContent: "center" }}
              popout={popout}
              modal={modals}>

              {isDesktop.current && need_epic && (<SplitCol fixed width="280px" maxWidth="280px">
                    <Panel id='menu_epic'>
                  {hasHeader.current && <PanelHeader/>}
                      <>
                      <Group>
                        <SimpleCell
                        disabled={activeStory === "profile"}
                        style={activeStory === "profile" ? {
                            backgroundColor: "var(--button_secondary_background)",
                            borderRadius: 8
                        } : {}}
                        data-story="profile"
                        onClick={(e) => setActiveStory(e.currentTarget.dataset.story)}
                          description={"#" + account['id']}
                          before={account.diamond ?
                            <div style={{ position: 'relative', margin: 10 }}><Avatar src={account['avatar']['url']} size={40} style={{ position: 'relative' }} />
                                <Icon28DiamondOutline width={15} height={15} className='Diamond_profile_pc' />
                            </div> : <Avatar size={40} src={account['avatar']['url']} />}>
                            <div style={{ display: "flex" }}>
                                  {account['nickname'] ? account['nickname'] : `Агент Поддержки`}
                                  {account['flash'] ?
                                      <div className="profile_icon">
                                          <Icon12Fire width={12} height={12} onClick={(e) => {e.stopPropagation();setActiveModal('prom');setIsMyMark(true)}} />
                                      </div>
                                      : null}
                                  {account['donut'] ?
                                      <div className="profile_icon">
                                          <Icon16StarCircleFillYellow width={12} height={12} onClick={(e) => {e.stopPropagation();setActiveModal('donut');setIsMyMark(true)}} />
                                      </div>
                                      : null}
                                  {account['verified'] ?
                                      <div className="profile_icon_ver">
                                          <Icon16Verified onClick={(e) => {e.stopPropagation();setActiveModal('verif');setIsMyMark(true)}} />
                                      </div>
                                      : null}
                              </div>
                          </SimpleCell>
                          
                      </Group>
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
                        {agent_permission && <EpicItemPC
                        icon={<Icon28BankOutline />}
                        story="top"
                        activeStory={activeStory}
                        changeActiveStory={setActiveStory}>
                          Пантеон
                        </EpicItemPC>}
                        {moderator_permission && 
                        <EpicItemPC
                        icon={<Icon28WorkOutline />}
                        story="moderation"
                        activeStory={activeStory}
                        changeActiveStory={setActiveStory}>
                          Модерация
                        </EpicItemPC>}
                      </Group>
                      </>
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
                          {agent_permission && <TabbarItem
                            onClick={(e) => {setActiveStory(e.currentTarget.dataset.story)}} 
                            selected={activeStory === 'top'}
                            data-story="top"
                            text='Пантеон'
                          ><Icon28BankOutline /></TabbarItem>}
                          {moderator_permission ? <TabbarItem
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
                      popouts_and_modals={popouts_and_modals}
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
                      popouts_and_modals={popouts_and_modals}
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      default_scheme={default_scheme}
                      popout={popout} />

                      <Moderation 
                      id="moderation"
                      reloadProfile={fetchAccount}
                      />
                      
                      {/* <Start 
                      id="start"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      popout={popout} /> */}

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
                    <Root activeView={activeStory}
                    id='root_inter'>
                      <Questions 
                      id='questions'
                      scheme={scheme}
                      popouts_and_modals={popouts_and_modals}
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
                      popouts_and_modals={popouts_and_modals}
                      default_scheme={default_scheme} />

                      <Moderation 
                      id="moderation"
                      reloadProfile={fetchAccount}
                      />
                      
                      {/* <Start 
                      id="start"
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      popout={popout} /> */}

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
