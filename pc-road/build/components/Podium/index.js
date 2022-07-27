"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Podium = void 0;
const vkui_1 = require("@vkontakte/vkui");
const react_1 = __importDefault(require("react"));
const react_loading_skeleton_1 = __importDefault(require("react-loading-skeleton"));
const config_1 = require("../../config");
require("./podium.css");
const PodiumDescription = ({ num, nickname, perms, donut, change_color_donut }) => {
    const agent = <span>Агент<br />Поддержки</span>;
    const special = <span>Специальный<br />Агент</span>;
    return <>
        <vkui_1.Spacing />
        <vkui_1.Text style={{ height: 40, width: 94, color: (donut && change_color_donut) ? "var(--top_moderator_name_donut)" : "var(--top_moderator_name)" }}>
            {nickname ? nickname : perms >= config_1.PERMISSIONS.special ? special : agent}
        </vkui_1.Text>
        <vkui_1.Spacing size={4}/>
        <vkui_1.Text style={{ color: 'var(--description_color)' }}>
            #{num}
        </vkui_1.Text>
        </>;
};
const Podium = ({ users = [1, 2, 3], goOtherProfile, skeleton = false }) => {
    const [u1, u2, u3] = users;
    if (skeleton)
        return (<div className="podium">
            {Array(3).fill().map((num, i) => (<div className="podium_column" key={i}>
                    <div style={{ marginBottom: 10 }}>
                        <react_loading_skeleton_1.default circle={true} width={67} height={67}/>
                    </div>
                    <react_loading_skeleton_1.default height={40} width={94} style={{ marginBottom: 10 }}/>
                    <react_loading_skeleton_1.default height={20} width={94}/>
                </div>))}
            
        </div>);
    return (<vkui_1.Div>
            <div className="podium">
                {u2 && <vkui_1.Tappable className="podium_column" onClick={() => { goOtherProfile(u2.id, true); }}>
                    <div className="podium_column_avatar-border" style={{ border: '3px solid var(--silver)' }}>
                        <vkui_1.Avatar shadow={false} size={67} src={u2.avatar.url}/>
                        <vkui_1.Counter size='m' className='podium_column_avatar_badge silver'>2</vkui_1.Counter>
                    </div>
                    <PodiumDescription donut={u2.donut} change_color_donut={u2.change_color_donut} num={u2.id} perms={u2.permissions} nickname={u2.nickname}/>
                </vkui_1.Tappable>}
                {u1 && <vkui_1.Tappable className="podium_column" onClick={() => { goOtherProfile(u1.id, true); }}>
                    <div className="podium_column_avatar-border" style={{ border: '3px solid var(--gold)' }}>
                        <vkui_1.Avatar shadow={false} size={92} src={u1.avatar.url}/>
                        <vkui_1.Counter size='m' className='podium_column_avatar_badge gold'>1</vkui_1.Counter>
                    </div>


                    <PodiumDescription donut={u1.donut} change_color_donut={u1.change_color_donut} perms={u1.permissions} num={u1.id} nickname={u1.nickname}/>
                </vkui_1.Tappable>}
                {u3 && <vkui_1.Tappable className="podium_column" onClick={() => { goOtherProfile(u3.id, true); }}>
                    <div className="podium_column_avatar-border" style={{ border: '3px solid var(--bronze)' }}>
                        <vkui_1.Avatar shadow={false} size={67} src={u3.avatar.url}/>
                        <vkui_1.Counter size='m' className='podium_column_avatar_badge bronze'>3</vkui_1.Counter>
                    </div>
                    <PodiumDescription donut={u3.donut} change_color_donut={u3.change_color_donut} perms={u3.permissions} num={u3.id} nickname={u3.nickname}/>
                </vkui_1.Tappable>}

            </div>
            {users.length > 3 && <vkui_1.Spacing separator/>}
        </vkui_1.Div>);
};
exports.Podium = Podium;
