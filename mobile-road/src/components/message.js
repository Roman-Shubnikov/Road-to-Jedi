import React from 'react'
import { Anchorme } from 'react-anchorme'

import Icon16Done           from '@vkontakte/icons/dist/16/done';
import Icon16Cancel         from '@vkontakte/icons/dist/16/cancel';
import Icon20CommentOutline from '@vkontakte/icons/dist/20/comment_outline';
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


const Message = React.forwardRef(( props, ref ) => (
    props.is_mine === true ?
        <div className="mine_message" ref={ref}>
            <div  className="message_report_moderator" style={{marginBottom: props.approved ? "20px" : null, right: platformname ? "-12%" : "-22%"}}>
                <div className={props.clickable ? 'pointer animation' : ''} onClick={() => props.onClick()}>
                    <p className="moderator_name_message">
                        {props.title} 
                        {/* {props.approved ? '✔️' : ''} */}
                    </p>
                    <p className="text_message"><Anchorme target="_blank" rel="noreferrer noopener">{props.children}</Anchorme></p>
                    
                </div>
                <div style={{display:'flex'}}>
                    {props.is_mark === 1 ? 
                    <div className="approved animation pointer" onClick={() => props.DoneApp()}>
                        <Icon16Done className="approved_icon green" height={15} width={15} style={{display: "inline-block"}}/>
                    </div>
                    : props.is_mark === 0 ?
                    <div className="approved animation pointer" onClick={() => props.CanselApp()}>
                        <Icon16Cancel className="approved_icon" height={15} width={15} style={{display: "inline-block"}}/>
                    </div>
                    : null}
                    {props.comment ? 
                    <div className="approved animation pointer" onClick={() => props.commentclick()}>
                        <Icon20CommentOutline className="approved_icon" height={16} width={16} style={{display: "inline-block", color: 'var(--accent)'}}/>
                    </div>
                    : null}
                </div>
                <img className="avatar_message_moderator" src={props.avatar} 
                alt={'аva'}
                style={{marginLeft: platformname ? "99%" : "99%"}} 
                />
                <p className="time_message">{props.time}</p>
            </div>
            
        </div>
    :
    <div className="all_message" style={props.is_mark === false ? {marginBottom: "-3px"} : null} ref={ref}>
        <img className="avatar_message" src={props.avatar} alt={'а'} />
        <div className={props.clickable ? 'pointer message_report animation' : 'message_report'} onClick={() => props.onClick()}>
            <p className="moderator_name_message">{props.title}</p>
            <p><Anchorme target="_blank" rel="noreferrer noopener">{props.children}</Anchorme></p>
            <p className="time_message">{props.time}</p>
        </div>
    </div>
));

export default Message;