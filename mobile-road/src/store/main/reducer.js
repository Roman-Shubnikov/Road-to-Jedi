import { viewsStructure } from "../../config";
import {
    accountActionTypes, 
    viewsActionTypes, 
    tiketsActionTypes, 
    moderationActionTypes, 
    topUserActionTypes, 
    faqActionTypes,
    reportsActionTypes,
} from "./ActionTypes";

const initalStateAccount = {
    account: {},
    banInfo: null,
    schemeSettings: {
        scheme: "bright_light",
        default_scheme: "bright_light",
    },
    
    activeStory: 'loading',
    need_epic: false,
    other_profile: {},
    recomendations: null,
    myQuestions: null,

}
const initalStateViews = {
    account: {},
    scheme: "bright_light",
    default_scheme: "bright_light",
    activeStory: 'loading',
    activePanel: 'load',
    historyPanels: [{view: viewsStructure.Questions.navName, panel: 'questions'}],
    snackbar: null,
    need_epic: true,
    historyPanelsView: ['questions'],
}
const initalStateTickets = {
    comment: '',
    tickets: null,
    ticketsCurrent: null,
    ticketInfo: {},
    offset: 0,
    current_id: 0,
}
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

}
const initalStateTopUsers = {
    topAgents: {
        'all': null,
        'rating': null,
        'donut': null,
        'verif': null,
        'flash': null,
        'ghosts': null,
    },
    mode: false

}
const initalStateFaq = {
    categories: null,
    questions: null,
    activeCategory: null,
    activeQuestion: null, 
    searchResult: null,

}
const initalStateReports = {
    source: 0,
    type_rep: 0,
}

export const accountReducer = (state = initalStateAccount, action) => {
    switch(action.type) {
        case accountActionTypes.SET_ACCOUNT:
            return {...state, account: action.payload}
        case accountActionTypes.SET_SCHEME:
            return { ...state, schemeSettings: {...state.schemeSettings, ...action.payload}}
        case accountActionTypes.SET_OTHER_PROFILE:
            return { ...state, other_profile: action.payload }
        case accountActionTypes.SET_BAN_OBJECT:
            return { ...state, banInfo: action.payload }
        case accountActionTypes.SET_RECOMENDATIONS:
            return { ...state, recomendations: action.payload }
        case accountActionTypes.SET_MYQUESTIONS:
            return { ...state, myQuestions: action.payload }
        case accountActionTypes.SET_PUBLIC_STATUS:
            return { ...state, account: {...state.account, publicStatus: action.payload}}
        default: 
            return state

    }
}
export const viewsReducer = (state = initalStateViews, action) => {
    switch(action.type) {
        case viewsActionTypes.SET_ACTIVE_STORY:
            return {...state, activeStory: action.payload}
        case viewsActionTypes.SET_ACTIVE_PANEL:
            return {...state, activePanel: action.payload}
        case viewsActionTypes.SET_ACTIVE_SCENE:
            return {...state, activePanel: action.payload.panel, activeStory: action.payload.story}
        case viewsActionTypes.SET_HISTORY:
            let viewHistory = action.payload.map((obj, i) => obj.panel)
            return {...state, historyPanels: action.payload, historyPanelsView: viewHistory}
        case viewsActionTypes.SET_NEED_EPIC:
            return {...state, need_epic: action.payload}
        case viewsActionTypes.SET_SNACKBAR:
            return {...state, snackbar: action.payload}
        default: 
            return state
    }
}

export const ticketsReducer = (state = initalStateTickets, action) => {
    switch (action.type) {
        case tiketsActionTypes.SET_COMMENT:
            return { ...state, comment: action.payload }
        case tiketsActionTypes.SET_TICKETS:
            return { ...state, tickets: action.payload.tickets, ticketsCurrent: action.payload.ticketsCurrent}
        case tiketsActionTypes.SET_TICKET:
            return { ...state, ticketInfo: action.payload }
        case tiketsActionTypes.SET_OFFSET:
            return { ...state, offset: action.payload }
        case tiketsActionTypes.SET_TICKET_ID:
            return { ...state, current_id: action.payload }
        default:
            return state
    }
}
export const moderationReducer = (state = initalStateModeration, action) => {
    switch (action.type) {
        case moderationActionTypes.SET_DATA:
            return { ...state, moderationData: action.payload }
        default:
            return state
    }
}

export const topUsersReducer = (state = initalStateTopUsers, action) => {
    switch (action.type) {
        case topUserActionTypes.SET_TOP:
            return { ...state, topAgents: action.payload }
        case topUserActionTypes.SET_MODE:
            return { ...state, mode: action.payload }
        default:
            return state
    }
}
export const faqReducer = (state = initalStateFaq, action) => {
    switch (action.type) {
        case faqActionTypes.SET_CATEGORIES:
            return { ...state, categories: action.payload }
        case faqActionTypes.SET_QUESTIONS:
            return { ...state, questions: action.payload }
        case faqActionTypes.SET_ACTIVE_CATEGORY:
            return { ...state, activeCategory: action.payload }
        case faqActionTypes.SET_ACTIVE_QUESTION:
            return { ...state, activeQuestion: action.payload }
        case faqActionTypes.SET_SEARCH_RESULT_QUESTION:
            return { ...state, searchResult: action.payload }
        default:
            return state
    }
}
export const reportReducer = (state = initalStateReports, action) => {
    switch (action.type) {
        case reportsActionTypes.SET_RESOURCE_REPORT:
            return { ...state, source: action.payload }
        case reportsActionTypes.SET_TYPE_REPORT:
            return { ...state, type_rep: action.payload }
        default:
            return state
    }
}