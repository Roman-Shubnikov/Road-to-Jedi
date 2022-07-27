"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportReducer = exports.faqReducer = exports.topUsersReducer = exports.moderationReducer = exports.ticketsReducer = exports.viewsReducer = exports.accountReducer = void 0;
const config_1 = require("../../config");
const ActionTypes_1 = require("./ActionTypes");
const initalStateAccount = {
    account: null,
    banInfo: null,
    schemeSettings: {
        scheme: "vkcom_light",
        default_scheme: "vkcom_light",
    },
    activeStory: 'loading',
    need_epic: false,
    other_profile: {},
    recomendations: null,
    myQuestions: null,
    ads: 0,
};
const initalStateViews = {
    account: {},
    scheme: "vkcom_light",
    default_scheme: "vkcom_light",
    activeStory: config_1.viewsStructure.Profile.navName,
    activePanel: config_1.viewsStructure.Profile.panels.homepanel,
    historyPanels: [{ view: config_1.viewsStructure.Profile.navName,
            panel: config_1.viewsStructure.Profile.panels.homepanel }],
    snackbar: null,
    need_epic: true,
    popout: null,
    globalError: null,
    historyPanelsView: ['home'],
};
const initalStateTickets = {
    comment: '',
    tickets: null,
    myTickets: null,
    ticketInfo: {},
    offset: 0,
    current_id: 0,
};
const initalStateModeration = {
    moderationData: {
        answers: {
            offset: 0,
            count: 20,
            data: null,
            data_helper: null,
        },
        generator: {
            offset: 0,
            count: 20,
            data: null,
            data_helper: null,
        },
        questions: {
            offset: 0,
            count: 20,
            data: null,
            data_helper: null,
        },
        comments: {
            offset: 0,
            count: 20,
            data: null,
            data_helper: null,
        },
        verification: {
            offset: 0,
            count: 20,
            data: null,
            data_helper: null,
        },
        reports: {
            offset: 0,
            count: 20,
            data: null,
            data_helper: null,
        }
    },
    activeTab: 'control',
};
const initalStateTopUsers = {
    topAgents: {
        all: null,
        rating: null,
        donut: null,
        verif: null,
        flash: null,
        ghosts: null,
    },
    mode: false
};
const initalStateFaq = {
    categories: null,
    questions: null,
    activeCategory: null,
    activeQuestion: null,
    searchResult: null,
};
const initalStateReports = {
    source: 0,
    type_rep: 0,
};
const accountReducer = (state = initalStateAccount, action) => {
    switch (action.type) {
        case ActionTypes_1.accountActionTypes.SET_ACCOUNT:
            return Object.assign(Object.assign({}, state), { account: action.payload });
        case ActionTypes_1.accountActionTypes.SET_SCHEME:
            return Object.assign(Object.assign({}, state), { schemeSettings: Object.assign(Object.assign({}, state.schemeSettings), action.payload) });
        case ActionTypes_1.accountActionTypes.SET_OTHER_PROFILE:
            return Object.assign(Object.assign({}, state), { other_profile: action.payload });
        case ActionTypes_1.accountActionTypes.SET_BAN_OBJECT:
            return Object.assign(Object.assign({}, state), { banInfo: action.payload });
        case ActionTypes_1.accountActionTypes.SET_RECOMENDATIONS:
            return Object.assign(Object.assign({}, state), { recomendations: action.payload });
        case ActionTypes_1.accountActionTypes.SET_MYQUESTIONS:
            return Object.assign(Object.assign({}, state), { myQuestions: action.payload });
        case ActionTypes_1.accountActionTypes.SET_PUBLIC_STATUS:
            return Object.assign(Object.assign({}, state), { account: Object.assign(Object.assign({}, state.account), { publicStatus: action.payload }) });
        case ActionTypes_1.accountActionTypes.SET_ADS:
            return Object.assign(Object.assign({}, state), { ads: action.payload });
        default:
            return state;
    }
};
exports.accountReducer = accountReducer;
const viewsReducer = (state = initalStateViews, action) => {
    switch (action.type) {
        case ActionTypes_1.viewsActionTypes.SET_ACTIVE_STORY:
            return Object.assign(Object.assign({}, state), { activeStory: action.payload });
        case ActionTypes_1.viewsActionTypes.SET_ACTIVE_PANEL:
            return Object.assign(Object.assign({}, state), { activePanel: action.payload });
        case ActionTypes_1.viewsActionTypes.SET_ACTIVE_SCENE:
            return Object.assign(Object.assign({}, state), { activePanel: action.payload.panel, activeStory: action.payload.story });
        case ActionTypes_1.viewsActionTypes.SET_HISTORY:
            let viewHistory = action.payload.map((obj, i) => obj.panel);
            return Object.assign(Object.assign({}, state), { historyPanels: action.payload, historyPanelsView: viewHistory });
        case ActionTypes_1.viewsActionTypes.SET_NEED_EPIC:
            return Object.assign(Object.assign({}, state), { need_epic: action.payload });
        case ActionTypes_1.viewsActionTypes.SET_SNACKBAR:
            return Object.assign(Object.assign({}, state), { snackbar: action.payload });
        case ActionTypes_1.viewsActionTypes.SET_GLOBAL_ERROR:
            return Object.assign(Object.assign({}, state), { globalError: action.payload });
        case ActionTypes_1.viewsActionTypes.SET_POPOUT:
            return Object.assign(Object.assign({}, state), { popout: action.payload });
        default:
            return state;
    }
};
exports.viewsReducer = viewsReducer;
const ticketsReducer = (state = initalStateTickets, action) => {
    switch (action.type) {
        case ActionTypes_1.tiketsActionTypes.SET_COMMENT:
            return Object.assign(Object.assign({}, state), { comment: action.payload });
        case ActionTypes_1.tiketsActionTypes.SET_TICKETS:
            return Object.assign(Object.assign({}, state), { tickets: action.payload });
        case ActionTypes_1.tiketsActionTypes.SET_MY_TICKETS:
            return Object.assign(Object.assign({}, state), { myTickets: action.payload });
        case ActionTypes_1.tiketsActionTypes.SET_TICKET:
            return Object.assign(Object.assign({}, state), { ticketInfo: action.payload });
        case ActionTypes_1.tiketsActionTypes.SET_OFFSET:
            return Object.assign(Object.assign({}, state), { offset: action.payload });
        case ActionTypes_1.tiketsActionTypes.SET_TICKET_ID:
            return Object.assign(Object.assign({}, state), { current_id: action.payload });
        default:
            return state;
    }
};
exports.ticketsReducer = ticketsReducer;
const moderationReducer = (state = initalStateModeration, action) => {
    switch (action.type) {
        case ActionTypes_1.moderationActionTypes.SET_DATA:
            return Object.assign(Object.assign({}, state), { moderationData: action.payload });
        case ActionTypes_1.moderationActionTypes.SET_ACTIVE_TAB:
            return Object.assign(Object.assign({}, state), { activeTab: action.payload });
        default:
            return state;
    }
};
exports.moderationReducer = moderationReducer;
const topUsersReducer = (state = initalStateTopUsers, action) => {
    switch (action.type) {
        case ActionTypes_1.topUserActionTypes.SET_TOP:
            return Object.assign(Object.assign({}, state), { topAgents: action.payload });
        case ActionTypes_1.topUserActionTypes.SET_MODE:
            return Object.assign(Object.assign({}, state), { mode: action.payload });
        default:
            return state;
    }
};
exports.topUsersReducer = topUsersReducer;
const faqReducer = (state = initalStateFaq, action) => {
    switch (action.type) {
        case ActionTypes_1.faqActionTypes.SET_CATEGORIES:
            return Object.assign(Object.assign({}, state), { categories: action.payload });
        case ActionTypes_1.faqActionTypes.SET_QUESTIONS:
            return Object.assign(Object.assign({}, state), { questions: action.payload });
        case ActionTypes_1.faqActionTypes.SET_ACTIVE_CATEGORY:
            return Object.assign(Object.assign({}, state), { activeCategory: action.payload });
        case ActionTypes_1.faqActionTypes.SET_ACTIVE_QUESTION:
            return Object.assign(Object.assign({}, state), { activeQuestion: action.payload });
        case ActionTypes_1.faqActionTypes.SET_SEARCH_RESULT_QUESTION:
            return Object.assign(Object.assign({}, state), { searchResult: action.payload });
        default:
            return state;
    }
};
exports.faqReducer = faqReducer;
const reportReducer = (state = initalStateReports, action) => {
    switch (action.type) {
        case ActionTypes_1.reportsActionTypes.SET_RESOURCE_REPORT:
            return Object.assign(Object.assign({}, state), { source: action.payload });
        case ActionTypes_1.reportsActionTypes.SET_TYPE_REPORT:
            return Object.assign(Object.assign({}, state), { type_rep: action.payload });
        default:
            return state;
    }
};
exports.reportReducer = reportReducer;
