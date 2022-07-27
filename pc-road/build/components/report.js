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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const config_1 = require("../config");
const react_redux_1 = require("react-redux");
const main_1 = require("../store/main");
const reasons = [
    "Оскорбление",
    "Порнография",
    "Введение в заблуждение",
    "Реклама",
    "Вредоносные ссылки",
    "Сообщение не по теме",
    "Издевательство",
    "Другое",
];
exports.default = props => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const [comment, setComment] = (0, react_1.useState)('');
    const [typeReport, setTyperep] = (0, react_1.useState)('');
    const { source: sourceReport, type_rep: nameReport } = (0, react_redux_1.useSelector)(state => state.Reports);
    const setActiveStory = (0, react_1.useCallback)((story) => dispatch(main_1.viewsActions.setActiveStory(story)), [dispatch]);
    const { setPopout, showErrorAlert } = props.callbacks;
    const sendReport = () => {
        setPopout(<vkui_1.ScreenSpinner />);
        fetch(config_1.API_URL + "method=reports.send&" + window.location.search.replace('?', ''), { method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            // signal: controllertime.signal,
            body: JSON.stringify({
                'type': nameReport,
                'name': Number(typeReport),
                'id_rep': sourceReport,
                'comment': comment,
            })
        })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setPopout(<vkui_1.Alert actionsLayout="horizontal" actions={[{
                            title: 'Закрыть',
                            autoclose: true,
                            mode: 'cancel'
                        }]} onClose={() => window.history.back()} header="Принято!" text="Ваша жалоба будет рассмотрена модераторами в ближайшее время."/>);
            }
            else {
                showErrorAlert(data.error.message);
            }
        })
            .catch(err => {
            setActiveStory('disconnect');
        });
    };
    const validateComment = (title) => {
        if (title.length > 0) {
            let valid = ['error', 'Текст должен быть не больше 200 и не меньше 6 символов'];
            if (title.length <= 2000 && title.length > 5) {
                if (/^[a-zA-ZА-Яа-я0-9_ё .,"':!?*+=-]*$/ui.test(title)) {
                    valid = ['valid', ''];
                }
                else {
                    valid = ['error', 'Текст не должен содержать спец. символы'];
                }
            }
            return valid;
        }
        else {
            if (typeReport === "8")
                return ['error', 'При указании причины "Другое", обязательно укажите комментарий'];
        }
        return ['default', ''];
    };
    return (<vkui_1.Panel id={props.id}>
        <vkui_1.PanelHeader left={<vkui_1.PanelHeaderBack onClick={() => window.history.back()}></vkui_1.PanelHeaderBack>}>
                Жалоба
        </vkui_1.PanelHeader>
        <vkui_1.Group>
            <vkui_1.FormLayout>
                {reasons.map((res, i) => <vkui_1.Radio name="typerep" key={i} onChange={(e) => setTyperep(e.currentTarget.value)} defaultChecked={i === 0} value={String(i + 1)}>{res}</vkui_1.Radio>)}

                <vkui_1.FormItem top='Комментарий модератору' bottom={validateComment(comment)[1]} status={validateComment(comment)[0]}>
                    <vkui_1.Textarea name='comment' placeholder='Комментарий...' maxLength="200" onChange={(e) => { setComment(e.currentTarget.value); }} value={comment}/>
                </vkui_1.FormItem>
                <vkui_1.FormItem>
                    <vkui_1.Button disabled={(validateComment(comment)[0] === 'error') ||
            (comment === "" && typeReport === "8") ||
            (typeReport !== "8" ? false : validateComment(comment)[0] !== 'valid')} size='l' stretched type='submit' onClick={() => {
            sendReport();
        }}>
                        Отправить жалобу
                    </vkui_1.Button>
                </vkui_1.FormItem>
            </vkui_1.FormLayout>
        </vkui_1.Group>  
    </vkui_1.Panel>);
};
