import React from 'react';
import {
    Tappable
} from '@vkontakte/vkui';
import './profileTags.css';
import {
    Icon16Fire,
    Icon16StarCircleFillYellow,
    Icon16Verified,
  
  } from '@vkontakte/icons'
import { useNavigation } from '../../hooks';

export const ProfileTags = ({ verified, flash, donut, size='s' }) => {
    const { setActiveModal } = useNavigation();
    if(size === 's') return (
        <div className="profile-tags">
            <div className="profile-tags_icon">
                {flash &&
                <Tappable onClick={() => setActiveModal('flash_help')}>
                    <Icon16Fire style={{color: 'var(--prom_icon)'}} width={12} height={12} />
                </Tappable>}
            </div>
            <div className="profile-tags_icon">
                {donut &&
                <Tappable onClick={() => setActiveModal('donut_help')}>
                    <Icon16StarCircleFillYellow width={12} height={12} />
                </Tappable>}
            </div>
            <div className="profile-tags_icon">
                {verified && 
                <Tappable onClick={() => setActiveModal('verification_help')}>
                    <Icon16Verified style={{color: 'var(--verification_color)'}} />
                </Tappable>}
            </div>
        </div>
    )
    if(size === 'm') return (
        <div className="profile-tags">
            <div className="profile-tags_icon">
                {flash &&
                <Tappable onClick={() => setActiveModal('flash_help')}>
                    <Icon16Fire style={{color: 'var(--prom_icon)'}} />
                </Tappable>}
            </div>
            <div className="profile-tags_icon">
                {donut &&
                <Tappable onClick={() => setActiveModal('donut_help')}>
                    <Icon16StarCircleFillYellow />
                </Tappable>}
            </div>
            <div className="profile-tags_icon">
                {verified && 
                <Tappable onClick={() => setActiveModal('verification_help')}>
                    <Icon16Verified style={{color: 'var(--verification_color)'}} />
                </Tappable>}
            </div>
        </div>
    )
    return <div></div>
}