import React from 'react';
import moment from 'moment';

import './message.css';

// import Icon20CommentOutline from '@vkontakte/icons/dist/20/comment_outline';
import Icon16Fire from '@vkontakte/icons/dist/16/fire';
import Icon16FireVerified from '@vkontakte/icons/dist/16/fire_verified';
import Icon16Verified from '@vkontakte/icons/dist/16/verified';
import Icon28DeleteOutlineAndroid from '@vkontakte/icons/dist/28/delete_outline_android';

function getParams( status, avatar ) {
    if( avatar.indexOf('jedi.xelene.me') !== -1 ) {
        let text = 'Ответ не рассмотрен';
        let color = '#A6A6A6';
        if( status == 1 ) {
            text = 'Положительная оценка';
            color = '#3CC226';
        } else if ( status == 0 ) {
            text = 'Отрицательная оценка';
            color = '#FF4F4F';
        } 
    
        return { text, color };
    }
}

export default class Message extends React.Component {
    deleteMessage() {
        let data = this.props.this.sendRequest(`ticket.deleteMessage&message_id=${this.props.message_id}`)
        data.then((data) => {
            this.props.this.openTicket( this.props.this.state.Ticket.info.id );
        })
    }

    render() {
        let props = this.props;
        return (
            <div className='all_message_wrapp'>
                    <div style={{display: 'flex'}}>
                        <div className='message_avatar'>
                            <a target='_blank' href={props.avatar.indexOf('jedi.xelene.me') === -1 ? `https://vk.com/id${props.profile_id}` : `https://vk.com/app7409818#agent_id=${props.profile_id}`}>
                                <img rel='message_photo' src={props.avatar}/>
                            </a>
                        </div>
                        <div className='message_wrapp'>
                            <div className='message_title'>{props.title} <span style={{opacity: '0.4'}}>{`${props.edit_time ? '(ред.)' : ''}`}</span><div className='flash'>{props.verified && props.flash ? <Icon16FireVerified width={12} height={12}/> : props.verified ? <Icon16Verified style={{color: '#398DF7'}} width={12} height={12}/> : props.flash ? <Icon16Fire width={12} height={12}/> : null}</div></div>
                            <div className='message_text'>{props.text}</div>
                            <div className='message_time'>{moment(props.time * 1e3).startOf().fromNow()}</div>
                        </div>
                    </div>
                    {
                    props.avatar.indexOf('jedi.xelene.me') === -1 || props.status !== 'undefined' &&
                    <div className='message_down_box'>
                        {/* <div className='message_comment_icon'><Icon20CommentOutline className='comment_icon'/></div> */}
                        <div className='wrapp_box_down'>
                            {/* <div className='message_comment_icon delete_mark' onClick={() => this.deleteMessage()}>
                                <Icon28DeleteOutlineAndroid width={20} height={20} style={{margin: 'auto'}}/>
                            </div> */}
                            {getParams(props.status, props.avatar) && <div className='message_mark' style={{color: getParams(props.status, props.avatar).color}}>{getParams(props.status, props.avatar).text}</div>}
                        </div>
                    </div>
                    }
                </div>
        )
    }
};