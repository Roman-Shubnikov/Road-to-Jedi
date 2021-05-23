import {API_URL} from '../../config';
import {
    accountActionTypes,
    viewsActionTypes,
    tiketsActionTypes,
    moderationActionTypes,
    topUserActionTypes,
    faqActionTypes,
    } from './ActionTypes';
import { ForceErrorBackend, FetchFatalError } from './Errors'

export const accountActions = {
    setAccount: (payload) => ({type: accountActionTypes.SET_ACCOUNT, payload}),
    setMyquestions: (payload) => ({ type: accountActionTypes.SET_MYQUESTIONS, payload }),
    setScheme: (payload) => ({type: accountActionTypes.SET_SCHEME, payload}),
    setBanObject: (payload) => ({ type: accountActionTypes.SET_BAN_OBJECT, payload }),
    setRecomendations: (payload) => ({ type: accountActionTypes.SET_RECOMENDATIONS, payload }),
    setOtherProfile: (payload) => ({ type: accountActionTypes.SET_OTHER_PROFILE, payload }),

    
}

export const viewsActions = {
    setActiveStory: (payload) => ({ type: viewsActionTypes.SET_ACTIVE_STORY, payload}),
    setNeedEpic: (payload) => ({ type: viewsActionTypes.SET_NEED_EPIC, payload}),
}
export const topUsersActions = {
    setTop: (payload) => ({ type: topUserActionTypes.SET_TOP, payload}),
    setMode: (payload) => ({ type: topUserActionTypes.SET_MODE, payload}),
}
export const ticketActions = {
    setTickets: (payload) => ({ type: tiketsActionTypes.SET_TICKETS, payload }),
    setTicket: (payload) => (getTicketSuccess(payload)),
    getTicket: (payload) => {
        return (dispatch) => {
            fetch(API_URL + "method=ticket.getById&" + window.location.search.replace('?', ''),
                {
                    method: 'post',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                    body: JSON.stringify({
                        'ticket_id': payload,
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.result) {
                        return data.response;
                    } else {
                        throw new ForceErrorBackend(data.error.message)
                    }
                })
                .then((data) => dispatch(getTicketSuccess(data)))
                .catch(err => {
                    throw new FetchFatalError("Ошибка запроса")

                })
        }
    },
    setComment: (payload) => ({ type: tiketsActionTypes.SET_COMMENT, payload }),
    setOffset: (payload) => ({ type: tiketsActionTypes.SET_OFFSET, payload }),
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

const getTicketSuccess = (data) => {
    return ({ type: tiketsActionTypes.SET_TICKET, payload: data })
}