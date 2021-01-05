import React from 'react'; 

import {
    Cell,
    
} from '@vkontakte/vkui';


export default class EpicItemPC extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

    render(){
        return (
            <Cell
                disabled={this.props.activeStory === this.props.story}
                style={this.props.activeStory === this.props.story ? {
                    backgroundColor: "var(--button_secondary_background)",
                    borderRadius: 8
                } : {}}
                data-story={this.props.story}
                onClick={(e) => {this.props.changeStory('activeStory', e.currentTarget.dataset.story)}}
                before={this.props.icon}>
                    {this.props.children}
                </Cell>
        )
    }

}