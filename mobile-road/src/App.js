import React, { useCallback, useEffect, useState } from 'react'; // React
import {useDispatch, useSelector} from "react-redux";
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import { SkeletonTheme } from "react-loading-skeleton";
// import music from './music/Soloriver.mp3';
import { API_URL, PERMISSIONS, viewsStructure, IS_MOBILE } from "./config";
import { 
  ScreenSpinner,
  Tabbar,
  TabbarItem,
  Epic,
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  SplitLayout,
  SplitCol,
  Panel,
  PanelHeader,
  Group,
  useAdaptivityConditionalRender,
  Alert,
  Badge,
  Avatar,
  usePlatform,
  Platform,
  RichCell,
  classNames,

  } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import "@vkontakte/vkui/dist/unstable.css";
import './styles/style.css';

import {accountActions, reportsActions, ticketActions, viewsActions} from './store/main'
// Импортируем панели
import {
  Questions,
  Top,
  Moderation,
  Profile,
  Disconnect,
  Banned,
  LoadingScreen,
} from './panels'

import {
  Icon28SettingsOutline,
  Icon28ListBulletSquareOutline,
  Icon28Profile,
  Icon28StatisticsOutline,

} from '@vkontakte/icons';
import EpicItemPC from './components/EpicItem';
import { isEmptyObject } from 'jquery';
import { goOtherProfileCreator, NicknameMenager } from './Utils';
import { useNavigation } from './hooks';
import { ProfileTags } from './components/ProfileTags';
import { Modals } from './Modals/index';

const scheme_params = {
  bright_light: { "status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF" },
  space_gray: { "status_bar_style": "light", "action_bar_color": "#19191A", 'navigation_bar_color': "#19191A" }
}
var adsCounter = 0;
var backTimeout = false;
const App = () => {
  const [Transfers, setTransfers] = useState(null);
  const [Transfer, setTransfer] = useState(
    {
      avatar: 1,
      text: '',
      comment: '', 
    }
  )
  const [moneyPromo, setMoneyPromo] = useState(0);
  const dispatch = useDispatch();
  const { goPanel, 
    goDisconnect, 
    setSnackbar, 
    goOtherProfile, 
    setPopout,
    showAlert,
    showErrorAlert,
    setHash,
    hash
   } = useNavigation();
  const { account, schemeSettings, other_profile: OtherProfileData, } = useSelector((state) => state.account)
  const { scheme, default_scheme } = schemeSettings;
  const { activeStory, historyPanels, snackbar, activePanel, popout } = useSelector((state) => state.views)
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
  const setActiveScene = useCallback((story, panel) => dispatch(viewsActions.setActiveScene(story, panel)), [dispatch]);
  const setHistoryPanels = useCallback((history) => dispatch(viewsActions.setHistory(history)), [dispatch]);
  const setBanObject = useCallback((payload) => dispatch(accountActions.setBanObject(payload)), [dispatch])
  const setScheme = useCallback((payload) => dispatch(accountActions.setScheme(payload)), [dispatch])
  const [ignoreOtherProfile, setIgnoreOtherProfile] = useState(false);
  const [isMyMark, setIsMyMark] = useState(false);
  const need_epic = useSelector((state) => state.views.need_epic)
  const permissions = account.permissions;
  const moderator_permission = permissions >= PERMISSIONS.special;
  const agent_permission = permissions >= PERMISSIONS.agent;
  const platform = usePlatform()


  const goBack = useCallback(() => {
    let history = [...historyPanels]
    if(!backTimeout) {
      backTimeout = true;
      if (history.length <= 1) {
          bridge.send("VKWebAppClose", {"status": "success"});
      } else {
        if(history[history.length] >= 2) {
          bridge.send('VKWebAppDisableSwipeBack');
        }
        setHash('');
        history.pop()
        let {view, panel} = history[history.length - 1];
        setActiveScene(view, panel)
        setPopout(<ScreenSpinner />)
        setTimeout(() => {
            setPopout(null)
          }, 500)
      }
      setHistoryPanels(history)
      setTimeout(() => {backTimeout = false;}, 500)
      
    }else{
      window.history.pushState({ ...history[history.length - 1] }, history[history.length - 1].panel );
    }
  }, [historyPanels, setHistoryPanels, setActiveScene, setPopout, setHash])

  const setReport = (name, id) => {
    dispatch(reportsActions.setTypeReport(name))
    dispatch(reportsActions.setResourceReport(id))
    goPanel(activeStory, "report", true);
  }

  const goTiket = useCallback((id, need_ads=true) => {
    setPopout(<ScreenSpinner/>)
    dispatch(ticketActions.setTicketId(id))
    goPanel(activeStory, 'ticket', true);
    if(need_ads && adsCounter !== 0 && adsCounter % 2 === 0 && !isEmptyObject(account) && !account.donut){
      bridge.send("VKWebAppShowNativeAds", {ad_format: 'interstitial'})
    }
    adsCounter++
    setPopout(null);
  }, [dispatch, goPanel, setPopout, account, activeStory])

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
        goDisconnect()
      } else {
        setBanObject(data.error.error_obj)
        setActiveStory('banned')
      }
      
      }
    })
    .catch(goDisconnect)
    // eslint-disable-next-line 
  }, [account, activeStory, default_scheme, dispatch, setActiveStory])

  const AppInit = useCallback(() => {
    setBanObject(null);
    fetchAccount()
    if( activeStory === 'disconnect') {
      let {view, panel} = historyPanels[historyPanels.length - 2];
      goPanel(view, panel, true, true)
    }
    
  }, [historyPanels, fetchAccount, setBanObject, activeStory, goPanel])

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
    const brigeSchemeChange = (params) => {
      bridge.send("VKWebAppSetViewSettings", params);
    }
    setScheme({ scheme: default_scheme })
    if (IS_MOBILE) {
      switch (default_scheme) {
        case 'bright_light':
          brigeSchemeChange(scheme_params.bright_light)
          break;
        case 'space_gray':
          brigeSchemeChange(scheme_params.space_gray)
          break;
        default:
          brigeSchemeChange(scheme_params.bright_light)
      }
    }
  }, [account, default_scheme, setScheme])
  const handlePopstate = useCallback((e) => {
    // if(e.state === null) {
		// 	let history = [...historyPanels];
		// 	window.history.pushState({ ...history[history.length - 1] }, history[history.length - 1].panel);
		// 	return false;
		// }
    e.preventDefault();
    goBack();
  }, [goBack]);
  useEffect(() => {
    AppInit();
    bridge.send('VKWebAppInit', {});
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    window.addEventListener('popstate', handlePopstate);
    return () => {
      window.removeEventListener('popstate', handlePopstate)
    }
  }, [handlePopstate])
  useEffect(() => {
    if(!isEmptyObject(account)){
        if (hash.promo !== undefined && activePanel !== 'promocodes') {
          goPanel(viewsStructure.Profile.navName, 'promocodes', true)
        }else if(hash.ticket_id !== undefined && activePanel !== 'ticket') {
          dispatch(ticketActions.setTicketId(hash.ticket_id))
          goPanel(viewsStructure.Questions.navName, 'ticket', true);
        }else if(hash.agent_id !== undefined) {
          if(activePanel !== 'other_profile' && !ignoreOtherProfile){
            setIgnoreOtherProfile(true)
            goOtherProfileCreator(goPanel, viewsStructure.Questions.navName, showErrorAlert, OtherProfileData, dispatch, hash.agent_id)
            setTimeout(() => setIgnoreOtherProfile(false), 1000)
          }
          
        }else if ("help" in hash && activePanel !== 'faqMain') {
          goPanel(viewsStructure.Profile.navName, 'faqMain', true);
        }else if (activeStory === 'loading'){
          setActiveScene(viewsStructure.Questions.navName, viewsStructure.Questions.panels.homepanel)
        }
    }
    
  }, [setActiveScene, account, dispatch, activeStory, activePanel, goTiket, goPanel, hash, OtherProfileData])
  useEffect(() => {
    bridge.subscribe(bridgecallback);
    
    return () => bridge.unsubscribe(bridgecallback);
  }, [account, bridgecallback])
  
  

  const popouts_and_modals = {showAlert, showErrorAlert, setPopout}
  const navigation = {goPanel, goBack, goDisconnect};
  const base_functions = { goTiket, setReport, goOtherProfile, setSnackbar, setMoneyPromo, setTransfer }

  const isVKCOM = platform === Platform.VKCOM
  return(
    <>
        <ConfigProvider 
        scheme={scheme}
              > 

              <AppRoot>
                <SplitLayout
              style={{ justifyContent: "center" }}
              popout={popout}
              modal={
              <Modals
              moneyPromo={moneyPromo}
              fetchAccount={fetchAccount}
              Transfers={Transfers}
              setTransfers={setTransfers}
              Transfer={Transfer}
              isMyMark={isMyMark}
              setIsMyMark={setIsMyMark} />}>

              {isVKCOM && need_epic && (
              <SplitCol 
              // className={viewWidth.tabletPlus.className}
              fixed width="280px" maxWidth="280px">
                    <Panel id='menu_epic'>
                  {!isVKCOM && <PanelHeader/>}
                      <>
                      {isEmptyObject(account) || <Group>
                        <RichCell
                        disabled={activeStory === "profile"}
                        className={classNames({'vkuiTappable--active-background': activeStory === "Profile"})}
                        onClick={() => {setHash('');goPanel(viewsStructure.Profile.navName, viewsStructure.Profile.panels.homepanel)}}
                          caption={"#" + account['id']}
                          before={<Avatar size={50} src={account['avatar']['url']} />}>
                            <div style={{ display: "flex" }}>
                                  <NicknameMenager 
                                  nickname={account.nickname}
                                  agent_id={account.id}
                                  perms={permissions}
                                  need_num={false} />
                                  <ProfileTags
                                    flash={account.flash}
                                    donut={account.donut}
                                    verified={account.verified} />
                              </div>
                          </RichCell>
                          
                      </Group>}
                      <Group>
                        <EpicItemPC
                        icon={<Icon28ListBulletSquareOutline />}
                        story={viewsStructure.Questions.navName}
                        activeStory={activeStory}
                        onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Questions.panels.homepanel)}}>
                          {viewsStructure.Questions.name}
                        </EpicItemPC>
                        {/* <EpicItemPC
                        icon={<Icon28CompassOutline />}
                        story={viewsStructure.Advice.navName}
                        activeStory={activeStory}
                        onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Advice.panels.homepanel)}}>
                          {viewsStructure.Advice.name}
                        </EpicItemPC> */}
                        {agent_permission && <EpicItemPC
                        icon={<Icon28StatisticsOutline />}
                        story={viewsStructure.Top.navName}
                        activeStory={activeStory}
                        onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Top.panels.homepanel)}}>
                          {viewsStructure.Top.name}
                        </EpicItemPC>}
                        {moderator_permission && 
                        <EpicItemPC
                        icon={<Icon28SettingsOutline />}
                        story={viewsStructure.Moderation.navName}
                        activeStory={activeStory}
                        onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Moderation.panels.homepanel)}}>
                          {viewsStructure.Moderation.name}
                        </EpicItemPC>}
                      </Group>
                      </>
                    </Panel>
                  </SplitCol>)}

                  <SplitCol
                  animate={!isVKCOM}
                  // stretchedOnMobile
                  autoSpaced
                  width='100%'
                  maxWidth='650px'
                    >
                <SkeletonTheme color={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#232323'} 
                highlightColor={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#6B6B6B'}>
                <Epic activeStory={activeStory}
                className={!(need_epic && !isVKCOM) ? 'no_tabbbar' : undefined}
                      tabbar={
                        need_epic && !isVKCOM &&
                        <Tabbar>
                          <TabbarItem
                            onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Questions.panels.homepanel)}} 
                            selected={activeStory === viewsStructure.Questions.navName}
                            data-story={viewsStructure.Questions.navName}
                            text={viewsStructure.Questions.name}
                          ><Icon28ListBulletSquareOutline/></TabbarItem>
                          {/* <TabbarItem
                            onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Advice.panels.homepanel)}} 
                            selected={activeStory === viewsStructure.Advice.navName}
                            data-story={viewsStructure.Advice.navName}
                            text={viewsStructure.Advice.name}
                          ><Icon28CompassOutline/></TabbarItem> */}
                          {agent_permission && <TabbarItem
                            onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Top.panels.homepanel)}} 
                            selected={activeStory === viewsStructure.Top.navName}
                            data-story={viewsStructure.Top.navName}
                            text={viewsStructure.Top.name}
                          ><Icon28StatisticsOutline /></TabbarItem>}
                          {moderator_permission ? <TabbarItem
                            onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Moderation.panels.homepanel)}} 
                            selected={activeStory === viewsStructure.Moderation.navName}
                            data-story={viewsStructure.Moderation.navName}
                            text={viewsStructure.Moderation.name}
                          ><Icon28SettingsOutline /></TabbarItem> : null}
                          <TabbarItem
                            indicator={account.notif_count ? <Badge mode="prominent" /> : null}
                            onClick={(e) => {setHash('');goPanel(e.currentTarget.dataset.story, viewsStructure.Profile.panels.homepanel)}} 
                            selected={activeStory === viewsStructure.Profile.navName || activeStory === "notif"}
                            data-story={viewsStructure.Profile.navName}
                            text={viewsStructure.Profile.name}
                          ><Icon28Profile /></TabbarItem>
                          
                        </Tabbar>
                      }
                      >

                      <Questions 
                      id={viewsStructure.Questions.navName}
                      navigation={navigation}
                      popouts_and_modals={popouts_and_modals}
                      base_functions={base_functions}
                      reloadProfile={fetchAccount} />

                      {/* <Advice
                      navigation={navigation}
                      id={viewsStructure.Advice.navName}
                      base_functions={base_functions}
                      popouts_and_modals={popouts_and_modals}
                      reloadProfile={fetchAccount} /> */}

                      <Top 
                      navigation={navigation}
                      id={viewsStructure.Top.navName}
                      base_functions={base_functions}
                      popouts_and_modals={popouts_and_modals}
                      reloadProfile={fetchAccount}
                      scheme={scheme} />

                      <Profile 
                      navigation={navigation}
                      id={viewsStructure.Profile.navName}
                      base_functions={base_functions}
                      popouts_and_modals={popouts_and_modals}
                      marks_manage={{setIsMyMark}}
                      reloadProfile={fetchAccount}
                      scheme={scheme}
                      default_scheme={default_scheme} />

                      <Moderation 
                      navigation={navigation}
                      base_functions={base_functions}
                      id={viewsStructure.Moderation.navName}
                      popouts_and_modals={popouts_and_modals}
                      reloadProfile={fetchAccount}
                      />

                      <Banned 
                      id="banned"
                      reloadProfile={fetchAccount}
                      scheme={scheme} />

                      <Disconnect
                      id="disconnect"
                      setPopout={setPopout}
                      AppInit={AppInit}
                      reloadProfile={fetchAccount} />

                      <LoadingScreen 
                      id="loading" />
                    </Epic>
                    </SkeletonTheme>
                  </SplitCol>
                  {snackbar}
                </SplitLayout>
              </AppRoot>
            </ConfigProvider>
          </>
  )

}

export default () => (
  <AdaptivityProvider>
    <App />
  </AdaptivityProvider>
);
