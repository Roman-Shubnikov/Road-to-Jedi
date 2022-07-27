"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GreenCard = void 0;
const react_1 = __importDefault(require("react"));
require("./greencard.css");
const vkui_1 = require("@vkontakte/vkui");
const GreenCard = ({ header, children }) => {
    return (<vkui_1.FormStatus header={header} className='green-card'>
            {children}
        </vkui_1.FormStatus>);
};
exports.GreenCard = GreenCard;
