"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoArrows = void 0;
const react_1 = __importDefault(require("react"));
require("./infoarrows.css");
const vkui_1 = require("@vkontakte/vkui");
const Utils_1 = require("../../Utils");
const InfoCounter_1 = require("../InfoCounter");
const InfoArrows = ({ good_answers, bad_answers, special }) => {
    const total_answers = good_answers ? good_answers + bad_answers : '';
    return (<vkui_1.Div style={{ display: 'flex', textAlign: 'center', alignItems: 'center', justifyContent: 'space-around' }}>
            {special ?
            <>
                <InfoCounter_1.InfoCounter value={(0, Utils_1.recog_number)(good_answers)} caption='всего оценок'/>
                <InfoCounter_1.InfoCounter value={(0, Utils_1.recog_number)(bad_answers)} caption={(0, Utils_1.enumerate)(bad_answers, ['сгенерированный вопрос', 'сгенерированных вопроса', 'сгенерированных вопросов'])}/>
                </>
            :
                <>
                <InfoCounter_1.InfoCounter value={(0, Utils_1.recog_number)(good_answers)} caption={(0, Utils_1.enumerate)(good_answers, ['положительный ответ', 'положительных ответа', 'положительных ответов'])}/>
                <InfoCounter_1.InfoCounter value={(0, Utils_1.recog_number)(bad_answers)} caption={(0, Utils_1.enumerate)(bad_answers, ['отрицательный ответ', 'отрицательных ответа', 'отрицательных ответов'])}/>
                <InfoCounter_1.InfoCounter value={(0, Utils_1.recog_number)(total_answers)} caption='всего ответов'/>
                </>}
            </vkui_1.Div>);
};
exports.InfoArrows = InfoArrows;
