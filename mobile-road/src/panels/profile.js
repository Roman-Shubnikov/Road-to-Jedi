import React from 'react';

import { 
    Panel,
    PanelHeader,
    Group,
    Alert,
    Placeholder,
    Separator,
    PullToRefresh,
    PanelSpinner,
    InfoRow,
    Header,
    Counter,
    SimpleCell,
    PromoBanner,
    FixedLayout,
    Cell,
    Div,
    HorizontalScroll,
    View,
    Switch,
    } from '@vkontakte/vkui';

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


const Profile = props => (
    <Panel id={props.id}>
        <PanelHeader>Профиль</PanelHeader>
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
            <Group>
                <SimpleCell
                    expandable
                    href="https://vk.me/join/AJQ1dxm7YRd7rN/MQHaAtZx7"
                    target="_blank" rel="noopener noreferrer"
                    before={<Icon28GhostOutline />}>
                        Фантом-чат
                </SimpleCell>

                <SimpleCell 
                disabled
                before={<Icon28CheckCircleOutline 
                width={28} 
                height={28} />}
                indicator={<Counter mode='primary'>{props.this.state.profile['good_answers']}</Counter>}>Положительные ответы</SimpleCell>

                <SimpleCell 
                disabled
                before={<Icon28CheckCircleOutline 
                width={28} 
                height={28} />}
                indicator={<Counter mode='primary'>{props.this.state.profile['bad_answers']}</Counter>}>Отрицательные ответы</SimpleCell>
            </Group>
            <Group>
                <SimpleCell
                expandable
                indicator={<Counter mode='primary'>{props.this.state.profile['total_answers']}</Counter>}
                onClick={() => {
                    props.this.myQuestions();
                }}
                before={<Icon28PollSquareOutline />}>Мои ответы</SimpleCell>
                <SimpleCell
                expandable
                onClick={() => {
                    props.this.goMoney();
                }}
                before={<Icon28MarketOutline />}>Магазин</SimpleCell>
                {/* props.this.state.profile['balance'] Вынести отдельно в магазин */}

                <SimpleCell
                expandable
                onClick={() => {
                    props.this.goAchive();
                }}
                before={<Icon28FireOutline />}>Достижения</SimpleCell>
                <SimpleCell
                expandable
                onClick={() => {
                    props.this.Dop();
                }}
                before={<Icon28ArticleOutline />}>Мои вопросы</SimpleCell>

                <SimpleCell
                expandable
                onClick={() => {
                    props.this.setActiveModal("share");
                }}
                before={<Icon28ArticleOutline />}>Поделиться профилем</SimpleCell>

            </Group>
            <Group>
                <SimpleCell
                onClick={() => {
                    props.this.allowMessage();
                }}
                indicator={<Switch onChange={() => props.this.allowMessage()} defaultChecked={props.this.state.switchKeys}/>}
                before={<Icon28Notifications />}>Уведомления в сообщения</SimpleCell>
            </Group>
        {props.this.state.snackbar}
    </Panel>
)
  
export default Profile;