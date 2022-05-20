import React from 'react';
import './infoarrows.css';

import { 
    Div,
    Card,
    } from '@vkontakte/vkui';
import { enumerate, recog_number } from '../../Utils';
import { InfoCounter } from '../InfoCounter';

export default ({ good_answers, bad_answers, total_answers, special }) => {
    return (
        <Card mode='outline'>
            
            <Div style={{display: 'flex', textAlign:'center', alignItems: 'center', justifyContent: 'space-around'}}>
            {special ?
                <>
                <InfoCounter 
                value={recog_number(good_answers)}
                caption='всего оценок' />
                <InfoCounter 
                value={recog_number(bad_answers)}
                caption={enumerate(bad_answers, ['сгенерированных вопрос', 'сгенерированных вопроса', 'сгенерированных вопросов'])} />
                </>
                :
                <>
                <InfoCounter 
                value={recog_number(good_answers)}
                caption={enumerate(good_answers, ['положительный', 'положительных', 'положительных'])} />
                <InfoCounter 
                value={recog_number(bad_answers)}
                caption={enumerate(bad_answers, ['отрицательный', 'отрицательных', 'отрицательных'])} />
                <InfoCounter 
                value={recog_number(total_answers)}
                caption='всего ответов' />
                </>
            }
            </Div>
        </Card>
        
    );
  };