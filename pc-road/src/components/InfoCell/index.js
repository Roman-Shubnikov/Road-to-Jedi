import React from 'react';
import {
    Subhead
} from '@vkontakte/vkui';
import './infoCell.css';

export const InfoCell = ({children, name}) => {
    return (
        <div className='InfoCell'>
            <div className='InfoCell_name'>
                {name}  
            </div>
            <div className='InfoCell_children'>
                {children}
            </div>
        </div>
    )
}