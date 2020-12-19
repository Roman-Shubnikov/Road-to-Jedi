import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    Group,
    Div,
    FormStatus,
    Avatar,
    Separator,
    Counter,
    SimpleCell,
    Cell,
    ScreenSpinner,
    ActionSheet,
    ActionSheetItem,
    PanelHeaderBack,
    Placeholder,
    } from '@vkontakte/vkui';

import Icon28RecentOutline          from '@vkontakte/icons/dist/28/recent_outline';
import Icon24DoNotDisturb           from '@vkontakte/icons/dist/24/do_not_disturb';
import Icon28CheckCircleOutline     from '@vkontakte/icons/dist/28/check_circle_outline';
import Icon16Fire                   from '@vkontakte/icons/dist/16/fire';
import Icon16Verified               from '@vkontakte/icons/dist/16/verified';
import Icon16StarCircleFillYellow   from '@vkontakte/icons/dist/16/star_circle_fill_yellow';
import Icon28LogoVkOutline          from '@vkontakte/icons/dist/28/logo_vk_outline';
import Icon28WalletOutline          from '@vkontakte/icons/dist/28/wallet_outline';
import Icon28PaletteOutline         from '@vkontakte/icons/dist/28/palette_outline';
import Icon28NameTagOutline         from '@vkontakte/icons/dist/28/name_tag_outline';
import Icon28InfoOutline            from '@vkontakte/icons/dist/28/info_outline';
import Icon28Notifications          from '@vkontakte/icons/dist/28/notifications';
import Icon56DurationOutline        from '@vkontakte/icons/dist/56/duration_outline';
import Icon28DiamondOutline         from '@vkontakte/icons/dist/28/diamond_outline';


function fix_time(time) {
    if(time < 10) {
        return "0" + time
    } else {
        return time
    }
  }
function recog_number(num){
    let out = ""
    if (num > 999999) {
      out = Math.floor(num / 1000000 * 10) / 10 + "M"
    } else if (num > 999) {
      out = Math.floor(num / 1000 * 10) / 10 + "K"
    } else {
      out = num
    }
    return out;
  };
const SCHEMES = [
    'Автоматическая',
    'Light',
    'Dark',
]
const NOTI = [
    'Выключены',
    'Включены'
]
    class Reader extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                other_profile: null
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
        }
        convertStandartDate(num){
            let out = '';
            if(num < 10){
                out = "0" + num;
            }else{
                out = num;
            }
            return out;
        }
        convertTime(timei){
            let out = '';
            let time = new Date(timei * 1000);
            out = this.convertStandartDate(time.getDate()) + 
            '.' + (this.convertStandartDate(time.getMonth() + 1)) + 
            '.' + time.getFullYear() + 
            ' ' + this.convertStandartDate(time.getHours()) + 
            ':' + this.convertStandartDate(time.getMinutes())
            return out;
        }
        PrepareProfile(is_change=false){
            fetch(this.state.api_url + "method=user.getById&" + window.location.search.replace('?', ''),
            {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                 // signal: controllertime.signal,
                body: JSON.stringify({
                'id': this.props.agent_id,
            })
            })
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.setState({other_profile: data.response})
                this.setPopout(null)
              }else {
                this.showErrorAlert(data.error.message, () => {window.history.back();this.props.this.setPopout(null)})
              }
            })
            .catch(err => {
                this.props.this.changeData('activeStory', 'disconnect')
                // this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже',() => {this.props.this.changeData('activeStory', 'disconnect')})
    
            })
        }
        Prom(id, give=true) {
            this.setState({popout: <ScreenSpinner/>})
            fetch(this.state.api_url + "method=account.Flash&" + window.location.search.replace('?', ''),
            {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                 // signal: controllertime.signal,
                body: JSON.stringify({
                'agent_id': id,
                'give': Number(give),
            })
            })
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
                this.props.this.changeData('activeStory', 'disconnect')
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
               default: 
                month = "января"
            }
            return month
         }
        componentDidMount(){
            this.setPopout(<ScreenSpinner/>);
            this.PrepareProfile();
            // console.log(queryString.parse(window.location.hash))
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderBack onClick={() => window.history.back()}></PanelHeaderBack>
                    }>
                        <span className='pointer' onClick={() => this.copy(this.state.other_profile['id'], this.state.other_profile['flash'])}>Профиль</span>
                </PanelHeader>
                
                {this.state.other_profile && !this.state.other_profile['banned'] ? <>
                <Cell
                  description={
                      <div className="description_other_profile">
                     {this.state.other_profile['online']['is_online'] === true ? "online" : new Date(this.state.other_profile['online']['last_seen'] * 1e3).getDate() + " " + this.please_Month(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getMonth()) + " "  + new Date(this.state.other_profile['online']['last_seen'] * 1e3).getFullYear() + " в " 
                  + fix_time(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getHours()) + ":" + fix_time(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getMinutes())}
                  </div>
                }
                  size="l"
                before={this.state.other_profile.diamond ?
                    <div style={{position:'relative', margin: 10}}><Avatar src={this.state.other_profile['avatar']['url']} size={70} style={{position: 'relative'}} />
                    <Icon28DiamondOutline width={25} height={25} className='Diamond_profile' />
                    </div> : <Avatar size={70} src={this.state.other_profile['avatar']['url']} style={{position: 'relative'}} />}
                >
                  <div className="title_profile">
                  {isFinite(this.state.other_profile['nickname']) ? `Агент Поддержки #${this.state.other_profile['nickname']}` : this.state.other_profile['nickname'] ? this.state.other_profile['nickname'] : `Агент Поддержки #${this.state.other_profile['id']}`}
                    {this.state.other_profile['flash'] === true ? 
                    <div className="profile_moderator_name_icon">
                        <Icon16Fire width={12} height={12} style={{color: "var(--prom_icon)"}} onClick={() => props.setActiveModal('prom')} />  
                    </div>
                    : null}
                    {this.state.other_profile['donut'] === true ?
                    <div className="profile_moderator_name_icon">
                        <Icon16StarCircleFillYellow width={12} height={12} onClick={() => props.setActiveModal('donut')} />  
                    </div>
                    : null}
                    {this.state.other_profile['verified'] === true ?
                    <div className="profile_moderator_name_icon_ver">
                        <Icon16Verified style={{color: "var(--dynamic_blue)"}} />  
                    </div>
                    : null}
                  </div>
                  </Cell>
                  <Separator />
                  {(this.state.other_profile['special'] || this.state.other_profile['generator'] || this.state.other_profile['banned']) ? <div style={{marginTop: 20, marginBottom: 20}} className="help_title_profile">{this.state.other_profile['banned'] ? 'Этот профиль забанен' : 'Вы не можете просматривать этот профиль'}</div> :
                    <Group>
                    <SimpleCell 
                        disabled
                        before={<Icon28RecentOutline />}
                        indicator={new Date(this.state.other_profile.registered * 1e3).getDate() + " " + this.please_Month(new Date(this.state.other_profile['registered'] * 1e3).getMonth()) + " " + new Date(this.state.other_profile.registered * 1e3).getFullYear()}>
                            Дата регистрации
                    </SimpleCell>
                    <SimpleCell 
                        disabled
                        before={<Icon28InfoOutline />}
                        indicator={<Counter mode='primary'>{recog_number(this.state.other_profile['good_answers'] + this.state.other_profile['bad_answers'])}</Counter>}>
                            Всего ответов
                    </SimpleCell>
                    <SimpleCell 
                        disabled
                        before={<Icon28CheckCircleOutline />}
                        indicator={<Counter mode='primary'>{recog_number(this.state.other_profile['good_answers'])}</Counter>}>
                            Положительные ответы
                    </SimpleCell>
                    <SimpleCell 
                        disabled
                        before={<Icon24DoNotDisturb width={28} height={28} />}
                        indicator={<Counter mode='primary'>{recog_number(this.state.other_profile['bad_answers'])}</Counter>}>
                            Отрицательных ответов
                    </SimpleCell>
                </Group>}
                
                {this.props.account['special'] ?
                <Group>
                    {this.state.other_profile['balance'] ? <SimpleCell 
                        disabled
                        before={<Icon28WalletOutline />}
                        indicator={<Counter mode='primary'>{recog_number(this.state.other_profile['balance'])}</Counter>}>
                            Баланс
                    </SimpleCell> : null}
                    {this.state.other_profile['vk_id'] ? <SimpleCell 
                        expandable
                        before={<Icon28LogoVkOutline />}
                        href={'https://vk.com/id' + this.state.other_profile['vk_id']}
                        target="_blank" rel="noopener noreferrer">
                            Профиль ВК
                    </SimpleCell> : null}
                    {this.state.other_profile['age'] ? <SimpleCell 
                        disabled
                        before={<Icon28NameTagOutline />}
                        indicator={<Counter mode='primary'>{this.state.other_profile['age']}</Counter>}>
                            Указанный возраст
                    </SimpleCell> : null}
                    {(this.state.other_profile['scheme'] !== null && this.state.other_profile['scheme'] !== undefined) ? <SimpleCell 
                        disabled
                        before={<Icon28PaletteOutline />}
                        indicator={SCHEMES[this.state.other_profile['scheme']]}>
                        Используемая тема
                    </SimpleCell> : null}
                    {(this.state.other_profile['noti'] !== null && this.state.other_profile['noti'] !== undefined) ? <SimpleCell 
                        disabled
                        before={<Icon28Notifications />}
                        indicator={NOTI[Number(this.state.other_profile['noti'])]}>
                        Уведомления
                    </SimpleCell> : null}
                </Group>
                : null}
                <Separator />
                {!this.props.account['special'] ? <Div>
                    <FormStatus header="Внимание! Важная информация" mode="default">
                    Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                    </FormStatus>
                </Div> : null}
                {/* <div style={{marginTop: "20px"}} className="help_title_profile">В недалеком будущем здесь что-то будет.</div>
                <div className="help_title_profile">Ждем вместе с вами!</div> */}
                </> : 
                this.state.other_profile ?
                (this.state.other_profile['banned']['time_end'] === 0) ?
                <Placeholder 
                stretched
                icon={<Icon56DurationOutline style={{color: 'var(--dynamic_red)'}} />}>
                    Этот аккаунт был заблокирован навсегда<br/>
                    {this.state.other_profile['banned']['reason'] ? "Причина: " + this.state.other_profile['banned']['reason'] : null}
                </Placeholder>
                :
                <Placeholder 
                stretched
                icon={<Icon56DurationOutline style={{color: 'var(--dynamic_red)'}} />}>
                    Этот аккаунт был временно заблокирован<br/>
                    До: {this.convertTime(this.state.other_profile.banned.time_end)}<br />
                    {this.state.other_profile['banned']['reason'] ? "Причина: " + this.state.other_profile['banned']['reason'] : null}
                </Placeholder> 
                : null}
            </Panel>
            )
            }
        }
  
export default Reader;