import { applyMiddleware, createStore } from "redux";
import { reducers } from "./reducers";
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

export const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(thunk))
    );

export type StoreObject = {
    views: {
        activeStory: string,
    },
    account: { 
        account: {
            id: number,
            flash: number,
            donut: number,
            verified: number,
            good_answers: number,
            bad_answers: number,
            permissions: number,
            publicStatus: string,
            settings: {
                notify: boolean
            },
            donut_chat_link: string,
            notif_count: number,
            avatar: {
                id: number,
                url: string,
            },
            nickname: string,

        }
    },

};