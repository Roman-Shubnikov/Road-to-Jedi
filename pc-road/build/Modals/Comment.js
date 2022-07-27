"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalComment = void 0;
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const react_anchorme_1 = require("react-anchorme");
const icons_1 = require("@vkontakte/icons");
const Utils_1 = require("../Utils");
const config_1 = require("../config");
const ModalComment = props => {
    const platform = (0, vkui_1.usePlatform)();
    const Comment = props.comment.objComment;
    return (<vkui_1.ModalPage id={props.id} onClose={props.onClose} header={<vkui_1.ModalPageHeader right={platform === vkui_1.IOS && <vkui_1.Header onClick={props.onClose}><icons_1.Icon24Dismiss /></vkui_1.Header>} left={platform === vkui_1.ANDROID && <vkui_1.PanelHeaderButton onClick={props.onClose}><icons_1.Icon24Dismiss /></vkui_1.PanelHeaderButton>}>
            Комментарий
          </vkui_1.ModalPageHeader>}>
          <vkui_1.Group>
            {Comment.avatar && <vkui_1.MiniInfoCell before={Comment.author_id === -1 ? <icons_1.Icon20SkullOutline /> : <icons_1.Icon20UserOutline />} after={<vkui_1.UsersStack photos={[config_1.AVATARS_URL + Comment.avatar]}/>}>
              {Comment.nickname ? Comment.nickname : `Специальный агент #${Comment.author_id}`}
              
          </vkui_1.MiniInfoCell>}
          <vkui_1.MiniInfoCell before={<icons_1.Icon20ArticleOutline />} textWrap='full'>
            <vkui_1.Text style={{ whiteSpace: "pre-wrap", wordBreak: 'break-word' }} weight='regular'>
                <react_anchorme_1.Anchorme onClick={(e) => { e.stopPropagation(); }} target="_blank" rel="noreferrer noopener">
            {Comment.text}
                </react_anchorme_1.Anchorme>
              </vkui_1.Text>
          </vkui_1.MiniInfoCell>
          <vkui_1.MiniInfoCell before={<icons_1.Icon20RecentOutline />}>
              {(0, Utils_1.getHumanyTime)(Comment.time).datetime}
          </vkui_1.MiniInfoCell>
          {Comment.bomb_time > 0 && props.comment.mark === -1 && <vkui_1.MiniInfoCell textWrap='full' before={<icons_1.Icon20BombOutline style={{ color: "var(--dynamic_red)", }} className={'blink2'}/>}>
              Исправить ответ можно до {(0, Utils_1.getHumanyTime)(Comment.bomb_time).datetime}
          </vkui_1.MiniInfoCell>}
          </vkui_1.Group>
          <vkui_1.Group>
            <vkui_1.CellButton size="m" href="https://vk.me/club201542328" target="_blank" rel="noreferrer noopener" centered>Коментарий вызывал вопрос?</vkui_1.CellButton>
              {Comment.author_id === -1 || <vkui_1.CellButton size="m" mode='danger' centered onClick={() => {
                props.onClose();
                props.reporting(1, props.comment.message_id);
            }}>Пожаловаться</vkui_1.CellButton>}
          </vkui_1.Group>
            
         
    </vkui_1.ModalPage>);
};
exports.ModalComment = ModalComment;
