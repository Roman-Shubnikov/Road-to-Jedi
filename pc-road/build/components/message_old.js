"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_anchorme_1 = require("react-anchorme");
const icons_1 = require("@vkontakte/icons");
const vkui_1 = require("@vkontakte/vkui");
const Message_old = props => {
    const clickMark = (e) => {
        e.stopPropagation();
        props.markAlert();
    };
    return (props.is_mine ?
        <div className="message message_me">
            <div className="message_body" onClick={() => props.onClick()}>
                <div className={props.clickable ? 'pointer animation' : ''}>
                    <div className="message_name">
                        {props.title} 
                        {props.is_special && props.approved ? '✔️' : ''}
                    </div>
                    <div className="message_text">
                        <react_anchorme_1.Anchorme onClick={(e) => { e.stopPropagation(); }} target="_blank" rel="noreferrer noopener">{props.children}</react_anchorme_1.Anchorme>
                    </div>
                    
                </div>
                <div className='message_marks'>
                    {props.is_mark === 1 &&
                <vkui_1.MiniInfoCell hasActive={false} onClick={clickMark} className='mark-info mark-info_text mark_mark-positive' before={<icons_1.Icon24CheckCircleOutline />}>
                        Это хороший ответ
                    </vkui_1.MiniInfoCell>}
                    {props.is_mark === 0 &&
                <vkui_1.MiniInfoCell hasActive={false} onClick={clickMark} className='mark-info mark-info_text mark_mark-negative' before={<icons_1.Icon24ErrorCircleOutline />}>
                        Это плохой ответ
                    </vkui_1.MiniInfoCell>}
                    {props.comment && props.is_mark === -1 &&
                <vkui_1.MiniInfoCell hasActive={false} onClick={(e) => { e.stopPropagation(); props.commentClick(); }} className='mark-info mark-info_text mark_comment' before={<icons_1.Icon24CommentOutline />}>
                        Комментарий
                    </vkui_1.MiniInfoCell>}
                    {props.comment && props.is_mark !== -1 &&
                <div className="mark-info mark_bubble animation" onClick={(e) => { e.stopPropagation(); props.commentClick(); }}>
                    <icons_1.Icon24CommentOutline style={{ color: 'var(--accent)' }}/>
                    </div>}
                </div>
                
                <span className="message_time">{props.time}</span>
            </div>
            <img className="message_avatar" src={props.avatar} onClick={() => props.onClick()} alt='аva'/>
        </div>
        :
            <div className="message message_all">
        <img className="message_avatar" src={props.avatar} alt='а'/>
        <div className={props.clickable ? 'pointer message_body animation' : 'message_body'} onClick={() => props.onClick()}>
            <p className="message_name">{props.title}</p>
            <div className='message_text' style={{ marginBottom: 10 }}>
                <react_anchorme_1.Anchorme target="_blank" rel="noreferrer noopener">
                    {props.children}
                </react_anchorme_1.Anchorme>
            </div>
            <span className="message_time">{props.time}</span>
        </div>
    </div>);
};
exports.default = Message;
