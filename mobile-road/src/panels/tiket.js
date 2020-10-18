import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';

import Icon24Up from '@vkontakte/icons/dist/24/up';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon16ReplyOutline from '@vkontakte/icons/dist/16/reply_outline';

import Message from '../components/message'

import { Button } from '@vkontakte/vkui';
const queryString = require('query-string');
const parsedHash = queryString.parse(window.location.search.replace('?', ''));

var months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'ноября',
    'декабря',
];

function fix_time(time) {
    if(time < 10) {
        return "0" + time
    } else {
        return time
    }
}

function add_month(month) {
    let number_month = new Date(month * 1e3).getMonth()
    return months[number_month]
}

const Ticket = props => (
        <Panel id={props.id}>
            <PanelHeader 
                left={<PanelHeaderButton onClick={() => window.history.back()}><Icon24BrowserBack/></PanelHeaderButton>}
            >
                <span id="animation" onClick={() => props.this.copy(props.this.state.tiket_info['id'])}>Вопрос #{props.this.state.tiket_info['id']}</span>
            </PanelHeader>
            {/* MESSAGES */}
            <div className="title_tiket">{new Date(props.this.state.tiket_info['time'] * 1e3).getDate()} {add_month(props.this.state.tiket_info['time'])}</div>
            <div className="title_tiket" style={{marginTop: "10px", width: "95%", marginLeft: "10px"}}>Пользователь обратился с вопросом  «{props.this.state.tiket_info['title']}»</div>
                    {props.this.state.tiket_message.map(function(result, i) {
                        var is_mine_ticket = Number(props.this.state.tiket_info.author['id']) === Number(parsedHash.vk_user_id) ? true : false
                        var is_mine_message = Number(result['author']['id']) === Number(parsedHash.vk_user_id) ? true : false
                        var avatar = result.author.is_moderator ? "https://api.xelene.me/" + result['author']['avatar']['url'] : result.author.photo_200
                        var time = fix_time(new Date(result.time * 1e3).getHours()) + ":" + fix_time(new Date(result.time * 1e3).getMinutes())
                        var title_moder = isFinite(result['nickname']) ? `Агент Поддержки #${result['nickname']}` : result['nickname'] ? result['nickname'] : `Агент Поддержки #${result['author']['id']}`;
                        return (
                            Number(props.this.state.tiket_info.author['id']) === Number(parsedHash.vk_user_id) ?
                            <Message 
                                title={result.author.id === 526444378 ? "Витёк" : result.author.is_moderator ? title_moder : result.author.first_name + " " + result.author.last_name} 
                                title_icon={result.moderator_comment != undefined ? <Icon16ReplyOutline width={10} height={10} style={{display: "inline-block"}}/> : false}
                                is_mine={is_mine_message === is_mine_ticket}
                                avatar={avatar}
                                onClick={() => props.this.Admin(result['id'], result['author']['id'], result['text'], result.moderator_comment != undefined ? result['moderator_comment']['text'] : null, result['mark'])}
                                key={i}
                                is_special={props.this.state.is_special_moder}
                                is_mark={result.mark}
                                time={time}
                                sendRayt_false={() => props.this.sendRayt(false, result.id)}
                                sendRayt_true={() => props.this.sendRayt(true, result.id)}
                                approved={result.approved ? true : false}
                                CanselApp={() => props.this.showAlert('Информация', 'Этот ответ оценен отрицательно')}
                                DoneApp={() => props.this.showAlert('Информация', 'Этот ответ оценен положительно')}
                            >
                                {result.text}
                            </Message>
                            
                            :
                            <Message 
                                title={result.author.id === 526444378 ? "Витёк" : result.author.is_moderator ? title_moder : result.author.first_name + " " + result.author.last_name} 
                                title_icon={result.moderator_comment != undefined ? <Icon16ReplyOutline width={10} height={10} style={{display: "inline-block"}}/> : false}
                                is_mine={result.author.is_moderator}
                                avatar={result.author.id === 526444378 ? "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png" : avatar}
                                key={i}
                                time={time}
                                onClick={() => props.this.Admin(result['id'], result['author']['id'], result['text'], result.moderator_comment != undefined ? result['moderator_comment']['text'] : null, result['mark'])}
                                is_special={props.this.state.is_special_moder}
                                is_mark={result.mark}
                                sendRayt_false={() => props.this.sendRayt(false, result.id)}
                                sendRayt_true={() => props.this.sendRayt(true, result.id)}
                                approved={result.approved ? true : false}
                                CanselApp={() => props.this.showAlert('Информация', 'Этот ответ оценен отрицательно')}
                                DoneApp={() => props.this.showAlert('Информация', 'Этот ответ оценен положительно')}
                            >
                                {result.text}
                            </Message>
                        )})}
            {/* INPUT */}
            {props.this.state.tiket_info['status'] === 0 || (props.this.state.redaction === true || props.this.state.add_comment === true) ? 
                <div id="other" className="other">
                    <div className="down_input_message">
                        <textarea maxLength="2020" name="tiket_send_message" value={props.this.state.tiket_send_message} onChange={(e) => props.this.onChange(e)} placeholder={props.this.state.add_comment ? "Комментарий..." : "Ответ..."} className="textarea"></textarea>
                    </div>
                    <div className="send_text" onClick={() => props.this.state.redaction !== true && props.this.state.add_comment !== true ? props.this.sendNewMessage() : props.this.state.redaction ? props.this.sendNewMessageRedact() : props.this.sendNewMessageComment()}>
                        <Icon24Up/>
                    </div>
                </div> : null}
            {props.this.state.tiket_info['status'] === 1 ? 
                Number(props.this.state.tiket_info['author']['id']) === Number(parsedHash.vk_user_id) ?
                    <div className="others">
                        <Button size="l" style={{ marginRight: 8, width: "95%" }} onClick={() => props.this.deleteTicket()}>Проблема решена</Button><br/>
                        <div style={{height: "5px"}}></div>
                        <Button size="l" style={{ marginRight: 8, width: "95%" }} level="secondary" onClick={() => props.this.openTicket()}>Проблема не решена</Button>
                    </div>
                : null
            : null}
                <br/>
                <br/>
                <br/>
            </Panel>
);

export default Ticket;