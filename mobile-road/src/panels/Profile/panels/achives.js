import React from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderBack
    } from '@vkontakte/vkui';

export default class Achiviement extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            changed_id:0,


        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.setActiveModal = propsbi.setActiveModal;
    }
    render(){
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                </PanelHeader>
                <div className="Achives_Block">
                    <img src="https://vk.com/images/blog/about/img_about_2_2x.png" alt={'Дракон'} />
                </div>
                <div style={{marginTop: "20px"}} className="help_title_profile">В недалеком будущем здесь что-то будет</div>
                <div className="help_title_profile">Ждем вместе с вами!</div>
            </Panel>
        )
    }
}