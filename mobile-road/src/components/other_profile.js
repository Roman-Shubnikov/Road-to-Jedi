import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Button,
    Group,
    Alert,
    Avatar,
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
    ScreenSpinner,
    ActionSheet,
    ActionSheetItem,
    Snackbar,
    ModalRoot,
    ModalCard,
    ModalPage,
    ModalPageHeader,
    Tabbar,
    TabbarItem,
    Epic,
    Input,
    FormLayout,
    List,
    Slider,
    ConfigProvider,
    platform
    } from '@vkontakte/vkui';

import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon24DoNotDisturb from '@vkontakte/icons/dist/24/do_not_disturb';
import Icon28CheckCircleOutline from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon16Fire from '@vkontakte/icons/dist/16/fire';
import Icon16Verified from '@vkontakte/icons/dist/16/verified';

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
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                other_profile: null
            }
            var props = this.props.this;
            this.setPopout = props.setPopout;
            this.showErrorAlert = props.showErrorAlert;
            this.setActiveModal = props.setActiveModal;
        }
        PrepareProfile(is_change=false){
            fetch(this.state.api_url + "method=user.getById&id=" + this.props.agent_id + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.setState({other_profile: data.response})
                this.setPopout(null)
              }else {
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
              this.showErrorAlert(err)
    
            })
        }
        Prom(id, give=true) {
            this.setState({popout: <ScreenSpinner/>})
            fetch(this.state.api_url + "method=account.Flash&agent_id=" + id + '&give=' + Number(give) + "&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
                if(data.result) {
                    let prof = this.state.other_profile;
                    if(give){
                        prof['flash'] = true;
                    } else {
                        prof['flash'] = false;
                    }
                    this.setState({other_profile: prof})
                }else {
                    this.showErrorAlert(data.error.message)
                  }
              })
              .catch(err => {
                this.showErrorAlert(err)
              })
          }
        copy(id, prometey) {
            this.setPopout(
              <ActionSheet onClose={() => this.setPopout(null)}>
                {this.props.account.special ? 
                 <ActionSheetItem autoclose onClick={prometey ? () => this.Prom(id, false) : () => this.Prom(id)}>
                  {prometey ? 'Забрать прометей' : 'Выдать прометей'}
                </ActionSheetItem>
                : null }
                {this.props.account.special ? 
                 <ActionSheetItem autoclose onClick={() => {this.props.this.setState({other_profile:this.state.other_profile});this.setActiveModal('ban_user');}}>
                  Заблокировать
                </ActionSheetItem>
                : null }
                <ActionSheetItem autoclose onClick={() => {bridge.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#agent_id=" + id})}}>
                  Скопировать ссылку
                </ActionSheetItem>
                {<ActionSheetItem autoclose theme="cancel">Отменить</ActionSheetItem>}
              </ActionSheet>)
          }
        
        please_Month(text) {
            let month = 'января'
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
            return month
         }
        componentDidMount(){
            this.setPopout(<ScreenSpinner/>);
            this.PrepareProfile();
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderButton onClick={() => this.props.this.goBack()}>

                    <Icon24BrowserBack/>
                    </PanelHeaderButton>
                    }>
                        <span onClick={() => this.copy(this.state.other_profile['id'], this.state.other_profile['flash'])}>Профиль</span>
                </PanelHeader>
                {this.state.other_profile ? <>
                <Cell
                  description={
                      <div className="description_other_profile">
                     {this.state.other_profile['online']['is_online'] === true ? "online" : new Date(this.state.other_profile['online']['last_seen'] * 1e3).getDate() + " " + this.please_Month(new Date(this.state.other_profile['registered'] * 1e3).getMonth() + 1) + " "  + new Date(this.state.other_profile['online']['last_seen'] * 1e3).getFullYear() + " в " 
                  + fix_time(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getHours()) + ":" + fix_time(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getMinutes())}
                  </div>
                }
                  size="l"
                  before={<Avatar src={this.state.other_profile['avatar']['url']} size={70}/>}
                >
                  <div className="title_profile">
                  {isFinite(this.state.other_profile['nickname']) ? `Агент Поддержки #${this.state.other_profile['nickname']}` : this.state.other_profile['nickname'] ? this.state.other_profile['nickname'] : `Агент Поддержки #${this.state.other_profile['id']}`}
                    {this.state.other_profile['flash'] === true ? 
                    <div className="profile_moderator_name_icon">
                        <Icon16Fire width={12} height={12} style={{color: "var(--prom_icon)"}} onClick={() => props.setActiveModal('prom')} />  
                    </div>
                    : null}
                    {this.state.other_profile['verified'] === true ?
                    <div className="profile_moderator_name_icon">
                        <Icon16Verified width={12} height={12} style={{color: "var(--dynamic_blue)"}} />  
                    </div>
                    : null}
                  </div>
                  </Cell>
                  <Separator />
                  {this.state.other_profile['nickname'] === 'Специальный Агент' || this.state.other_profile['banned'] ? <div style={{marginTop: "20px"}} className="help_title_profile">{this.state.other_profile['banned'] ? 'Этот профиль забанен' : 'Вы не можете просматривать этот профиль'}</div> :
                    <Group>
                    <SimpleCell 
                        disabled
                        before={<Icon28RecentOutline />}
                        indicator={new Date(this.state.other_profile.registered * 1e3).getDate() + " " + this.please_Month(new Date(this.state.other_profile['registered'] * 1e3).getMonth() + 1) + " " + new Date(this.state.other_profile.registered * 1e3).getFullYear()}>
                            Дата регистрации
                    </SimpleCell>
                    <SimpleCell 
                        disabled
                        before={<Icon28InfoOutline />}
                        indicator={<Counter mode='primary'>{this.state.other_profile['total_answers']}</Counter>}>
                            Всего ответов
                    </SimpleCell>
                    <SimpleCell 
                        disabled
                        before={<Icon28CheckCircleOutline />}
                        indicator={<Counter mode='primary'>{this.state.other_profile['good_answers']}</Counter>}>
                            Положительные ответы
                    </SimpleCell>
                    <SimpleCell 
                        disabled
                        before={<Icon24DoNotDisturb width={28} height={28} />}
                        indicator={<Counter mode='primary'>{this.state.other_profile['bad_answers']}</Counter>}>
                            Отрицательных ответов
                    </SimpleCell>
                </Group>}
                <Separator />
                <div style={{marginTop: "20px"}} className="help_title_profile">В недалеком будущем здесь что-то будет</div>
                <div className="help_title_profile">Ждем вместе с вами!</div>
                </> : null}
            </Panel>
            )
            }
        }
  
export default Reader;