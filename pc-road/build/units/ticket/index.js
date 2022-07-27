"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticket = void 0;
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const Message_1 = require("../../components/Message");
const Ticket = props => {
    return (<>
            <vkui_1.Group>
                <vkui_1.SimpleCell>
                    Название тикета (Заголовок)
                </vkui_1.SimpleCell>
            </vkui_1.Group>
            <vkui_1.Group>
                <Message_1.Message>
                    Тестовый текст
                </Message_1.Message>
            </vkui_1.Group>
        </>);
};
exports.Ticket = Ticket;
