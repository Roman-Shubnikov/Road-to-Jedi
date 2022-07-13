import React, { useCallback, useEffect, useState } from 'react'; // React
import {useDispatch, useSelector} from "react-redux";
import bridge from '@vkontakte/vk-bridge';
import { SkeletonTheme } from "react-loading-skeleton";
import { viewsStructure } from "./config";
import { 
  ScreenSpinner,
  Epic,
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  VKCOM,
  ViewWidth,
  SplitLayout,
  SplitCol,
  Panel,
  Group,
  ViewHeight,
  ModalRoot,
  SimpleCell,
  ModalCard,
  Spacing,
  Button,
  CellButton,
  Separator,
  } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import "@vkontakte/vkui/dist/unstable.css";
import './styles/style.css';
import {
	ModalBan,
	ModalComment,
	ShowQR, 
	InvalidQR, 
	ModalShare, 
} from './Modals';

import {accountActions, reportsActions, ticketActions, viewsActions} from './store/main'
// Импортируем панели
import {
  Disconnect,
  Profile,
} from './views'

import {
	Icon24LogoVkOutline,
	Icon24MessagesOutline,
	Icon24DonateOutline,
	Icon24MarketOutline,
	Icon24QuestionOutline,
	Icon24ShareOutline,
	Icon28ListBulletSquareOutline,
	Icon28StatisticsOutline,
	Icon28SettingsOutline,

} from '@vkontakte/icons';
import { isEmptyObject } from 'jquery';
import { setActiveModalCreator, goOtherProfileCreator } from './Utils';
import { useApi, useNavigation } from './hooks';


var DESKTOP_SIZE = 1000;
var TABLET_SIZE = 900;
var SMALL_TABLET_SIZE = 768;
var MOBILE_SIZE = 320;
var MOBILE_LANDSCAPE_HEIGHT = 414;
var MEDIUM_HEIGHT = 720;


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
var adsCounter = 0;
var backTimeout = false;
const App = () => {
	const [activeModal, setModal] = useState(null);
	const [modalHistory, setModalHistory] = useState(null);
	const dispatch = useDispatch();
	const { goPanel,  
		setSnackbar, 
		setPopout,
		showAlert,
		showErrorAlert,
		setHash,
		hash,
		setBigLoader,
	} = useNavigation();
	const { fetchApi } = useApi();
	const { account, schemeSettings, other_profile: OtherProfileData, } = useSelector((state) => state.account)
	const { scheme, default_scheme } = schemeSettings;
	const { activeStory, historyPanels, snackbar, activePanel, popout } = useSelector((state) => state.views)
	const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
	const setActiveScene = useCallback((story, panel) => dispatch(viewsActions.setActiveScene(story, panel)), [dispatch]);
	const setHistoryPanels = useCallback((history) => dispatch(viewsActions.setHistory(history)), [dispatch]);
	const setBanObject = useCallback((payload) => dispatch(accountActions.setBanObject(payload)), [dispatch])
	const setScheme = useCallback((payload) => dispatch(accountActions.setScheme(payload)), [dispatch])
	const [ignoreOtherProfile, setIgnoreOtherProfile] = useState(false);
	const need_epic = useSelector((state) => state.views.need_epic)
	const comment_special = useSelector((state) => state.tickets.comment)


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

	const setActiveModal = (activeModal) => {
		setActiveModalCreator(setModal, setModalHistory, modalHistory, activeModal)
	}
	const setReport = (name, id) => {
		dispatch(reportsActions.setTypeReport(name))
		dispatch(reportsActions.setResourceReport(id))
		goPanel(activeStory, "report", true);
	}

	const goTiket = useCallback((id, need_ads=true) => {
		setBigLoader();
		dispatch(ticketActions.setTicketId(id))
		goPanel(activeStory, 'ticket', true);
		if(need_ads && adsCounter !== 0 && adsCounter % 2 === 0 && !isEmptyObject(account) && !account.donut){
		bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
		}
		adsCounter++
		setPopout(null);
	}, [dispatch, goPanel, setPopout, account, activeStory, setBigLoader])

	const fetchAccount = useCallback(() => {
		fetchApi("account.get")
		.then(data => {
			setBigLoader(false);
			dispatch(accountActions.setAccount(data))
		})
		.catch(error => {});
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
		setScheme({ scheme: default_scheme })
	}, [account, default_scheme, setScheme])

	const handlePopstate = useCallback((e) => {
		// Важно пофиксить этот баг история пишется некорректно возможно ошибка в goBack()
		// if(e.state === null) { 
				// let history = [...historyPanels];
				// window.history.replaceState({ ...history[history.length - 1] }, history[history.length - 1].panel);
				// return false;
			// }
		e.preventDefault();
		goBack();
	}, [goBack]);

	const clickTab = (tab) => {
		return {
            onClick: () => {setHash('');goPanel(tab, viewsStructure[tab].panels.homepanel)},
            selected: activeStory === tab,
        }
	}

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
		
	}, [setActiveScene, account, dispatch, showErrorAlert, activeStory, activePanel, goTiket, goPanel, hash, OtherProfileData, ignoreOtherProfile])
	useEffect(() => {
		bridge.subscribe(bridgecallback);
		
		return () => bridge.unsubscribe(bridgecallback);
	}, [account, bridgecallback])
	

	const modalClose = () => setActiveModal(null);
	const modals = (
		<ModalRoot
		onClose={modalClose}
		activeModal={activeModal}>
		<ModalComment
			id='comment'
			comment={comment_special}
			onClose={modalClose}
			reporting={setReport} />

		<ModalBan
			id='ban_user'
			onClose={modalClose}
			callbacks={{ setPopout, showErrorAlert, setActiveModal, showAlert }}
		/>
		
		<ModalShare
		id="share"
		setActiveModal={setActiveModal}
		setSnackbar={setSnackbar}
		onClick={modalClose} />

		<ShowQR
		id='qr'
		onClick={modalClose} />
		<InvalidQR
		id='invalid_qr'
		onClick={modalClose} />

		<ModalCard
		onClose={modalClose}
		id='test'>
			Вью {activeStory}
		</ModalCard>
		</ModalRoot>
	)
	return(
		<>
			<ConfigProvider 
			scheme={scheme}
			platform={VKCOM}>
				
				<AppRoot>
					<div style={{minWidth: '100vw', position: 'fixed', top: 0, zIndex: 4}}>
						{/* <Group>
							<div style={{display: 'flex', alignItems: 'center'}}>
								<TabbarItem
								text='Вопросы'
								{...clickTab('Questions')}>
									<Icon28ListBulletSquareOutline width={24} height={24} />
								</TabbarItem>
								<TabbarItem
								text='Статистика'
								{...clickTab('Top')}>
									<Icon28StatisticsOutline width={24} height={24} />
								</TabbarItem>
								<TabbarItem
								text='Управление'
								{...clickTab('Moderation')}>
									<Icon28SettingsOutline width={24} height={24} />
								</TabbarItem>
							</div>
						</Group> */}
					</div>
					<div style={{marginBottom: 70}}></div>
				
					<SplitLayout
				style={{ justifyContent: "center" }}
				popout={popout}
				modal={modals}>
				
				{need_epic && (<SplitCol fixed width="230px" maxWidth="230px">
						<Panel id='menu_epic'>
						{!isEmptyObject(account) && <>
						<Group>
							<div style={{ 
								display: "flex", 
								flexDirection: "column",
								padding: 7 }}>
								<img className='profile_avatar' src={account?.avatar?.url} alt='avatar' />
								<Spacing />
								<Button size='m'
								mode='secondary'
								stretched>
									Настройки
								</Button>
							</div>
							<Spacing />
							<CellButton
							multiline
							before={<Icon24LogoVkOutline />}>
								Профиль VK
							</CellButton>
							<Spacing>
								<Separator />
							</Spacing>
							<SimpleCell
							className='gray'
							before={<Icon24MessagesOutline />}>
								Чат агентов
							</SimpleCell>
							<SimpleCell
							className='gray'
							before={<Icon24DonateOutline />}>
								Чат донов
							</SimpleCell>
							<Spacing>
								<Separator />
							</Spacing>
							<SimpleCell
							className='gray'
							before={<Icon24MarketOutline />}>
								Магазин
							</SimpleCell>
							<SimpleCell
							className='gray'
							before={<Icon24QuestionOutline />}>
								Помощь
							</SimpleCell>
						</Group>
						<Group>
							<CellButton
							multiline
							before={<Icon24ShareOutline />}>
								Поделиться профилем
							</CellButton>
						</Group>
						</>}
						</Panel>
					</SplitCol>)}

					<SplitCol
					animate={false}
					spaced
					width={754}
					maxWidth={754}
					>
					<SkeletonTheme color={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#232323'} 
					highlightColor={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#6B6B6B'}>
					<Epic activeStory={activeStory}>

							<Profile id={viewsStructure.Profile.navName} />
							<Disconnect
							id="disconnect"
							AppInit={AppInit} />

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
<AdaptivityProvider viewWidth={ calculateAdaptivity( document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
	<App />
</AdaptivityProvider>
);
