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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const vk_bridge_1 = __importDefault(require("@vkontakte/vk-bridge")); // VK Brige
const vkui_1 = require("@vkontakte/vkui");
const icons_1 = require("@vkontakte/icons");
const react_redux_1 = require("react-redux");
const react_2 = require("react");
const config_1 = require("../config");
const jquery_1 = require("jquery");
const Utils_1 = require("../Utils");
const InfoArrows_1 = __importDefault(require("./InfoArrows"));
const ProfileTags_1 = require("./ProfileTags");
const NOTI = [
    'Выключены',
    'Включены'
];
const blueBackground = {
    backgroundColor: 'var(--accent)'
};
exports.default = props => {
    const [snackbar, setSnackbar] = (0, react_2.useState)(null);
    const profRef = (0, react_1.useRef)(null);
    const { setPopout, setActiveModal, setReport } = props.callbacks;
    const { other_profile: OtherProfileData, account } = (0, react_redux_1.useSelector)((state) => (state.account));
    const { online, id: agent_id, nickname, flash, verified: verif, vk_id, banned, avatar, donut, good_answers, bad_answers, balance, donuts, } = OtherProfileData;
    const total_answers = good_answers + bad_answers;
    const permissions = account.permissions;
    const admin_permission = permissions >= config_1.PERMISSIONS.admin;
    const is_private = OtherProfileData.permissions >= config_1.PERMISSIONS.special && account.permissions < config_1.PERMISSIONS.special;
    const infoMenu = (id) => {
        setPopout(<vkui_1.ActionSheet onClose={() => setPopout(null)} toggleRef={profRef.current} iosCloseItem={<vkui_1.ActionSheetItem autoclose mode="cancel">Отменить</vkui_1.ActionSheetItem>}>
                {admin_permission ?
                <vkui_1.ActionSheetItem autoclose onClick={() => { setActiveModal('ban_user'); }} before={<icons_1.Icon28BlockOutline />}>
                        Заблокировать
                    </vkui_1.ActionSheetItem>
                : null}
                <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28CopyOutline />} onClick={() => {
                vk_bridge_1.default.send("VKWebAppCopyText", { text: config_1.LINK_APP + "#agent_id=" + id });
                setSnackbar(<vkui_1.Snackbar layout="vertical" onClose={() => setSnackbar(null)} before={<vkui_1.Avatar size={24} style={blueBackground}><icons_1.Icon16CheckCircle fill="#fff" width={14} height={14}/></vkui_1.Avatar>}>
                            Ссылка скопирована
                        </vkui_1.Snackbar>);
            }}>
                    Скопировать ссылку
                </vkui_1.ActionSheetItem>
                <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28ReportOutline />} mode='destructive' onClick={() => {
                setReport(2, agent_id);
            }}>
                    Пожаловаться
                </vkui_1.ActionSheetItem>
            </vkui_1.ActionSheet>);
    };
    return (<vkui_1.Panel id={props.id}>
            <vkui_1.PanelHeader left={<vkui_1.PanelHeaderBack onClick={() => window.history.back()}/>}>
                Профиль
            </vkui_1.PanelHeader>

            {!(0, jquery_1.isEmptyObject)(OtherProfileData) && !banned ? <>
                <vkui_1.Group>
                    <vkui_1.Spacing size={10}/>
                    <vkui_1.SimpleCell disabled after={<>
                                <vkui_1.IconButton aria-label='Опции' onClick={() => infoMenu(agent_id)} getRootRef={profRef}>
                                        <icons_1.Icon24MoreVertical />
                                </vkui_1.IconButton>
                            </>} description={online.is_online ? "online" : (0, Utils_1.getHumanyTime)(online.last_seen).date + " в " + (0, Utils_1.getHumanyTime)(online.last_seen).time} before={<vkui_1.Avatar size={70} src={avatar.url}/>}>
                        <div style={{ display: 'flex' }}>
                            {nickname ? nickname : `Агент Поддержки #${agent_id}`}
                            <ProfileTags_1.ProfileTags size='m' verified={verif} flash={flash} donut={donut}/>
                        </div>
                    </vkui_1.SimpleCell>
                    <vkui_1.Spacing size={10}/>
                    {!is_private && <vkui_1.Div>
                        <InfoArrows_1.default special={OtherProfileData.permissions >= config_1.PERMISSIONS.special} good_answers={good_answers} bad_answers={bad_answers} total_answers={total_answers}/>
                    </vkui_1.Div>}
                </vkui_1.Group>

                {is_private ?
                <vkui_1.Group>
                        <vkui_1.Placeholder header='Служебный профиль' icon={<icons_1.Icon56LockOutline />} action={<vkui_1.Button size='m' href='https://vk.com/club201542328' target='_blank' rel='noopener noreferrer'>
                            Задать вопрос в Поддержку
                        </vkui_1.Button>}>
                            Профиль используется Специальным агентом
                        </vkui_1.Placeholder>
                    </vkui_1.Group>
                :
                    <>
                            <vkui_1.Group header={<vkui_1.Header>Общая информация</vkui_1.Header>}>
                                <vkui_1.SimpleCell multiline disabled before={<icons_1.Icon28ArticleOutline />}>
                                    {OtherProfileData.publicStatus || "Играю в любимую игру"}
                                </vkui_1.SimpleCell>
                                <vkui_1.SimpleCell disabled before={<icons_1.Icon28MentionOutline />} after={(0, Utils_1.getHumanyTime)(OtherProfileData.registered).date}>
                                    Дата регистрации
                                </vkui_1.SimpleCell>
                            </vkui_1.Group>
                            {account.permissions >= config_1.PERMISSIONS.special &&
                            <vkui_1.Group>
                                    <vkui_1.SimpleCell disabled before={<icons_1.Icon28HashtagOutline />} after={agent_id}>
                                        Цифровой ID
                                    </vkui_1.SimpleCell>
                                    <vkui_1.SimpleCell disabled before={<icons_1.Icon28WalletOutline />} after={(0, Utils_1.recog_number)(balance)}>
                                        Баланс
                                    </vkui_1.SimpleCell>
                                    <vkui_1.SimpleCell disabled before={<icons_1.Icon28DonateOutline />} after={(0, Utils_1.recog_number)(donuts)}>
                                        Пончики
                                    </vkui_1.SimpleCell>
                                    <vkui_1.SimpleCell disabled before={<icons_1.Icon28Notifications />} after={NOTI[Number(OtherProfileData.noti)]}>
                                        Уведомления
                                    </vkui_1.SimpleCell>
                                    <vkui_1.SimpleCell disabled href={'https://vk.com/id' + vk_id} target="_blank" rel="noopener noreferrer" before={<icons_1.Icon28LogoVkOutline />}>
                                        <vkui_1.Link>
                                            Страница ВКонтакте
                                        </vkui_1.Link>
                                    </vkui_1.SimpleCell>
                                    {account.permissions >= config_1.PERMISSIONS.admin && <>
                                    {OtherProfileData.permissions < config_1.PERMISSIONS.special ?
                                        <vkui_1.SimpleCell disabled before={<icons_1.Icon28StatisticsOutline />} after={OtherProfileData.coff_active}>
                                        Рейтинг Престижности
                                    </vkui_1.SimpleCell> :
                                        <>
                                    <vkui_1.SimpleCell disabled before={<icons_1.Icon28FireOutline />} after={OtherProfileData === null || OtherProfileData === void 0 ? void 0 : OtherProfileData.age}>
                                        Алгоритм Прометея
                                    </vkui_1.SimpleCell>
                                    <vkui_1.SimpleCell disabled before={<icons_1.Icon28FireOutline />} after={OtherProfileData === null || OtherProfileData === void 0 ? void 0 : OtherProfileData.mark_day}>
                                        Оценил за сегодня
                                    </vkui_1.SimpleCell>
                                    </>}
                                    </>}
                                </vkui_1.Group>}
                        </>}
            </> :
            OtherProfileData && banned ?
                <vkui_1.Placeholder stretched icon={<icons_1.Icon56DurationOutline style={{ color: 'var(--dynamic_red)' }}/>}>
                        {!banned.time_end ? "Этот аккаунт был заблокирован навсегда" : "Этот аккаунт был временно заблокирован"}
                        <br />
                        {banned.time_end ? <p>До: {(0, Utils_1.getHumanyTime)(banned.time_end).datetime}<br /></p> : null}
                        {banned.reason ? "Причина: " + banned.reason : null}
                    </vkui_1.Placeholder> : <vkui_1.PanelSpinner />}
            {snackbar}
        </vkui_1.Panel>);
};
