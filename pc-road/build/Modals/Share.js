"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalShare2 = exports.ModalShare = void 0;
const react_1 = __importDefault(require("react")); // React
const vkui_1 = require("@vkontakte/vkui");
const headerModalPage_1 = __importDefault(require("./headerModalPage"));
const vk_bridge_1 = __importDefault(require("@vkontakte/vk-bridge")); // VK Brige
const config_1 = require("../config");
const icons_1 = require("@vkontakte/icons");
const react_redux_1 = require("react-redux");
const ModalShare = ({ id, onClick, setActiveModal, setSnackbar }) => {
    const account = (0, react_redux_1.useSelector)((state) => (state.account.account));
    return (<vkui_1.ModalPage id={id} onClose={onClick} header={<headerModalPage_1.default onClick={onClick}>
                Поделиться
            </headerModalPage_1.default>}>
          <vkui_1.Group>
            <vkui_1.Cell onClick={() => setActiveModal("qr")} before={<icons_1.Icon24Qr width={28} height={28}/>}>QR-код профиля</vkui_1.Cell>
            <vkui_1.Cell onClick={() => {
            vk_bridge_1.default.send("VKWebAppCopyText", { text: config_1.LINK_APP + "#agent_id=" + account['id'] });
            setActiveModal(null);
            setSnackbar(<vkui_1.Snackbar layout="vertical" onClose={() => setSnackbar(null)} before={<vkui_1.Avatar size={24} style={config_1.blueBackground}><icons_1.Icon16CheckCircle fill="#fff" width={14} height={14}/></vkui_1.Avatar>}>
                Ссылка скопирована
                    </vkui_1.Snackbar>);
        }} before={<icons_1.Icon24Linked width={28} height={28}/>}>Скопировать ссылку</vkui_1.Cell>
          </vkui_1.Group>
          
      </vkui_1.ModalPage>);
};
exports.ModalShare = ModalShare;
const ModalShare2 = ({ id, onClick, sharing_type }) => {
    return (<vkui_1.ModalPage id={id} onClose={onClick} header={<headerModalPage_1.default onClick={onClick}>
          Рассказать
        </headerModalPage_1.default>}>
        <vkui_1.Group>
          <vkui_1.Cell onClick={() => vk_bridge_1.default.send("VKWebAppShowWallPostBox", {
            message: config_1.POST_TEXTS[sharing_type]['text'],
            attachments: config_1.POST_TEXTS[sharing_type]['image']
        })} before={<icons_1.Icon28NewsfeedOutline />}>
            На стене
          </vkui_1.Cell>
          <vkui_1.Cell before={<icons_1.Icon28StoryAddOutline />} onClick={() => {
            vk_bridge_1.default.send("VKWebAppShowStoryBox", {
                background_type: "image",
                url: config_1.HISTORY_IMAGES[sharing_type]['image'],
                attachment: {
                    "type": "url",
                    "url": config_1.LINK_APP,
                    "text": "learn_more"
                }
            });
        }}>
            В истории
          </vkui_1.Cell>
        </vkui_1.Group>
          
    </vkui_1.ModalPage>);
};
exports.ModalShare2 = ModalShare2;
