import React from 'react';

import './question.css'

// Style применяется к родительскому компоненту

const declensions = ['ответ', 'ответа', 'ответов'];

const Question = props => (
    <div style={props.style} onClick={() => props.onClick()} className='wrapper_question'>
        <div className='wrapper_titles'>
            <div className='question_title'>{props.title === '' || typeof props.title == 'undefined' ? 'Без заголовка' : props.title}</div>
            <div className='question_description'> 
                <span><a target="_blank" href={`https://vk.com/id${props.profile_id}`}>{props.name}</a>{`  ·  ${props.time}`}</span>
            </div>
        </div>
        <div className='question_count'>
            {props.answers} {window.declensions( props.answers, declensions)}
        </div>
    </div>
);

export default Question;