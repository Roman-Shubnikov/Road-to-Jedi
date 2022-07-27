"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_dom_1 = __importDefault(require("react-dom"));
const react_redux_1 = require("react-redux");
const App_1 = __importDefault(require("./App"));
const vkui_1 = require("@vkontakte/vkui");
const store_1 = require("./store");
const mvk_mini_apps_scroll_helper_1 = __importDefault(require("@vkontakte/mvk-mini-apps-scroll-helper"));
const root = document.getElementById('root');
if ((0, vkui_1.platform)() === vkui_1.IOS) {
    (0, mvk_mini_apps_scroll_helper_1.default)(root);
}
if (process.env.NODE_ENV === "development") {
    Promise.resolve().then(() => __importStar(require("./eruda"))).then(({ default: eruda }) => { }); //runtime download
}
const ReduxApp = () => (<react_redux_1.Provider store={store_1.store}>
    <App_1.default />
  </react_redux_1.Provider>);
react_dom_1.default.render(<ReduxApp />, root);
