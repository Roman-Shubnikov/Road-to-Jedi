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
const react_redux_1 = require("react-redux");
const icons_1 = require("@vkontakte/icons");
exports.default = props => {
    const [buttonSpinner, setButtonSpinner] = (0, react_1.useState)(false);
    const { globalError } = (0, react_redux_1.useSelector)((state) => state.views);
    return (<vkui_1.Panel id={props.id}>
            <vkui_1.PanelHeader>
                Ошибка
            </vkui_1.PanelHeader>
            <vkui_1.Group>
                <vkui_1.Placeholder icon={<icons_1.Icon56GlobeCrossOutline />} header='Ошибка' action={<>
                        <vkui_1.Button size='m' style={{ marginRight: 8, marginBottom: 8 }} href='https://vk.me/special_help' target="_blank" rel="noopener noreferrer">Связаться с нами</vkui_1.Button>
                        <vkui_1.Button size='m' loading={buttonSpinner} onClick={() => {
                setButtonSpinner(true);
                props.restart();
                setTimeout(() => {
                    setButtonSpinner(false);
                }, 1000);
            }}>Переподключится</vkui_1.Button>
                    </>}>
                        {globalError.name + ': ' + globalError.message}
                        <br />
                        {navigator.userAgent}
                        <br />
                        <br />
                        Дополнительная информация уже отправлена
                        <br />
                        При обращении в поддержку сделайте скриншот этого экрана
                    </vkui_1.Placeholder>
            </vkui_1.Group>

        </vkui_1.Panel>);
};
