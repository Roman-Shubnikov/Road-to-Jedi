import React from 'react';

import './ticket.css';

import Message from '../components/message'

import Icon16Up from '@vkontakte/icons/dist/16/up';

export default class Ticket extends React.Component {

    sendMessage() {
        let ticket_id = this.props.this.state.Ticket.info.id;
        let text = document.getElementById('message_text').value;
        let data = this.props.this.sendRequest('ticket.sendMessage', `ticket_id=${ticket_id}&text=${decodeURIComponent(text)}`)
        data.then(() => {
            this.props.this.openTicket( ticket_id );
            document.getElementById('message_text').value = '';
        })
    }

    render() {
        let props = this.props;
        let author = props.this.state.Ticket.info.author;
        return (
            props.this.state.Ticket.messages.length > 0 ?
            <div className='wrapper_ticket'>
                <div className='wrapp_ticket'>
                    <div className='title_ticket'>{props.this.state.Ticket.info.title}</div>
                    <div className='description_ticket'>{props.this.state.Ticket.messages[0] ? props.this.state.Ticket.messages[0].text : ''}</div>
                    <a style={{textDecoration: 'none'}} target='_blank' href={`https://vk.com/id${author ? author.id : ''}`}>
                        <div className='user_ticket'>
                            <img alt='profile_photo' src={author ? author.photo_200 : ''}/>
                            <div className='titles_user_ticket'>
                                <div className='title_user_ticket'>{`${author ? author.first_name : ''} ${author ? author.last_name : ''}`}</div>
                                <div className='description_user_ticket'>{`${author ? author.is_closed ? 'Закрытый профиль' : 'Открытый профиль' : ''}`}</div>
                            </div>
                        </div>
                    </a>

                <div className='title_ticket response_ticket'>Ответы <span>{props.this.state.Ticket.messages.length - 1}</span></div>
                    {props.this.state.Ticket.messages.map(function(result, i) {
                        let avatar = result.author.is_moderator ? "https://jedi.xelene.me/v1" + result['author']['avatar']['url'] : result.author.photo_200
                        let profile_id = result.author.is_moderator ? "" + result['author']['id'] : result.author.id
                        let title = result.author.avatar ? isFinite(result['nickname']) ? `Агент Поддержки #${result['nickname']}` : result['nickname'] ? result['nickname'] : `Агент Поддержки #${result['author']['id']}` : `${result['author']['first_name']} ${result['author']['last_name']}`;
                        return (
                            i > 0 && <Message message_id={result['id']} this={props.this} profile_id={profile_id} id={result['id']} avatar={avatar} key={result['id']} title={title} text={result['text']} time={result['time']} edit_time={result['edit_time']} status={result['mark']}/>
                        )
                    })}
                    {props.this.state.Ticket.messages.length === 1 && <div className='error'>Никто еще не оставлял ответов</div>}
                    <div className='down_input'>
                        <textarea id='message_text' placeholder='Ответить...'/>
                        <div className='button_down_input' onClick={() => this.sendMessage()}>
                            <Icon16Up style={{margin: 'auto'}}/>
                        </div>
                    </div>
                </div>
            </div>
                :
                <div className='error error_wrapp'>Такого тикета не существует</div>
    )
    }
};