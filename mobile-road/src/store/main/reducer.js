import {accountActionTypes, viewsActionTypes, tiketsActionTypes, moderationActionTypes} from "./ActionTypes";

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
    need_epic: true,
}
const initalStateTickets = {
    comment: '',
    tickets: null,
    ticketsCurrent: null,
    ticketInfo: {},
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

export const accountReducer = (state = initalStateAccount, action) => {
    switch(action.type) {
        case accountActionTypes.SET_ACCOUNT:
            return {...state, account: action.payload}
        case accountActionTypes.SET_SCHEME:
            return { ...state, schemeSettings: action.payload}
        case accountActionTypes.SET_OTHER_PROFILE:
            return { ...state, other_profile: action.payload }
        case accountActionTypes.SET_BAN_OBJECT:
            return { ...state, banInfo: action.payload }
        case accountActionTypes.SET_RECOMENDATIONS:
            return { ...state, recomendations: action.payload }
        case accountActionTypes.SET_MYQUESTIONS:
            return { ...state, myQuestions: action.payload }
        default: 
            return state

    }
}
export const viewsReducer = (state = initalStateViews, action) => {
    switch(action.type) {
        case viewsActionTypes.SET_ACTIVE_STORY:
            return {...state, activeStory: action.payload}
        case viewsActionTypes.SET_NEED_EPIC:
            return {...state, need_epic: action.payload}
        default: 
            return state
    }
}

export const ticketsReducer = (state = initalStateTickets, action) => {
    switch (action.type) {
        case tiketsActionTypes.SET_COMMENT:
            return { ...state, comment: action.payload }
        case tiketsActionTypes.SET_TICKETS:
            return { ...state, tickets: action.payload.tickets, ticketsCurrent: action.payload.ticketsCurrent }
        case tiketsActionTypes.SET_TICKET:
            return { ...state, ticketInfo: action.payload }
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