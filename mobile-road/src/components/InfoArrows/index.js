import React from 'react';
import './infoarrows.css';

import { 
    Div,
    } from '@vkontakte/vkui';
import { enumerate } from '../../Utils';

import {
    Icon28ArrowUpOutline,
    Icon28ArrowDownOutline,
    Icon28SortOutline,
} from '@vkontakte/icons';

export default ({ good_answers, bad_answers, total_answers }) => {
    return (
        <Div style={{display: 'flex', textAlign:'center', justifyContent: 'space-around'}}>
            <div className='info_arrows_block'>
                <div>
                    <Icon28ArrowUpOutline width={24} height={24} style={{margin:'auto'}} className='blue_arrows_profile' />
                </div>
                <div>
                    {good_answers + " " + enumerate(good_answers, ['положительный', 'положительных', 'положительных'])}<br/>ответов
                </div>
            </div>
            <div className='info_arrows_block'>
                <div>
                    <Icon28ArrowDownOutline width={24} height={24} className='blue_arrows_profile' />
                </div>
                <div>
                    {bad_answers + " " + enumerate(bad_answers, ['отрицательный', 'отрицательных', 'отрицательных'])}<br/>ответов
                </div>
            </div>
            <div className='info_arrows_block'>
                <div>
                    <Icon28SortOutline width={24} height={24} className='blue_arrows_profile' />
                </div>
                <div>
                    {total_answers} всего ответов
                </div>
            </div>
        </Div>
    );
  };