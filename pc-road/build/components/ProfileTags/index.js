"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileTags = void 0;
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const unstable_1 = require("@vkontakte/vkui/dist/unstable");
require("./profileTags.css");
const icons_1 = require("@vkontakte/icons");
const icons_2 = require("../../icons");
const TooltipContent = ({ children }) => {
    return <vkui_1.Subhead weight="2" style={{ padding: '8px 12px', color: 'var(--text_primary)' }}>
            {children}
        </vkui_1.Subhead>;
};
const ProfileTags = ({ verified, flash, donut, size = 's' }) => {
    if (size === 's')
        return (<div className="profile-tags">
            <div className="profile-tags_icon">
                {flash &&
                <unstable_1.RichTooltip content={<TooltipContent>
                        Ответы Агента вызывают повышенный интерес
                    </TooltipContent>}>
                    <icons_1.Icon16Fire style={{ color: 'var(--prom_icon)' }} width={12} height={12}/>
                </unstable_1.RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {donut &&
                <unstable_1.RichTooltip content={<TooltipContent>
                        Агент поддержал проект
                    </TooltipContent>}><icons_1.Icon16StarCircleFillYellow width={12} height={12}/>
                </unstable_1.RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {verified &&
                <unstable_1.RichTooltip content={<TooltipContent>
                        Профиль Агента подтвержден
                    </TooltipContent>}><icons_2.Verified size={16}/>
                </unstable_1.RichTooltip>}
            </div>
        </div>);
    if (size === 'm')
        return (<div className="profile-tags">
            <div className="profile-tags_icon">
                {flash &&
                <unstable_1.RichTooltip content={<TooltipContent>
                        Ответы Агента вызывают повышенный интерес
                    </TooltipContent>}>
                    <icons_1.Icon16Fire style={{ color: 'var(--prom_icon)' }}/>
                </unstable_1.RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {donut &&
                <unstable_1.RichTooltip content={<TooltipContent>
                        Агент поддержал проект
                    </TooltipContent>}><icons_1.Icon16StarCircleFillYellow />
                </unstable_1.RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {verified &&
                <unstable_1.RichTooltip content={<TooltipContent>
                        Профиль Агента подтвержден
                    </TooltipContent>}><icons_2.Verified size={16} style={{ color: 'var(--verification_color)' }}/>
                </unstable_1.RichTooltip>}
            </div>
        </div>);
};
exports.ProfileTags = ProfileTags;
