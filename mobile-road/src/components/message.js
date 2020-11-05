import React from 'react'

import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon16Cancel from '@vkontakte/icons/dist/16/cancel';
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));



const Message = props => (
    props.is_mine === true ?
        <div className="mine_message">
            <div id="animation" className="message_report_moderator" style={{marginBottom: props.approved ? "20px" : null, right: platformname ? "-12%" : "-22%"}}>
                <div onClick={() => props.onClick()}>
                    <p className="moderator_name_message">
                        {props.title} 
                        {/* {props.approved ? '✔️' : ''} */}
                    </p>
                    <p className="text_message">{props.children}</p>
                    
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
                <img className="avatar_message_moderator" src={props.avatar} 
                alt={'а'}
                style={{marginLeft: platformname ? "99%" : "99%"}} 
                />
                <p className="time_message">{props.time}</p>
            </div>
            
        </div>
    :
    <div className="all_message" style={props.is_mark === false ? {marginBottom: "-3px"} : null}>
        <img className="avatar_message" src={props.avatar} alt={'а'} />
        <div id="animation" className="message_report" onClick={() => props.onClick()}>
            <p className="moderator_name_message">{props.title}</p>
            <p>{props.children}</p>
            <p className="time_message">{props.time}</p>
        </div>
    </div>
);

export default Message;