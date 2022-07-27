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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNavigation = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const main_1 = require("../store/main");
const vk_bridge_1 = __importDefault(require("@vkontakte/vk-bridge")); // VK Brige
const metrika_1 = require("../metrika");
const Utils_1 = require("../Utils");
const config_1 = require("../config");
const vkui_1 = require("@vkontakte/vkui");
const icons_1 = require("@vkontakte/icons");
const jquery_1 = require("jquery");
const queryString = require('query-string');
const useNavigation = () => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { account, ads } = (0, react_redux_1.useSelector)((state) => state.account);
    const setAds = (0, react_1.useCallback)((ads_count) => dispatch(main_1.accountActions.setAds(ads_count)), [dispatch]);
    const { activeStory, historyPanels, snackbar, activePanel, popout } = (0, react_redux_1.useSelector)((state) => state.views);
    const setActiveStory = (0, react_1.useCallback)((story) => dispatch(main_1.viewsActions.setActiveStory(story)), [dispatch]);
    const setActiveScene = (0, react_1.useCallback)((story, panel) => dispatch(main_1.viewsActions.setActiveScene(story, panel)), [dispatch]);
    const setPopout = (0, react_1.useCallback)((popout) => dispatch(main_1.viewsActions.setPopout(popout)), [dispatch]);
    const setHistoryPanels = (0, react_1.useCallback)((history) => dispatch(main_1.viewsActions.setHistory(history)), [dispatch]);
    const setSnackbar = (0, react_1.useCallback)((payload) => dispatch(main_1.viewsActions.setSnackbar(payload)), [dispatch]);
    const hash = (0, react_1.useMemo)(() => queryString.parse(window.location.hash), []);
    const setHash = (hash) => {
        vk_bridge_1.default.send("VKWebAppSetLocation", { "location": hash });
        window.location.hash = "#" + hash;
    };
    const setBigLoader = (0, react_1.useCallback)((state = true) => {
        if (state)
            return setPopout(<vkui_1.ScreenSpinner />);
        setPopout(null);
    }, [setPopout]);
    const getSimpleSnack = (0, react_1.useCallback)((text, icon) => {
        setSnackbar(<vkui_1.Snackbar onClose={() => setSnackbar(null)} before={icon}>
          {text}
        </vkui_1.Snackbar>);
    }, [setSnackbar]);
    const setSuccessfulSnack = (0, react_1.useCallback)((text) => {
        getSimpleSnack(text, <icons_1.Icon28CheckCircleFill />);
    }, [getSimpleSnack]);
    const setAbortSnack = (0, react_1.useCallback)((text) => {
        getSimpleSnack(text, <icons_1.Icon28CancelCircleFillRed />);
    }, [getSimpleSnack]);
    const goPanel = (0, react_1.useCallback)((view, panel, forcePanel = false, replaceState = false) => {
        const checkVisitedView = (view) => {
            let history = [...historyPanels];
            history.reverse();
            let index = history.findIndex(item => item.view === view);
            if (index !== -1) {
                return history.length - index;
            }
            else {
                return null;
            }
        };
        const historyChange = (history, view, panel, replaceState) => {
            if (replaceState) {
                history.pop();
                history.push({ view, panel });
                window.history.replaceState({ view, panel }, panel);
            }
            else {
                history.push({ view, panel });
                window.history.pushState({ view, panel }, panel);
            }
            return history;
        };
        if (view === null)
            view = activeStory;
        let history = [...historyPanels];
        if (forcePanel) {
            history = historyChange(history, view, panel, replaceState);
        }
        else {
            let index = checkVisitedView(view);
            if (index !== null) {
                let new_history = history.slice(0, index);
                history = new_history;
                window.history.pushState({ view, panel }, panel);
                ({ view, panel } = history[history.length - 1]);
            }
            else {
                history = historyChange(history, view, panel, replaceState);
            }
        }
        setHistoryPanels(history);
        setActiveScene(view, panel);
        vk_bridge_1.default.send('VKWebAppEnableSwipeBack');
        (0, metrika_1.sendHit)(view + '_' + panel);
    }, [setActiveScene, historyPanels, activeStory, setHistoryPanels]);
    const showAlert = (title, text) => {
        (0, Utils_1.alertCreator)(setPopout, title, text);
    };
    const showErrorAlert = (error = null, action = null) => {
        (0, Utils_1.errorAlertCreator)(setPopout, error, action);
    };
    const goDisconnect = (0, react_1.useCallback)((e = null) => {
        console.log(e);
        dispatch(main_1.viewsActions.setGlobalError(e));
        goPanel(config_1.viewsStructure.Disconnect.navName, config_1.viewsStructure.Disconnect.panels.homepanel, true);
    }, [dispatch, goPanel]);
    const goTiket = (0, react_1.useCallback)((id, need_ads = true) => {
        setBigLoader();
        dispatch(main_1.ticketActions.setTicketId(id));
        goPanel(activeStory, 'ticket', true);
        if (need_ads && ads !== 0 && ads % 2 === 0 && !(0, jquery_1.isEmptyObject)(account) && !account.donut) {
            vk_bridge_1.default.send("VKWebAppShowNativeAds", { ad_format: "reward" });
        }
        setAds(ads + 1);
        setBigLoader(false);
    }, [dispatch, goPanel, account, activeStory, ads, setAds, setBigLoader]);
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
        goTiket,
        activePanel,
        snackbar,
        activeStory,
        historyPanels,
        hash,
        popout,
    };
};
exports.useNavigation = useNavigation;
