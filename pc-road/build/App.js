"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react")); // React
const react_redux_1 = require("react-redux");
const vk_bridge_1 = __importDefault(require("@vkontakte/vk-bridge"));
const react_loading_skeleton_1 = require("react-loading-skeleton");
const config_1 = require("./config");
const vkui_1 = require("@vkontakte/vkui");
require("@vkontakte/vkui/dist/vkui.css");
require("@vkontakte/vkui/dist/unstable.css");
require("./styles/style.css");
const Modals_1 = require("./Modals");
const main_1 = require("./store/main");
// Импортируем панели
const views_1 = require("./views");
const icons_1 = require("@vkontakte/icons");
const jquery_1 = require("jquery");
const Utils_1 = require("./Utils");
const hooks_1 = require("./hooks");
const soket_1 = require("./context/soket");
const DESKTOP_SIZE = 1000;
const TABLET_SIZE = 900;
const SMALL_TABLET_SIZE = 768;
const MOBILE_SIZE = 320;
const MOBILE_LANDSCAPE_HEIGHT = 414;
const MEDIUM_HEIGHT = 720;
function calculateAdaptivity(windowWidth, windowHeight) {
    let viewWidth, viewHeight;
    if (windowWidth >= DESKTOP_SIZE) {
        viewWidth = vkui_1.ViewWidth.DESKTOP;
    }
    else if (windowWidth >= TABLET_SIZE) {
        viewWidth = vkui_1.ViewWidth.TABLET;
    }
    else if (windowWidth >= SMALL_TABLET_SIZE) {
        viewWidth = vkui_1.ViewWidth.SMALL_TABLET;
    }
    else if (windowWidth >= MOBILE_SIZE) {
        viewWidth = vkui_1.ViewWidth.MOBILE;
    }
    else {
        viewWidth = vkui_1.ViewWidth.SMALL_MOBILE;
    }
    if (windowHeight >= MEDIUM_HEIGHT) {
        viewHeight = vkui_1.ViewHeight.MEDIUM;
    }
    else if (windowHeight > MOBILE_LANDSCAPE_HEIGHT) {
        viewHeight = vkui_1.ViewHeight.SMALL;
    }
    else {
        viewHeight = vkui_1.ViewHeight.EXTRA_SMALL;
    }
    return {
        viewWidth: viewWidth,
        viewHeight: viewHeight,
    };
}
let backTimeout = false;
const App = () => {
    var _a;
    const [activeModal, setModal] = (0, react_1.useState)(null);
    const [modalHistory, setModalHistory] = (0, react_1.useState)(null);
    const dispatch = (0, react_redux_1.useDispatch)();
    const { goPanel, setSnackbar, setPopout, showAlert, showErrorAlert, setHash, hash, setBigLoader, goTiket, } = (0, hooks_1.useNavigation)();
    const { fetchApi } = (0, hooks_1.useApi)();
    const { account, schemeSettings, other_profile: OtherProfileData, } = (0, react_redux_1.useSelector)((state) => state.account);
    const { scheme, default_scheme } = schemeSettings;
    const { activeStory, historyPanels, snackbar, activePanel, popout } = (0, react_redux_1.useSelector)((state) => state.views);
    const [ignoreOtherProfile, setIgnoreOtherProfile] = (0, react_1.useState)(false);
    const need_epic = (0, react_redux_1.useSelector)((state) => state.views.need_epic);
    const comment_special = (0, react_redux_1.useSelector)((state) => state.tickets.comment);
    const goBack = (0, react_1.useCallback)(() => __awaiter(void 0, void 0, void 0, function* () {
        let history = [...historyPanels];
        if (!backTimeout) {
            backTimeout = true;
            if (history.length <= 1) {
                yield vk_bridge_1.default.send("VKWebAppClose", { "status": "success" });
            }
            else {
                if (history[history.length] >= 2) {
                    yield vk_bridge_1.default.send('VKWebAppDisableSwipeBack');
                }
                setHash('');
                history.pop();
                let { view, panel } = history[history.length - 1];
                dispatch(main_1.viewsActions.setActiveScene(view, panel));
                setPopout(<vkui_1.ScreenSpinner />);
                setTimeout(() => {
                    setPopout(null);
                }, 500);
            }
            dispatch(main_1.viewsActions.setHistory(history));
            setTimeout(() => { backTimeout = false; }, 500);
        }
        else {
            window.history.pushState(Object.assign({}, history[history.length - 1]), history[history.length - 1].panel);
        }
    }), [historyPanels, setPopout, setHash, dispatch]);
    const setActiveModal = (activeModal) => {
        (0, Utils_1.setActiveModalCreator)(setModal, setModalHistory, modalHistory, activeModal);
    };
    const setReport = (name, id) => {
        dispatch(main_1.reportsActions.setTypeReport(name));
        dispatch(main_1.reportsActions.setResourceReport(id));
        goPanel(activeStory, "report", true);
    };
    const fetchAccount = (0, react_1.useCallback)(() => {
        fetchApi("account.get")
            .then(data => {
            setBigLoader(false);
            dispatch(main_1.accountActions.setAccount(data));
        })
            .catch(() => { });
        // eslint-disable-next-line 
    }, [account, activeStory, default_scheme, dispatch]);
    const AppInit = (0, react_1.useCallback)(() => {
        dispatch(main_1.accountActions.setBanObject(null));
        fetchAccount();
        if (activeStory === 'disconnect') {
            let { view, panel } = historyPanels[historyPanels.length - 2];
            goPanel(view, panel, true, true);
        }
    }, [historyPanels, fetchAccount, activeStory, goPanel, dispatch]);
    const bridgecallback = (0, react_1.useCallback)(({ detail: { type, data } }) => {
        if (type === 'VKWebAppViewHide') {
            console.log('closing...');
        }
        if (type === 'VKWebAppViewRestore') {
            AppInit();
        }
        if (type === 'VKWebAppUpdateConfig') {
            dispatch(main_1.accountActions.setScheme(Object.assign(Object.assign({}, schemeSettings), { default_scheme: data.scheme })));
        }
    }, [AppInit, dispatch, schemeSettings]);
    (0, react_1.useEffect)(() => {
        dispatch(main_1.accountActions.setScheme({ scheme: default_scheme }));
    }, [account, default_scheme, dispatch]);
    const handlePopstate = (0, react_1.useCallback)((e) => {
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
            className: 'gray navigation_tab',
            onClick: () => { setHash(''); goPanel(tab, config_1.viewsStructure[tab].panels.homepanel); },
            selected: activeStory === tab,
        };
    };
    const activeLeftBlock = (0, react_1.useCallback)(() => {
        let viewsNeedLeftBlock = [
            config_1.viewsStructure.Profile.navName + config_1.viewsStructure.Profile.panels.homepanel,
        ];
        return !!viewsNeedLeftBlock.find(v => v === activeStory + activePanel);
    }, [activeStory, activePanel]);
    (0, react_1.useEffect)(() => {
        AppInit();
        vk_bridge_1.default.send('VKWebAppInit', {})
            .then(() => { });
        // eslint-disable-next-line
    }, []);
    (0, react_1.useEffect)(() => {
        window.addEventListener('popstate', handlePopstate);
        return () => {
            window.removeEventListener('popstate', handlePopstate);
        };
    }, [handlePopstate]);
    (0, react_1.useEffect)(() => {
        if (!(0, jquery_1.isEmptyObject)(account)) {
            if ((hash === null || hash === void 0 ? void 0 : hash.promo) && activePanel !== 'promocodes') {
                goPanel(config_1.viewsStructure.Profile.navName, 'promocodes', true);
            }
            else if (hash.ticket_id !== undefined && activePanel !== 'ticket') {
                dispatch(main_1.ticketActions.setTicketId(hash.ticket_id));
                goPanel(config_1.viewsStructure.Questions.navName, 'ticket', true);
            }
            else if (hash.agent_id !== undefined) {
                if (activePanel !== 'other_profile' && !ignoreOtherProfile) {
                    setIgnoreOtherProfile(true);
                    (0, Utils_1.goOtherProfileCreator)(goPanel, config_1.viewsStructure.Questions.navName, showErrorAlert, OtherProfileData, dispatch, hash.agent_id);
                    setTimeout(() => setIgnoreOtherProfile(false), 1000);
                }
            }
            else if ("help" in hash && activePanel !== 'faqMain') {
                goPanel(config_1.viewsStructure.Profile.navName, 'faqMain', true);
            }
            else if (activeStory === 'loading') {
                dispatch(main_1.viewsActions.setActiveScene(config_1.viewsStructure.Questions.navName, config_1.viewsStructure.Questions.panels.homepanel));
            }
        }
    }, [account, dispatch, showErrorAlert, activeStory, activePanel, goTiket, goPanel, hash, OtherProfileData, ignoreOtherProfile]);
    (0, react_1.useEffect)(() => {
        vk_bridge_1.default.subscribe(bridgecallback);
        return () => vk_bridge_1.default.unsubscribe(bridgecallback);
    }, [account, bridgecallback]);
    (0, react_1.useEffect)(() => {
        soket_1.socket.on("connect_error", (err) => {
            console.log(err.message);
        });
        soket_1.socket.on('ERROR', (err) => {
            console.log('ERROR: ', err);
        });
        return () => {
            soket_1.socket.off('connect_error');
            soket_1.socket.off('ERROR');
        };
    });
    const modalClose = () => setActiveModal(null);
    const modals = (<vkui_1.ModalRoot onClose={modalClose} activeModal={activeModal}>
			<Modals_1.ModalComment id='comment' comment={comment_special} onClose={modalClose} reporting={setReport}/>

			<Modals_1.ModalBan id='ban_user' onClose={modalClose} callbacks={{ setPopout, showErrorAlert, setActiveModal, showAlert }}/>

			<Modals_1.ModalShare id="share" setActiveModal={setActiveModal} setSnackbar={setSnackbar} onClick={modalClose}/>

			<Modals_1.ShowQR id='qr' onClick={modalClose}/>
			<Modals_1.InvalidQR id='invalid_qr' onClick={modalClose}/>

			<vkui_1.ModalCard onClose={modalClose} id='test'>
				Вью {activeStory}
			</vkui_1.ModalCard>
		</vkui_1.ModalRoot>);
    return (<soket_1.SocketContext.Provider value={soket_1.socket}>
			<vkui_1.ConfigProvider scheme={scheme} platform={vkui_1.VKCOM}>
				
				<vkui_1.AppRoot>
					{need_epic && <><div style={{ minWidth: '100vw', position: 'fixed', top: 0, zIndex: 4 }}>
						<vkui_1.Group>
							<vkui_1.Tabs>
								<vkui_1.TabsItem {...clickTab('Questions')}>
									<vkui_1.SimpleCell disabled before={<icons_1.Icon28ListBulletSquareOutline width={24} height={24}/>}>
										Вопросы
									</vkui_1.SimpleCell>
								</vkui_1.TabsItem>
								<vkui_1.TabsItem {...clickTab('Top')}>
									<vkui_1.SimpleCell disabled before={<icons_1.Icon28StatisticsOutline width={24} height={24}/>}>
										Статистика
									</vkui_1.SimpleCell>
								</vkui_1.TabsItem>
								<vkui_1.TabsItem {...clickTab('Moderation')}>
									<vkui_1.SimpleCell disabled before={<icons_1.Icon28SettingsOutline width={24} height={24}/>}>
										Управление
									</vkui_1.SimpleCell>
								</vkui_1.TabsItem>

							</vkui_1.Tabs>
						</vkui_1.Group>
					</div>
					<div style={{ marginBottom: 70 }}/></>}
				
					<vkui_1.SplitLayout style={{ justifyContent: "center" }} popout={popout} modal={modals}>
				
				{activeLeftBlock() && (<vkui_1.SplitCol fixed width="230px" maxWidth="230px">
						<vkui_1.Panel id='menu_epic'>
						{!(0, jquery_1.isEmptyObject)(account) && <>
						<vkui_1.Group>
							<div style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 7
                }}>
								<img className='profile_avatar' src={(_a = account === null || account === void 0 ? void 0 : account.avatar) === null || _a === void 0 ? void 0 : _a.url} alt='avatar'/>
								<vkui_1.Spacing />
								<vkui_1.Button size='m' mode='secondary' stretched>
									Настройки
								</vkui_1.Button>
							</div>
							<vkui_1.Spacing />
							<vkui_1.CellButton multiline before={<icons_1.Icon24LogoVkOutline />}>
								Профиль VK
							</vkui_1.CellButton>
							<vkui_1.Spacing>
								<vkui_1.Separator />
							</vkui_1.Spacing>
							<vkui_1.SimpleCell className='gray' before={<icons_1.Icon24MessagesOutline />}>
								Чат агентов
							</vkui_1.SimpleCell>
							<vkui_1.SimpleCell className='gray' before={<icons_1.Icon24DonateOutline />}>
								Чат донов
							</vkui_1.SimpleCell>
							<vkui_1.Spacing>
								<vkui_1.Separator />
							</vkui_1.Spacing>
							<vkui_1.SimpleCell className='gray' before={<icons_1.Icon24MarketOutline />}>
								Магазин
							</vkui_1.SimpleCell>
							<vkui_1.SimpleCell className='gray' before={<icons_1.Icon24QuestionOutline />}>
								Помощь
							</vkui_1.SimpleCell>
						</vkui_1.Group>
						<vkui_1.Group>
							<vkui_1.CellButton multiline before={<icons_1.Icon24ShareOutline />}>
								Поделиться профилем
							</vkui_1.CellButton>
						</vkui_1.Group>
						</>}
						</vkui_1.Panel>
					</vkui_1.SplitCol>)}

					<vkui_1.SplitCol animate={false} spaced={activeLeftBlock()} width={activeLeftBlock() ? 754 : 754 + 230} maxWidth={activeLeftBlock() ? 754 : 754 + 230}>
					<react_loading_skeleton_1.SkeletonTheme color={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#232323'} highlightColor={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#6B6B6B'}>
					<vkui_1.Epic activeStory={activeStory}>

							<views_1.Profile id={config_1.viewsStructure.Profile.navName}/>
							<views_1.Questions id={config_1.viewsStructure.Questions.navName}/>
							<views_1.Disconnect id="disconnect" AppInit={AppInit}/>

						</vkui_1.Epic>
						</react_loading_skeleton_1.SkeletonTheme>
					</vkui_1.SplitCol>
					{snackbar}
					</vkui_1.SplitLayout>
				</vkui_1.AppRoot>
				</vkui_1.ConfigProvider>
			</soket_1.SocketContext.Provider>);
};
exports.default = () => (<vkui_1.AdaptivityProvider viewWidth={calculateAdaptivity(document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
	<App />
</vkui_1.AdaptivityProvider>);
