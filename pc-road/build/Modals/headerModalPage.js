"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react")); // React
const vkui_1 = require("@vkontakte/vkui");
const icons_1 = require("@vkontakte/icons");
exports.default = props => {
    const platform = (0, vkui_1.usePlatform)();
    return (<vkui_1.ModalPageHeader right={platform === vkui_1.IOS && <vkui_1.Header onClick={props.onClick}><icons_1.Icon24Dismiss /></vkui_1.Header>} left={platform === vkui_1.ANDROID && <vkui_1.PanelHeaderButton onClick={props.onClick}><icons_1.Icon24Dismiss /></vkui_1.PanelHeaderButton>}>
            {props.children}
        </vkui_1.ModalPageHeader>);
};
