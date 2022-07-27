"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.goOtherProfileCreator = exports.goPanelCreator = exports.setActiveModalCreator = exports.alertCreator = exports.errorAlertCreator = void 0;
const react_1 = __importDefault(require("react")); // React
const vkui_1 = require("@vkontakte/vkui");
const main_1 = require("../store/main");
const config_1 = require("../config");
const errorAlertCreator = (setPopout, error = null, action = null) => {
    setPopout(<vkui_1.Alert actionsLayout="horizontal" actions={[{
                title: 'Отмена',
                autoclose: true,
                mode: 'cancel',
                action: action,
            }]} onClose={() => setPopout(null)} header="Ошибка" text={error ? `${error}` : "Что-то пошло не так, попробуйте снова!"}/>);
};
exports.errorAlertCreator = errorAlertCreator;
const alertCreator = (setPopout, title, text) => {
    setPopout(<vkui_1.Alert actionsLayout="horizontal" actions={[{
                title: 'Закрыть',
                autoclose: true,
                mode: 'cancel',
            }]} onClose={() => setPopout(null)} header={title} text={text}/>);
};
exports.alertCreator = alertCreator;
const setActiveModalCreator = (setModal, setModalHistory, modalHistory, activeModal) => {
    activeModal = activeModal || null;
    let modalHistoryF = modalHistory ? [...modalHistory] : [];
    if (activeModal === null) {
        modalHistoryF = [];
    }
    else if (modalHistoryF.indexOf(activeModal) !== -1) {
        modalHistoryF = modalHistoryF.splice(0, modalHistoryF.indexOf(activeModal) + 1);
    }
    else {
        modalHistoryF.push(activeModal);
    }
    setModal(activeModal);
    setModalHistory(modalHistoryF);
};
exports.setActiveModalCreator = setActiveModalCreator;
const goPanelCreator = (setHistory, setActivePanel, historyPanelsState, panel) => {
    let history = [...historyPanelsState];
    history.push(panel);
    window.history.pushState({ panel: panel }, panel);
    setHistory(history);
    setActivePanel(panel);
};
exports.goPanelCreator = goPanelCreator;
const goOtherProfileCreator = (goPanel, activeStory, showErrorAlert, OtherProfileData, dispatch, id) => {
    // if (isEmptyObject(OtherProfileData) || OtherProfileData.id !== id) {
    fetch(config_1.API_URL + "method=user.getById&" + window.location.search.replace('?', ''), {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
            'id': id,
        })
    })
        .then(res => res.json())
        .then(data => {
        if (data.result) {
            dispatch(main_1.accountActions.setOtherProfile(data.response));
            goPanel(activeStory, "other_profile", true);
        }
        else {
            showErrorAlert(data.error.message);
        }
    })
        .catch(err => {
        goPanel('disconnect', 'load');
    });
    // }
};
exports.goOtherProfileCreator = goOtherProfileCreator;
