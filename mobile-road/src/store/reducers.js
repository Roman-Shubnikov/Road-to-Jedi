import { combineReducers } from "redux";
import {
    accountReducer as account,
    viewsReducer as views,
    ticketsReducer as tickets,
    moderationReducer as moderation,
    topUsersReducer as topUsers,

} from "./main";

export const reducers = combineReducers({
    account,
    views,
    tickets,
    moderation,
    topUsers
})