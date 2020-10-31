import React from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    Avatar,
    Button,
    Separator,
    Counter,
    SimpleCell,
    Div,
    } from '@vkontakte/vkui';

import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon16Verified from '@vkontakte/icons/dist/16/verified';
import Icon28GhostOutline from '@vkontakte/icons/dist/28/ghost_outline';
import Icon28PollSquareOutline from '@vkontakte/icons/dist/28/poll_square_outline';
import Icon28MarketOutline from '@vkontakte/icons/dist/28/market_outline';
import Icon28PaletteOutline from '@vkontakte/icons/dist/28/palette_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';
import Icon28QrCodeOutline from '@vkontakte/icons/dist/28/qr_code_outline';


export default class Profile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",

        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.setActiveModal = propsbi.setActiveModal;

    }
    render(){
        var props = this.props.this;
        return(
            <Panel id={this.props.id}>
                <PanelHeader
                left={<><PanelHeaderButton onClick={() => {
                    this.setActiveModal("share");
                }}>
                        <Icon28QrCodeOutline />
                    </PanelHeaderButton>
                    <PanelHeaderButton label={this.props.account.notif_count ? <Counter size="s" mode="prominent">{this.props.account.notif_count}</Counter> : null}
                    onClick={() => {
                        this.props.this.changeData("activeStory", 'notif');
                    }}>
                        <Icon28Notifications/>
                    </PanelHeaderButton></>}>Профиль</PanelHeader>
                    <SimpleCell
                    disabled
                    before={<Avatar src={this.props.account['avatar']['url']} size={72} />}
                    size="l"
                    description={isFinite(this.props.account['nickname']) ? `#${this.props.account['nickname']}` : this.props.account['nickname'] ? '' : `#${this.props.account['id']}`}
                    >
                        <div style={{display:"flex"}}>
                            <p style={{margin:0}}>
                                {isFinite(this.props.account['nickname']) ? `Агент Поддержки` : this.props.account['nickname'] ? this.props.account['nickname'] : `Агент Поддержки`}
                            </p> 
                            {
                                this.props.account['flash'] === true ? 
                                    <div className="profile_icon">
                                        <Icon12Fire width={12} height={12} onClick={() => props.setActiveModal('prom')}/>  
                                    </div>
                                    : null}
                                {this.props.account['verified'] === true ? 
                                    <div className="profile_icon_ver">
                                        <Icon16Verified />  
                                    </div>
                                    : null}
                        </div>
                        
                    </SimpleCell>
                    <Separator />
                    <Div>
                        <Button
                        stretched
                        size='l'
                        mode='secondary'
                        onClick={() => this.props.this.goPanel('settings')}
                        >Настройки</Button>
                    </Div>
                    
                    <Separator />
                    <Group>
                        <SimpleCell
                            expandable
                            href="https://vk.me/join/AJQ1dxm7YRd7rN/MQHaAtZx7"
                            target="_blank" rel="noopener noreferrer"
                            before={<Icon28GhostOutline />}>
                                Фантом-чат
                        </SimpleCell>

                    </Group>
                    <Group>
                        <SimpleCell
                        expandable
                        onClick={() => {
                            this.props.this.goPanel('qu');
                        }}
                        before={<Icon28PollSquareOutline />}>Мои ответы</SimpleCell>
                        <SimpleCell
                        expandable
                        onClick={() => {
                            this.props.this.goPanel('market');
                        }}
                        before={<Icon28MarketOutline />}>Магазин</SimpleCell>
                        {/* props.this.state.profile['balance'] Вынести отдельно в магазин */}

                        <SimpleCell
                        expandable
                        onClick={() => {
                            this.props.this.goPanel('achievements');
                        }}
                        before={<Icon28PaletteOutline />}>Достижения</SimpleCell>
                        {/* <SimpleCell
                        expandable
                        onClick={() => {
                            props.this.Dop();
                        }}
                        before={<Icon28ArticleOutline />}>Мои вопросы</SimpleCell> */}
                        {/* <SimpleCell
                        expandable
                        onClick={() => {
                            this.setActiveModal("share");
                        }}
                        before={<Icon24ShareOutline />}>Поделиться профилем</SimpleCell> */}
                        
                    </Group>
                    {/* <Group>
                        <SimpleCell
                        onClick={() => {
                            props.this.allowMessage();
                        }}
                        indicator={<Switch onChange={() => props.this.allowMessage()} defaultChecked={props.this.state.switchKeys}/>}
                        before={<Icon28Notifications />}>Уведомления в сообщения</SimpleCell>
                    </Group> */}
                {this.props.this.state.snackbar}
            </Panel>
        )
    }
        
}
    