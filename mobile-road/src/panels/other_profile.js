import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import Button from '@vkontakte/vkui/dist/components/Button/Button';

import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon24DoNotDisturb from '@vkontakte/icons/dist/24/do_not_disturb';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon16Done from '@vkontakte/icons/dist/16/done';

let month = "undefined"
function fix_time(time) {
    if(time < 10) {
        return "0" + time
    } else {
        return time
    }
  }
    class Reader extends React.Component {
        constructor(props) {
            super(props);
        }

        please_Month(text) {
            switch(text) {
               case 0:
                 month = "января"
               break;
               case 1:
                   month = "февраля"
               break;
               case 2:
                   month= "марта"
               break;
               case 3:
                   month= "апреля"
               break;
               case 4:
                   month= "мая"
               break;
               case 5:
                   month= "июня"
               break;
               case 6:
                   month= "июля"
               break;
               case 7:
                   month= "августа"
               break;
               case 8:
                   month= "сентября"
               break;
               case 9:
                   month= "октября"
               break;
               case 10:
                   month= "ноября"
               break;
               case 11:
                   month= "декабря"
               break;
               
            }
         }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderButton onClick={() => window.history.back()}> 

                    <Icon24BrowserBack/>
                    </PanelHeaderButton>
                    }>
                        <span onClick={() => props.copy1(props.state.other_profile['id'], props.state.other_profile['flash'])}>Профиль</span>
                </PanelHeader>
                {props.state.other_profile != undefined ? this.please_Month(new Date(props.state.other_profile['registered'] * 1e3).getMonth() + 1) : null}
                <Cell
                  description={
                      <div className="description_other_profile">
                     {props.state.other_profile['online']['is_online'] === true ? "online" : new Date(props.state.other_profile['online']['last_seen'] * 1e3).getDate() + " " + month + " "  + new Date(props.state.other_profile['online']['last_seen'] * 1e3).getFullYear() + " в " 
                  + fix_time(new Date(props.state.other_profile['online']['last_seen'] * 1e3).getHours()) + ":" + fix_time(new Date(props.state.other_profile['online']['last_seen'] * 1e3).getMinutes())}
                  </div>
                }
                  size="l"
                  before={<Avatar src={"https://api.xelene.me" + props.state.other_profile['avatar']['url']} size={70}/>}
                >
                  <div className="title_profile">
                  {isFinite(props.state.other_profile['nickname']) ? `Агент Поддержки #${props.state.other_profile['nickname']}` : props.state.other_profile['nickname'] ? props.state.other_profile['nickname'] : `Агент Поддержки #${props.state.other_profile['id']}`}
                    {props.state.other_profile['flash'] === true ? 
                    <div className="profile_moderator_name_icon">
                        <Icon12Fire onClick={() => props.setActiveModal('prom')}/>  
                    </div>
                    : 
                    props.state.other_profile['verified'] === true ?
                    <div className="profile_moderator_name_icon_ver">
                        <Icon16Done width={12} height={12}/>  
                    </div>
                    : null}
                  </div>
                  {this.please_Month(new Date(props.state.other_profile['registered'] * 1e3).getMonth() + 1)}
                  </Cell>
                  {props.state.other_profile['nickname'] === 'Специальный Агент' || props.state.other_profile['banned'] ? <div style={{marginTop: "20px"}} className="help_title_profile">{props.state.other_profile['banned'] ? 'Этот профиль забанен' : 'Вы не можете просматривать этот профиль'}</div> :
                  <div>
                  <Separator></Separator>
                  <br/>
                  <Cell before={<Icon28RecentOutline height={30} width={30} className="other_icon"/>} className="information_profile">
                  <div className="minititle">
                      Дата регистрации
                  <div className="help_profile">{new Date(props.state.other_profile['registered'] * 1e3).getDate()} {month}  {new Date(props.state.other_profile['registered'] * 1e3).getFullYear()}</div>
                  </div>
                  </Cell>
                  <Cell before={<Icon28InfoOutline className="other_icon"/>} className="information_profile">
                  <div className="minititle">
                  Всего ответов
                  <div className="help_profile">{props.state.other_profile['total_answers']}</div>
                  </div>
                  </Cell>
                  <Cell before={<Icon28CheckCircleOutline className="other_icon"/>} className="information_profile">
                  <div className="minititle">
                  Положительных ответов
                  <div className="help_profile">{props.state.other_profile['good_answers']}</div>
                  </div>
                  </Cell>
                  <Cell before={<Icon24DoNotDisturb className="other_icon" height={28} width={28}/>} className="information_profile">
                  <div className="minititle">
                  Отрицательных ответов
                  <div className="help_profile">{props.state.other_profile['bad_answers']}</div>
                  </div>
                  </Cell>
                  <Separator></Separator>
                  <div style={{marginTop: "20px"}} className="help_title_profile">В недалеком будущем здесь что-то будет</div>
                  <div className="help_title_profile">Ждем вместе с вами!</div>
                  </div>
                  }
            </Panel>
            )
            }
        }
  
export default Reader;