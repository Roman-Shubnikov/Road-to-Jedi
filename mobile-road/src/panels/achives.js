import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

const Achivs = props => (
    <Panel id={props.id}>
        <PanelHeader 
            left={
                <PanelHeaderButton onClick={() => window.history.back()}> 
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
            
);

export default Achivs;