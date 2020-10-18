import React from 'react'

import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';
import Icon12OnlineVkmobile from '@vkontakte/icons/dist/12/online_vkmobile';


const Message = props => (
    props.is_mine === true ?
        <div className="mine_message">
            <div id="animation" className="message_report_moderator" style={props.approved ? {marginBottom: "20px"} : null}  onClick={() => props.onClick()}>
            <p className="moderator_name_message">{props.title} {props.approved ? '✔️' : ''}</p>
                <p className="text_message">{props.children}</p>
                <p className="time_message">{props.time}</p>
            </div>
            {props.is_mark === 1 ? 
                <div className="approved" onClick={() => props.DoneApp()}>
                    <Icon16Done className="approved_icon green" height={15} width={15} style={{display: "inline-block"}}/>
                </div>
                : props.is_mark === 0 ?
                <div className="approved" onClick={() => props.CanselApp()}>
                    <Icon16Cancel className="approved_icon" height={15} width={15} style={{display: "inline-block"}}/>
                </div>
            : null}
        </div>
    :
    <div className="all_message" style={props.is_mark === false ? {marginBottom: "-3px"} : null}>
        <img className="avatar_message" src={props.avatar}/>
        <div id="animation" className="message_report" onClick={() => props.onClick()}>
            <p className="moderator_name_message">{props.title}</p>
            <p>{props.children}</p>
            <p className="time_message">{props.time}</p>
        </div>
    </div>
);

export default Message;