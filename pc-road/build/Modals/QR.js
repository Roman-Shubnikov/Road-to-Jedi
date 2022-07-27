"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidQR = exports.InvalidQR = exports.ShowQR = void 0;
const react_1 = __importDefault(require("react")); // React
const vkui_1 = require("@vkontakte/vkui");
const vk_qr_1 = __importDefault(require("@vkontakte/vk-qr"));
const headerModalPage_1 = __importDefault(require("./headerModalPage"));
const icons_1 = require("@vkontakte/icons");
const config_1 = require("../config");
const react_redux_1 = require("react-redux");
function qr(agent_id, sheme) {
    let hex = "foregroundColor";
    if (sheme === "bright_light" || sheme === "vkcom_light") {
        hex = "#000";
    }
    if (sheme === "space_gray" || sheme === "vkcom_dark") {
        hex = "#fff";
    }
    return (vk_qr_1.default.createQR(config_1.LINK_APP + '#agent_id=' + agent_id, {
        qrSize: 120,
        isShowLogo: true,
        foregroundColor: hex,
        className: 'svgqr'
    }));
}
const ShowQR = ({ id, onClick }) => {
    const { account, schemeSettings } = (0, react_redux_1.useSelector)((state) => state.account);
    const { scheme } = schemeSettings;
    return (<vkui_1.ModalPage id={id} onClose={onClick} dynamicContentHeight header={<headerModalPage_1.default onClick={onClick}>QR-код профиля</headerModalPage_1.default>}>
        {<div className="qr" dangerouslySetInnerHTML={{ __html: qr(account.id, scheme) }}/>}
        <br />
        <div className="qr">Отсканируйте камерой ВКонтакте!</div>
        <br />
      </vkui_1.ModalPage>);
};
exports.ShowQR = ShowQR;
const InvalidQR = ({ id, onClick }) => {
    return (<vkui_1.ModalCard id={id} onClose={onClick} icon={<icons_1.Icon56ErrorOutline />} header="Промокод недействительный" caption={<span>
            Увы, активировать промокод не получится, так как он использовался ранее или его никогда не существовало.
                </span>} actions={<vkui_1.Button mode='secondary' stretched size='l' onClick={onClick}>Понятно</vkui_1.Button>}/>);
};
exports.InvalidQR = InvalidQR;
const ValidQR = ({ id, onClick, moneyPromo }) => {
    return (<vkui_1.ModalCard id={id} onClose={onClick} icon={<icons_1.Icon56CheckCircleOutline />} header="Вы активировали промокод!" caption={<span>
        Поздравляем! На Ваш виртуальный счет было начислено {moneyPromo} ECoin.
            </span>} actions={<vkui_1.Button mode='primary' stretched size='l' onClick={onClick}>Ура!</vkui_1.Button>}/>);
};
exports.ValidQR = ValidQR;
