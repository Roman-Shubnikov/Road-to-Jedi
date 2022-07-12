import React from 'react';
import './greencard.css';

import { 
    FormStatus,
} from '@vkontakte/vkui';

export const GreenCard = ({ header, children }) => {
    return (
        <FormStatus header={header} className='green-card'>
            {children}
        </FormStatus>
    );
  };