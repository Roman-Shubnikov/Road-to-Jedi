"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = void 0;
const redux_1 = require("redux");
const reducers_1 = require("./reducers");
const redux_thunk_1 = __importDefault(require("redux-thunk"));
const extension_1 = require("@redux-devtools/extension");
exports.store = (0, redux_1.createStore)(reducers_1.reducers, (0, extension_1.composeWithDevTools)((0, redux_1.applyMiddleware)(redux_thunk_1.default)));
