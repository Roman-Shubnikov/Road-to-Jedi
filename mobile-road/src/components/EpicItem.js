import React from 'react'; 

import {
    Cell,
    
} from '@vkontakte/vkui';

export const EpicItem = props => {
    return(
    <Cell
        badge={props.badge}
        disabled={props.activeStory === props.story}
        style={props.activeStory === props.story ? {
            backgroundColor: "var(--vkui--color_transparent--active)",
            borderRadius: 8
        } : {}}
        data-story={props.story}
        onClick={props.onClick}
        before={props.icon}>
            {props.children}
    </Cell>
    )
    
}
