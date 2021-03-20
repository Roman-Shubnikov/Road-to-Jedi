import {API_URL} from '../../config';
import {
    accountActionTypes,
    viewsActionTypes,
    tiketsActionTypes,
    moderationActionTypes,
    } from './ActionTypes';
import { ForceErrorBackend, FetchFatalError } from './Errors'

export const accountActions = {
    setAccount: (payload) => ({type: accountActionTypes.SET_ACCOUNT, payload}),
    setMyquestions: (payload) => ({ type: accountActionTypes.SET_MYQUESTIONS, payload }),
    setScheme: (payload) => ({type: accountActionTypes.SET_SCHEME, payload}),
    setBanObject: (payload) => ({ type: accountActionTypes.SET_BAN_OBJECT, payload }),
    setRecomendations: (payload) => ({ type: accountActionTypes.SET_RECOMENDATIONS, payload }),
    setOtherProfile: (payload) => ({ type: accountActionTypes.SET_OTHER_PROFILE, payload }),
    getOtherProfile: (payload) => {
        return (dispatch) => {
        fetch(API_URL + "method=user.getById&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'id': payload,
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
            .then((data) => dispatch( getOtherProfileSuccess(data) ))
            .catch(err => {
                throw new FetchFatalError("Ошибка запроса")
                // this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})

            })
        }
    },

    
}

export const viewsActions = {
    setActiveStory: (payload) => ({ type: viewsActionTypes.SET_ACTIVE_STORY, payload}),
    setNeedEpic: (payload) => ({ type: viewsActionTypes.SET_NEED_EPIC, payload}),
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
}

export const moderationActions = {
    setData: (payload) => ({ type: moderationActionTypes.SET_DATA, payload }),
}



const getOtherProfileSuccess = (data) => {
    return ({ type: accountActionTypes.SET_OTHER_PROFILE, payload: data })
}

const getTicketSuccess = (data) => {
    return ({ type: tiketsActionTypes.SET_TICKET, payload: data })
}