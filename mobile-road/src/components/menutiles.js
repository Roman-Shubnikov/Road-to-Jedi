import React from 'react'; 

import {
    Tappable,
    Subhead,
    
} from '@vkontakte/vkui';


export default class Tiles extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }

    }

    render(){
        const {onClick, icon} = this.props;
        return (
            <div style={{width: 80}} className="Tiles">
                <Tappable onClick={onClick}>
                    <div className="Tiles__icon">{icon}</div>
                    <div className="Tiles__content">
                        <Subhead className="HorizontalCell__title" weight="regular">
                            {this.props.children}
                        </Subhead>
                    </div>

                </Tappable>
            </div>
        )
    }

}