import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import Switch from '@vkontakte/vkui/dist/components/Switch/Switch';

import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon24DoNotDisturb from '@vkontakte/icons/dist/24/do_not_disturb';
import Icon16Chevron from '@vkontakte/icons/dist/16/chevron';
import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon16Done from '@vkontakte/icons/dist/16/done';
import Icon24ShareOutline from '@vkontakte/icons/dist/24/share_outline';
import Icon28GhostOutline from '@vkontakte/icons/dist/28/ghost_outline';
import Icon28PollSquareOutline from '@vkontakte/icons/dist/28/poll_square_outline';
import Icon28MarketOutline from '@vkontakte/icons/dist/28/market_outline';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28Notifications from '@vkontakte/icons/dist/28/notifications';

import { Separator, PanelHeader } from '@vkontakte/vkui';

const Profile = props => (
    <Panel id={props.id}>
        <PanelHeader>Профиль</PanelHeader>
        <br/>
        <br/>
        <div>
            <div className="profile">
                <div className="image_profile">
                    <img className="image_profile" src={props.this.state.profile['avatar']['url']}/>
                </div>
                <div className="profiles">
                    <div className="name_profile">  
                  {isFinite(props.this.state.profile['nickname']) ? `Агент Поддержки` : props.this.state.profile['nickname'] ? props.this.state.profile['nickname'] : `Агент Поддержки`}
                        {
                        props.this.state.profile['flash'] === true ? 
                            <div className="profile_icon">
                                <Icon12Fire onClick={() => props.setActiveModal('prom')}/>  
                            </div>
                            : 
                            props.this.state.profile['verified'] === true ? 
                            <div className="profile_icon_ver">
                                <Icon16Done width={12} height={12}/>  
                            </div>
                            : null
                        }
                    </div>
                    <div className="description_profile">
                  {isFinite(props.this.state.profile['nickname']) ? `#${props.this.state.profile['nickname']}` : props.this.state.profile['nickname'] ? '' : `#${props.this.state.profile['id']}`}
                    </div>
                </div>
            </div>
            <div className="modal_profile">
                <a className="fantom" target="_blank" component="a" href="https://vk.me/join/AJQ1dxm7YRd7rN/MQHaAtZx7">
                    <div className="button_profile">
                        <Icon28GhostOutline width={28} height={28} className="icon_profile" style={{display: "inline-block"}}/> 
                        <div className="in_button">Фантом-чат</div>
                    </div>
                </a>
                <div className="button_profile">
                    <Icon28CheckCircleOutline width={28} height={28} className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Положительные ответы</div>
                    <div className="right_button">{props.this.state.profile['good_answers']}</div>
                </div>
                <div className="button_profile">
                    <Icon24DoNotDisturb width={28} height={28} className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Отрицательные ответы</div>
                    <div className="right_button">{props.this.state.profile['bad_answers']}</div>
                </div>
                <Separator 
                    style={{
                        width: "90%", 
                        marginLeft: "10px",
                        marginTop: "14px",
                        marginBottom: "-10px"
                    }}
                ></Separator>
                <div id="animation" className="button_profile" onClick={() => props.this.myQuestions()}>
                    <Icon28PollSquareOutline width={28} height={28} className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Мои ответы</div>
                    <div className="near_right_button">{props.this.state.profile['total_answers']}</div>
                    <Icon16Chevron className="right_button"/>
                </div>
                <div id="animation" className="button_profile" onClick={() => props.this.goMoney()}>
                    <Icon28MarketOutline width={28} height={28} className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Магазин</div>
                    <div className="near_right_button">{props.this.state.profile['balance']}</div>
                    <Icon16Chevron className="right_button"/>
                </div>
                <div id="animation" className="button_profile" onClick={() => props.this.goAchive()}>
                    <Icon28FireOutline className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Достижения</div>
                    <Icon16Chevron className="right_button"/>
                </div>
                <div id="animation" className="button_profile" onClick={() => props.this.Dop()}>
                    <Icon28ArticleOutline className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Мои вопросы</div>
                    <Icon16Chevron className="right_button"/>
                </div>
                <div id="animation" className="button_profile" onClick={() => props.this.setActiveModal("share")}>
                    <Icon24ShareOutline width={28} height={28} className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Поделиться профилем</div>
                    <Icon16Chevron className="right_button"/>
                </div>
                <Separator 
                    style={{
                        width: "90%", 
                        marginLeft: "10px",
                        marginTop: "14px",
                        marginBottom: "-10px"
                    }}
                ></Separator>
                <div className="button_profile">
                    <Icon28Notifications className="icon_profile" style={{display: "inline-block"}}/> 
                    <div className="in_button">Уведомления в сообщения</div>
                    <Switch onChange={() => props.this.allowMessage()} className="right_button switch_case" defaultChecked={props.this.state.switchKeys}/>
                </div>
            </div>
        </div>
        {props.this.state.snackbar}
    </Panel>
)
  
export default Profile;