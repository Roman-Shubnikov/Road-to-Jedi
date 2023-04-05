import React from 'react';
import {
    Subhead,
    unstable_RichTooltip as RichTooltip
} from '@vkontakte/vkui';
import './profileTags.css';
import {
    Icon16Fire,
    Icon16StarCircleFillYellow,
    Icon16Verified,
  
  } from '@vkontakte/icons'

const TooltipContent = ({children}) => {
    return <Subhead weight="2" style={{padding: '8px 12px', color: 'var(--text_primary)', 
    background: 'var(--vkui--color_background_content)', borderRadius: 8}}>
            {children}
        </Subhead>
}

export const ProfileTags = ({ verified, flash, donut, size='s' }) => {
    if(size === 's') return (
        <div className="profile-tags">
            <div className="profile-tags_icon">
                {flash &&
                <RichTooltip content={
                    <TooltipContent>
                        Ответы Агента вызывают повышенный интерес
                    </TooltipContent>
                }>
                    <Icon16Fire style={{color: 'var(--prom_icon)'}} width={12} height={12} />
                </RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {donut &&
                <RichTooltip content={
                    <TooltipContent>
                        Агент поддержал проект
                    </TooltipContent>
                }><Icon16StarCircleFillYellow width={12} height={12} />
                </RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {verified && 
                <RichTooltip content={
                    <TooltipContent>
                        Профиль Агента подтвержден
                    </TooltipContent>
                }><Icon16Verified style={{color: 'var(--verification_color)'}} />
                </RichTooltip>}
            </div>
        </div>
    )
    if(size === 'm') return (
        <div className="profile-tags">
            <div className="profile-tags_icon">
                {flash &&
                <RichTooltip content={
                    <TooltipContent>
                        Ответы Агента вызывают повышенный интерес
                    </TooltipContent>
                }>
                    <Icon16Fire style={{color: 'var(--prom_icon)'}} />
                </RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {donut &&
                <RichTooltip content={
                    <TooltipContent>
                        Агент поддержал проект
                    </TooltipContent>
                }><Icon16StarCircleFillYellow />
                </RichTooltip>}
            </div>
            <div className="profile-tags_icon">
                {verified && 
                <RichTooltip content={
                    <TooltipContent>
                        Профиль Агента подтвержден
                    </TooltipContent>
                }><Icon16Verified style={{color: 'var(--verification_color)'}} />
                </RichTooltip>}
            </div>
        </div>
    )
    return <div></div>
}