import React from 'react'; // React
import {
    Alert,

} from '@vkontakte/vkui';
import { accountActions, FetchFatalError, ForceErrorBackend } from '../store/main';
import { isEmptyObject } from 'jquery';

export const errorAlertCreator = (setPopout, error = null, action = null) => {
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
export const alertCreator = (setPopout, title, text) => {
    setPopout(
        <Alert
            actionsLayout="horizontal"
            actions={[{
                title: 'Закрыть',
                autoclose: true,
                mode: 'cancel',
            }]}
            onClose={() => setPopout(null)}
            header={title}
            text={text}
        />
    )
}
export const setActiveModalCreator = (setModal, setModalHistory, modalHistory, activeModal) => {
    activeModal = activeModal || null;
    let modalHistoryF = modalHistory ? [...modalHistory] : [];

    if (activeModal === null) {
        modalHistoryF = [];
    } else if (modalHistoryF.indexOf(activeModal) !== -1) {
        modalHistoryF = modalHistoryF.splice(0, modalHistoryF.indexOf(activeModal) + 1);
    } else {
        modalHistoryF.push(activeModal);
    }
    setModal(activeModal);
    setModalHistory(modalHistoryF)
}
export const goPanelCreator = (setHistory, setActivePanel, historyPanelsState, panel) => {
    let history = [...historyPanelsState];
    history.push(panel)
    window.history.pushState({ panel: panel }, panel);
    setHistory(history);
    setActivePanel(panel)
}
export const goOtherProfileCreator = (goPanel, setActiveStory, showErrorAlert, OtherProfileData, dispatch, id) => {
    if (isEmptyObject(OtherProfileData) || OtherProfileData.id !== id) {
        try {
            dispatch(accountActions.getOtherProfile(id))
        } catch (error) {
            if (error instanceof FetchFatalError) setActiveStory('disconnect');
            if (error instanceof ForceErrorBackend) showErrorAlert(error.message);
        }
    }
    goPanel("other_profile")
}
