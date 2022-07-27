"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Questions = void 0;
const react_1 = __importDefault(require("react")); // React
const vkui_1 = require("@vkontakte/vkui");
require("@vkontakte/vkui/dist/vkui.css");
// Импортируем панели
const panels_1 = require("./panels");
const react_redux_1 = require("react-redux");
const Questions = props => {
    const { activePanel, historyPanelsView } = (0, react_redux_1.useSelector)((state) => state.views);
    return (<vkui_1.View id={props.id} activePanel={activePanel} history={historyPanelsView} onSwipeBack={() => window.history.back()}>
      <panels_1.Home id='home'/>
    </vkui_1.View>);
};
exports.Questions = Questions;
