"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vkui_1 = require("@vkontakte/vkui");
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const Cat_svg_1 = __importDefault(require("./images/Cat.svg"));
exports.default = props => {
    const TicketInfo = (0, react_redux_1.useSelector)((state) => state.tickets.ticketInfo.info);
    return (<vkui_1.Panel id={props.id}>
            <vkui_1.PanelHeader left={<vkui_1.PanelHeaderBack onClick={() => window.history.back()}></vkui_1.PanelHeaderBack>}>
                    Вопрос #{TicketInfo ? TicketInfo.id : "..."}
            </vkui_1.PanelHeader>
            <vkui_1.Placeholder stretched action={<vkui_1.Button size='m' onClick={() => window.history.back()}>
                    Вопросы
                </vkui_1.Button>} icon={<img style={{ width: 150, height: 150 }} src={Cat_svg_1.default} alt='jedi'/>} header='Вы дали ответ'>
                Ваш ответ был отправлен на модерацию к специльным агентам. Самое время переходить к другим вопросам.
            </vkui_1.Placeholder>
        </vkui_1.Panel>);
};
