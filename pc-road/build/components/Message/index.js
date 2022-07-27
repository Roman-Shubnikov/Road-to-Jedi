"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Message = void 0;
const react_1 = __importDefault(require("react"));
const icons_1 = require("@vkontakte/icons");
const vkui_1 = require("@vkontakte/vkui");
const Utils_1 = require("../../Utils");
const message_css_1 = __importDefault(require("./message.css"));
const Message = props => {
    const { avatar_url, author_name, children, time, action = null, specialLabel = null, } = props;
    const clickMark = (e) => {
        e.stopPropagation();
        props.markAlert();
    };
    return (<vkui_1.RichCell before={<vkui_1.Avatar src={avatar_url} alt='avatar'/>} text={children} after={action && <vkui_1.IconButton aria-label='Меню' onClick={action}><icons_1.Icon24MoreHorizontal /></vkui_1.IconButton>} caption={(0, Utils_1.getHumanyTime)(time).datetime}>
            {author_name} {specialLabel && <span className={message_css_1.default.specialLabel}>' · '+specialLabel</span>}
        </vkui_1.RichCell>);
};
exports.Message = Message;
