"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reducers = void 0;
const redux_1 = require("redux");
const main_1 = require("./main");
exports.reducers = (0, redux_1.combineReducers)({
    account: main_1.accountReducer,
    views: main_1.viewsReducer,
    tickets: main_1.ticketsReducer,
    moderation: main_1.moderationReducer,
    topUsers: main_1.topUsersReducer,
    Faq: main_1.faqReducer,
    Reports: main_1.reportReducer,
});
