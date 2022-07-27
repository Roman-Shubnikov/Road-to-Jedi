"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketSelector = exports.reportsActions = exports.moderationActions = exports.faqActions = exports.ticketActions = exports.topUsersActions = exports.viewsActions = exports.accountActions = void 0;
const ActionTypes_1 = require("./ActionTypes");
exports.accountActions = {
    setAccount: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_ACCOUNT, payload }),
    setMyquestions: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_MYQUESTIONS, payload }),
    setScheme: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_SCHEME, payload }),
    setBanObject: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_BAN_OBJECT, payload }),
    setRecomendations: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_RECOMENDATIONS, payload }),
    setOtherProfile: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_OTHER_PROFILE, payload }),
    setPublicStatus: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_PUBLIC_STATUS, payload }),
    setAds: (payload) => ({ type: ActionTypes_1.accountActionTypes.SET_ADS, payload }),
};
exports.viewsActions = {
    setActiveStory: (payload) => ({ type: ActionTypes_1.viewsActionTypes.SET_ACTIVE_STORY, payload }),
    setActivePanel: (payload) => ({ type: ActionTypes_1.viewsActionTypes.SET_ACTIVE_PANEL, payload }),
    setActiveScene: (story, panel) => {
        let payload = { story, panel };
        return { type: ActionTypes_1.viewsActionTypes.SET_ACTIVE_SCENE, payload };
    },
    setHistory: (payload) => ({ type: ActionTypes_1.viewsActionTypes.SET_HISTORY, payload }),
    setNeedEpic: (payload) => ({ type: ActionTypes_1.viewsActionTypes.SET_NEED_EPIC, payload }),
    setSnackbar: (payload) => ({ type: ActionTypes_1.viewsActionTypes.SET_SNACKBAR, payload }),
    setPopout: (payload) => ({ type: ActionTypes_1.viewsActionTypes.SET_POPOUT, payload }),
    setGlobalError: (payload) => ({ type: ActionTypes_1.viewsActionTypes.SET_GLOBAL_ERROR, payload })
};
exports.topUsersActions = {
    setTop: (payload) => ({ type: ActionTypes_1.topUserActionTypes.SET_TOP, payload }),
    setMode: (payload) => ({ type: ActionTypes_1.topUserActionTypes.SET_MODE, payload }),
};
exports.ticketActions = {
    setTickets: (payload) => ({ type: ActionTypes_1.tiketsActionTypes.SET_TICKETS, payload }),
    setMyTickets: (payload) => ({ type: ActionTypes_1.tiketsActionTypes.SET_MY_TICKETS, payload }),
    setTicket: (payload) => ({ type: ActionTypes_1.tiketsActionTypes.SET_TICKET, payload: payload }),
    setComment: (payload) => ({ type: ActionTypes_1.tiketsActionTypes.SET_COMMENT, payload }),
    setOffset: (payload) => ({ type: ActionTypes_1.tiketsActionTypes.SET_OFFSET, payload }),
    setTicketId: (payload) => ({ type: ActionTypes_1.tiketsActionTypes.SET_TICKET_ID, payload }),
};
exports.faqActions = {
    setCategories: (payload) => ({ type: ActionTypes_1.faqActionTypes.SET_CATEGORIES, payload }),
    setActiveCategory: (payload) => ({ type: ActionTypes_1.faqActionTypes.SET_ACTIVE_CATEGORY, payload }),
    setActiveQuestion: (payload) => ({ type: ActionTypes_1.faqActionTypes.SET_ACTIVE_QUESTION, payload }),
    setQuestions: (payload) => ({ type: ActionTypes_1.faqActionTypes.SET_QUESTIONS, payload }),
    setSearchResultQuestions: (payload) => ({ type: ActionTypes_1.faqActionTypes.SET_SEARCH_RESULT_QUESTION, payload }),
};
exports.moderationActions = {
    setData: (payload) => ({ type: ActionTypes_1.moderationActionTypes.SET_DATA, payload }),
    setActiveTab: (payload) => ({ type: ActionTypes_1.moderationActionTypes.SET_ACTIVE_TAB, payload }),
};
exports.reportsActions = {
    setTypeReport: (payload) => ({ type: ActionTypes_1.reportsActionTypes.SET_TYPE_REPORT, payload }),
    setResourceReport: (payload) => ({ type: ActionTypes_1.reportsActionTypes.SET_RESOURCE_REPORT, payload }),
};
const ticketSelector = state => state.tickets;
exports.ticketSelector = ticketSelector;
