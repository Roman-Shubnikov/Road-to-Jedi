import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

export default class Achiviement extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            changed_id:0,


        }
        var props = this.props.this;
        this.setPopout = props.setPopout;
        this.showErrorAlert = props.showErrorAlert;
        this.setActiveModal = props.setActiveModal;
    }
    render(){
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderButton onClick={() => this.props.this.goBack()}> 
                            <Icon24BrowserBack/>
                        </PanelHeaderButton>
                }>
                </PanelHeader>
                <div className="Achives_Block">
                    <img src="https://vk.com/images/blog/about/img_about_2_2x.png"/>
                </div>
                <div style={{marginTop: "20px"}} className="help_title_profile">В недалеком будущем здесь что-то будет</div>
                <div className="help_title_profile">Ждем вместе с вами!</div>
            </Panel>
        )
    }
}