import {
    accountActionTypes,
    viewsActionTypes,
    tiketsActionTypes,
    moderationActionTypes,
    topUserActionTypes,
    faqActionTypes,
    reportsActionTypes,
    } from './ActionTypes';

export const accountActions = {
    setAccount: (payload) => ({type: accountActionTypes.SET_ACCOUNT, payload}),
    setMyquestions: (payload) => ({ type: accountActionTypes.SET_MYQUESTIONS, payload }),
    setScheme: (payload) => ({type: accountActionTypes.SET_SCHEME, payload}),
    setBanObject: (payload) => ({ type: accountActionTypes.SET_BAN_OBJECT, payload }),
    setRecomendations: (payload) => ({ type: accountActionTypes.SET_RECOMENDATIONS, payload }),
    setOtherProfile: (payload) => ({ type: accountActionTypes.SET_OTHER_PROFILE, payload }),
    setPublicStatus: (payload) => ({ type: accountActionTypes.SET_PUBLIC_STATUS, payload }),
    
}

export const viewsActions = {
    setActiveStory: (payload) => ({ type: viewsActionTypes.SET_ACTIVE_STORY, payload}),
    setActivePanel: (payload) => ({ type: viewsActionTypes.SET_ACTIVE_PANEL, payload}),
    setActiveScene: (story, panel) => {
        let payload = {story, panel};
        return { type: viewsActionTypes.SET_ACTIVE_SCENE, payload}},
    setHistory: (payload) => ({ type: viewsActionTypes.SET_HISTORY, payload}),
    setNeedEpic: (payload) => ({ type: viewsActionTypes.SET_NEED_EPIC, payload}),
    setSnackbar: (payload) => ({ type: viewsActionTypes.SET_SNACKBAR, payload}),
}
export const topUsersActions = {
    setTop: (payload) => ({ type: topUserActionTypes.SET_TOP, payload}),
    setMode: (payload) => ({ type: topUserActionTypes.SET_MODE, payload}),
}
export const ticketActions = {
    setTickets: (payload) => ({ type: tiketsActionTypes.SET_TICKETS, payload }),
    setTicket: (payload) => ({ type: tiketsActionTypes.SET_TICKET, payload: payload }),
    setComment: (payload) => ({ type: tiketsActionTypes.SET_COMMENT, payload }),
    setOffset: (payload) => ({ type: tiketsActionTypes.SET_OFFSET, payload }),
    setTicketId: (payload) => ({ type: tiketsActionTypes.SET_TICKET_ID, payload }),
}

export const faqActions = {
    setCategories: (payload) => ({type: faqActionTypes.SET_CATEGORIES, payload}),
    setActiveCategory: (payload) => ({type: faqActionTypes.SET_ACTIVE_CATEGORY, payload}),
    setActiveQuestion: (payload) => ({type: faqActionTypes.SET_ACTIVE_QUESTION, payload}),
    setQuestions: (payload) => ({type: faqActionTypes.SET_QUESTIONS, payload}),
    setSearchResultQuestions: (payload) => ({type: faqActionTypes.SET_SEARCH_RESULT_QUESTION, payload}),

}

export const moderationActions = {
    setData: (payload) => ({ type: moderationActionTypes.SET_DATA, payload }),
}
export const reportsActions = {
    setTypeReport: (payload) => ({type: reportsActionTypes.SET_TYPE_REPORT, payload}),
    setResourceReport: (payload) => ({type: reportsActionTypes.SET_RESOURCE_REPORT, payload}),
}