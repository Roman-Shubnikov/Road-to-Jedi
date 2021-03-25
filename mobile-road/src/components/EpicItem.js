import React from 'react'; 

import {
    Cell,
    
} from '@vkontakte/vkui';

export default props => {
    return(
    <Cell
        badge={props.badge}
        disabled={props.activeStory === props.story}
        style={props.activeStory === props.story ? {
            backgroundColor: "var(--button_secondary_background)",
            borderRadius: 8
        } : {}}
        data-story={props.story}
        onClick={(e) => props.changeActiveStory(e.currentTarget.dataset.story)}
        before={props.icon}>
            {props.children}
    </Cell>
    )
    
}
