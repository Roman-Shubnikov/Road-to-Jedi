import React from 'react';

import './top.css';

import {Icon16Verified, 
    Icon16FireVerified, 
    Icon16Fire, 
    Icon24Cancel, 
    Icon24DoneOutline, 
    Icon20MessageOutline} from '@vkontakte/icons';

const top = props => (
    <div style={props.style} className='top_wrapper' onClick={() => props.onClick()}>
            <div className='top_position'>#{props.position}</div>
            <div className='top_image'>
                <img alt='top_photo' src={props.src}/>
            </div>
            <div className='top_title'>{props.title} <div className='flash'>{props.verified && props.flash ? <Icon16FireVerified width={12} height={12}/> : props.verified ? <Icon16Verified style={{color: '#398DF7'}} width={12} height={12}/> : props.flash ? <Icon16Fire width={12} height={12}/> : null}</div></div>
            {props.isMy && <div className='top_you'>Это вы</div>}
            <div className='top_rating'>
                <Icon20MessageOutline className='top_icon' width={13} height={13}/>
                <div className='top_rayt'>{props.all}</div>
                <Icon24DoneOutline width={13} height={13}/>
                <div className='top_rayt'>{props.good}</div>
                <Icon24Cancel width={13} height={13}/>
                <div className='top_rayt'>{props.bad}</div>
            </div>
    </div>
);

export default top;