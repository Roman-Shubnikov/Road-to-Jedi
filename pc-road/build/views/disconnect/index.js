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
exports.Disconnect = void 0;
const react_1 = __importStar(require("react")); // React
const vkui_1 = require("@vkontakte/vkui");
require("@vkontakte/vkui/dist/vkui.css");
// Импортируем панели
const home_1 = __importDefault(require("./panels/home"));
const react_redux_1 = require("react-redux");
const main_1 = require("../../store/main");
const Disconnect = props => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { activePanel, historyPanelsView } = (0, react_redux_1.useSelector)((state) => state.views);
    (0, react_1.useEffect)(() => {
        dispatch(main_1.viewsActions.setNeedEpic(false));
        return () => {
            dispatch(main_1.viewsActions.setNeedEpic(true));
        };
    }, [dispatch]);
    return (<vkui_1.View id={props.id} activePanel={activePanel} history={historyPanelsView} onSwipeBack={() => window.history.back()}>
      <home_1.default id='load' restart={props.AppInit}/>
    </vkui_1.View>);
};
exports.Disconnect = Disconnect;
