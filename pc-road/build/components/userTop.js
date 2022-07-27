"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const Utils_1 = require("../Utils");
const ProfileTags_1 = require("./ProfileTags");
const Forms = {
    good_answers: ['хороший ответ', 'хороших ответа', 'хороших ответов'],
    marked_answers: ['оценённый ответ', 'оценённых ответа', 'оценённых ответов'],
    bad_answers: ['плохой ответ', 'плохих ответа', 'плохих ответов'],
};
exports.default = props => {
    const { disabled, description, nickname, good_answers, bad_answers, key, id, avatar, flash, donut, verified, onClick, change_color_donut, position, permissions } = props;
    return (<vkui_1.SimpleCell disabled={disabled ? disabled : !onClick} key={key || id} onClick={!disabled ? onClick : undefined} description={description ? description :
            <div className="top_moderator_desc">
            {good_answers + " " + (0, Utils_1.enumerate)(good_answers, Forms.good_answers) + ", "
                    + bad_answers + " " + (0, Utils_1.enumerate)(bad_answers, Forms.bad_answers)}
          </div>} before={<vkui_1.Avatar shadow={false} src={avatar.url} alt='ava' style={{ position: 'relative' }}>
              {position && <vkui_1.Counter style={{ boxShadow: '0 2px 4px rgb(0 0 0 / 12%)',
                    position: 'absolute', right: -1, bottom: 0, backgroundColor: 'var(--white)', color: 'black' }}>{position}</vkui_1.Counter>}
              </vkui_1.Avatar>}>
        <div className="top_moderator_name" style={{ color: (donut && change_color_donut) ? "var(--top_moderator_name_donut)" : "var(--top_moderator_name)" }}>
          <Utils_1.NicknameMenager nickname={nickname} agent_id={id} perms={permissions}/>
          <ProfileTags_1.ProfileTags size='m' verified={verified} flash={flash} donut={donut}/>
        </div>
        </vkui_1.SimpleCell>);
};
