import React from 'react';
import './infoarrows.css';

import { 
    Div,
    } from '@vkontakte/vkui';
import { enumerate, recog_number } from '../../Utils';
import { InfoCounter } from '../InfoCounter';

export const InfoArrows = ({ good_answers, bad_answers, special }) => {
    const total_answers = good_answers ? good_answers + bad_answers : '';
    return (
            
            <Div style={{display: 'flex', textAlign:'center', alignItems: 'center', justifyContent: 'space-around'}}>
            {special ?
                <>
                <InfoCounter 
                value={recog_number(good_answers)}
                caption='всего оценок' />
                <InfoCounter 
                value={recog_number(bad_answers)}
                caption={enumerate(bad_answers, ['сгенерированный вопрос', 'сгенерированных вопроса', 'сгенерированных вопросов'])} />
                </>
                :
                <>
                <InfoCounter 
                value={recog_number(good_answers)}
                caption={enumerate(good_answers, ['положительный ответ', 'положительных ответа', 'положительных ответов'])} />
                <InfoCounter 
                value={recog_number(bad_answers)}
                caption={enumerate(bad_answers, ['отрицательный ответ', 'отрицательных ответа', 'отрицательных ответов'])} />
                <InfoCounter 
                value={recog_number(total_answers)}
                caption='всего ответов' />
                </>
            }
            </Div>
        
    );
  };