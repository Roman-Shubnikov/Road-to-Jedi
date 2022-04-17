import React from 'react'
import { Anchorme } from 'react-anchorme'

import { 
    Icon24CheckCircleOutline,
    Icon24ErrorCircleOutline,
    Icon24CommentOutline,

} from '@vkontakte/icons';
import { MiniInfoCell } from '@vkontakte/vkui';

const Message = props => {
    const clickMark = (e) => {
        e.stopPropagation();
        props.markAlert();
    }
    return (
    props.is_mine ?
        <div className="message message_me">
            <div className="message_body"
                onClick={() => props.onClick()}>
                <div className={props.clickable ? 'pointer animation' : ''}>
                    <div className="message_name">
                        {props.title} 
                        {props.is_special && props.approved ? '✔️' : ''}
                    </div>
                    <div className="message_text">
                        <Anchorme onClick={(e) => { e.stopPropagation() }} target="_blank" rel="noreferrer noopener">{props.children}</Anchorme>
                    </div>
                    
                </div>
                <div className='message_marks'>
                    {props.is_mark === 1 && 
                    <MiniInfoCell 
                    hasActive={false}
                    onClick={clickMark}
                    className='mark-info mark-info_text mark_mark-positive'
                    before={<Icon24CheckCircleOutline />}>
                        Это хороший ответ
                    </MiniInfoCell>
                    }
                    {props.is_mark === 0 && 
                    <MiniInfoCell 
                    hasActive={false}
                    onClick={clickMark}
                    className='mark-info mark-info_text mark_mark-negative'
                    before={<Icon24ErrorCircleOutline />}>
                        Это плохой ответ
                    </MiniInfoCell>
                    }
                    {props.comment && props.is_mark === -1 &&
                    <MiniInfoCell 
                    hasActive={false}
                    onClick={(e) => { e.stopPropagation();props.commentClick()}}
                    className='mark-info mark-info_text mark_comment'
                    before={<Icon24CommentOutline />}>
                        Комментарий
                    </MiniInfoCell>}
                    {props.comment && props.is_mark !== -1 && 
                    <div className="mark-info mark_bubble animation" onClick={(e) => { e.stopPropagation();props.commentClick()}}>
                    <Icon24CommentOutline style={{ color: 'var(--accent)'}}/>
                    </div>}
                </div>
                
                <span className="message_time">{props.time}</span>
            </div>
            <img className="message_avatar" src={props.avatar} onClick={() => props.onClick()} alt='аva' />
        </div>
    :
    <div className="message message_all">
        <img className="message_avatar" src={props.avatar} alt='а' />
        <div className={props.clickable ? 'pointer message_body animation' : 'message_body'} onClick={() => props.onClick()}>
            <p className="message_name">{props.title}</p>
            <div className='message_text'>
                <Anchorme target="_blank" rel="noreferrer noopener">
                    {props.children}
                </Anchorme>
            </div>
            <span className="message_time">{props.time}</span>
        </div>
    </div>
)
}

export default Message;