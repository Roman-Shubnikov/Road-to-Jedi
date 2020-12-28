import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    Group,
    Div,
    FormStatus,
    Avatar,
    ScreenSpinner,
    ActionSheet,
    ActionSheetItem,
    PanelHeaderBack,
    Placeholder,
    Header,
    RichCell,
    Snackbar,
    MiniInfoCell,
    UsersStack,
    Button,
    Link,


    } from '@vkontakte/vkui';
import Icon20BookOutline            from '@vkontakte/icons/dist/20/book_outline';
import Icon16Fire                   from '@vkontakte/icons/dist/16/fire';
import Icon16Verified               from '@vkontakte/icons/dist/16/verified';
import Icon16StarCircleFillYellow   from '@vkontakte/icons/dist/16/star_circle_fill_yellow';
import Icon28WalletOutline          from '@vkontakte/icons/dist/28/wallet_outline';
import Icon28PaletteOutline         from '@vkontakte/icons/dist/28/palette_outline';
import Icon28Notifications          from '@vkontakte/icons/dist/28/notifications';
import Icon56DurationOutline        from '@vkontakte/icons/dist/56/duration_outline';
import Icon28DiamondOutline         from '@vkontakte/icons/dist/28/diamond_outline';
import Icon16CheckCircle            from '@vkontakte/icons/dist/16/check_circle';
import Icon24MoreVertical           from '@vkontakte/icons/dist/24/more_vertical';
import Icon20ArticleOutline         from '@vkontakte/icons/dist/20/article_outline';
import Icon20FollowersOutline       from '@vkontakte/icons/dist/20/followers_outline';
import Icon20Info                   from '@vkontakte/icons/dist/20/info';
import Icon20GlobeOutline           from '@vkontakte/icons/dist/20/globe_outline';
import Icon20WorkOutline            from '@vkontakte/icons/dist/20/work_outline';
import Icon20Add                    from '@vkontakte/icons/dist/20/add';
import Icon20UserOutline            from '@vkontakte/icons/dist/20/user_outline';


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

  function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }
const SCHEMES = [
    'Автоматическая',
    'Light',
    'Dark',
]
const NOTI = [
    'Выключены',
    'Включены'
]

const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
class OtherProfile extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                other_profile: null,
                snackbar: null,
                ShowServiceInfo: false,
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.subscribeUnsubscribe = this.subscribeUnsubscribe.bind(this);
            this.profRef = React.createRef()
            this.setSnack = (value) => {
                this.setState({snackbar: value})
              }
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
        infoMenu(id, prometey) {
            this.setPopout(
              <ActionSheet onClose={() => this.setPopout(null)}
              toggleRef={this.profRef.current}
                iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
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
                <ActionSheetItem autoclose 
                onClick={() => {
                    bridge.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#agent_id=" + id});
                    this.setSnack(<Snackbar
                        layout="vertical"
                        onClose={() => this.setSnack(null)}
                        before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}>
                            Ссылка скопирована
                        </Snackbar>)
                }}>
                    Скопировать ссылку
                </ActionSheetItem>
                <ActionSheetItem autoclose 
                mode='destructive'
                onClick={() => {
                    this.props.this.setReport(2, this.state.other_profile['id']) // профиль, id
                }}>
                    Пожаловаться
                </ActionSheetItem>
              </ActionSheet>)
          }
        subscribeUnsubscribe(){
            this.setPopout(<ScreenSpinner/>)
            let method = this.state.other_profile.subscribe ? "followers.unsubscribe&" : "followers.subscribe&"
            fetch(this.state.api_url + `method=${method}` + window.location.search.replace('?', ''),
            {method: 'post',
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify({
            'agent_id': this.state.other_profile.id,
            })
            })
              .then(res => res.json())
              .then(data => {
                if(data.result) {
                    // let newProfile = {...this.state.other_profile}
                    // newProfile.subscribe = (method === "followers.unsubscribe&") ? false : true;
                    // this.setState({other_profile: newProfile})
                    this.PrepareProfile();
                    this.setPopout(null);

                }else {
                    this.showErrorAlert(data.error.message)
                  }
              })
              .catch(err => {
                this.props.this.changeData('activeStory', 'disconnect')
              })
        }
        subscribeMenu(){
            if(this.state.other_profile.subscribe){
                this.setPopout(
                    <ActionSheet onClose={() => this.setPopout(null)}
                    toggleRef={this.profRef.current}
                    iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
                        <ActionSheetItem mode='destructive' onClick={() => {
                            this.subscribeUnsubscribe()
                        }}>Отписаться</ActionSheetItem>
                    </ActionSheet>)
            }else{
                this.subscribeUnsubscribe()
            }
            
        }
        
        please_Month(text) {
            let mounts = [
                "января",
                "февраля",
                "марта",
                "апреля",
                "мая",
                "июня",
                "июля",
                "августа",
                "сентября",
                "октября",
                "ноября",
                "декабря"
            ];
            return mounts[text]
         }

        componentDidMount(){
            this.setPopout(<ScreenSpinner/>);
            this.PrepareProfile();
            // console.log(queryString.parse(window.location.hash))
            // this.props.this.setReport(21,41)
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderBack onClick={() => window.history.back()}/>
                    }>
                        Профиль
                </PanelHeader>
                
                {this.state.other_profile && !this.state.other_profile['banned'] ? <>
                <Group>
                    <RichCell
                    disabled
                    after={
                        <Icon24MoreVertical 
                        onClick={() => this.infoMenu(this.state.other_profile['id'], this.state.other_profile['flash'])}
                        getRootRef={this.profRef}
                         />
                    }
                    caption={
                        this.state.other_profile['online']['is_online'] === true ? "online" : new Date(this.state.other_profile['online']['last_seen'] * 1e3).getDate() + " " + this.please_Month(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getMonth()) + " "  + new Date(this.state.other_profile['online']['last_seen'] * 1e3).getFullYear() + " в " 
                    + fix_time(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getHours()) + ":" + fix_time(new Date(this.state.other_profile['online']['last_seen'] * 1e3).getMinutes())
                    }
                    before={this.state.other_profile.diamond ?
                        <div style={{position:'relative', margin: 10}}><Avatar src={this.state.other_profile['avatar']['url']} size={70} style={{position: 'relative'}} />
                        <Icon28DiamondOutline width={25} height={25} className='Diamond_profile' />
                        </div> : <Avatar size={70} src={this.state.other_profile['avatar']['url']} style={{position: 'relative'}} />}
                    >
                    <div style={{display:'flex'}}>
                    {this.state.other_profile['nickname'] ? this.state.other_profile['nickname'] : `Агент Поддержки #${this.state.other_profile['id']}`}
                        {this.state.other_profile['flash'] && 
                        <div className="profile_moderator_name_icon">
                            <Icon16Fire width={12} height={12} style={{color: "var(--prom_icon)"}} onClick={() => props.setActiveModal('prom')} />  
                        </div>}
                        {this.state.other_profile['donut'] &&
                        <div className="profile_moderator_name_icon">
                            <Icon16StarCircleFillYellow width={12} height={12} onClick={() => props.setActiveModal('donut')} />  
                        </div>}
                        {this.state.other_profile['verified'] &&
                        <div className="profile_moderator_name_icon_ver">
                            <Icon16Verified style={{color: "var(--dynamic_blue)"}} onClick={() => props.setActiveModal('verif')} />  
                        </div>}
                    </div>
                    </RichCell>
                    <Div style={{display: 'flex'}}>
                        {this.state.other_profile.public && <Button
                        size='m'
                        stretched
                        target="_blank" rel="noopener noreferrer"
                        href={"https://vk.me/id" + this.state.other_profile.vk_id}
                        style={{marginRight: 8}}>
                            Сообщение
                        </Button>}
                        <Button
                        size='m'
                        stretched
                        onClick={() => this.subscribeMenu()}
                        mode={this.state.other_profile.subscribe ? 'secondary' : 'primary'}>
                            {this.state.other_profile.subscribe ? "Вы подписаны" : "Подписаться"}
                        </Button>
                    </Div>
                </Group>
                
                {
                (this.state.other_profile['special'] || this.state.other_profile['generator'] || this.state.other_profile['banned']) ? 
                <div style={{marginTop: 20, marginBottom: 20}} className="help_title_profile">{this.state.other_profile['banned'] ? 
                'Этот профиль забанен' : 
                'Вы не можете просматривать этот профиль'}
                </div> :
                <>
                <Group header={<Header mode='tertiary'>Основная информация</Header>}>
                    <MiniInfoCell
                    before={<Icon20ArticleOutline />}
                    textWrap='full'>
                        {this.state.other_profile.publicStatus || "Играю в любимую игру"}
                    </MiniInfoCell>
                    <MiniInfoCell
                    before={<Icon20FollowersOutline />}
                    after={
                        <UsersStack 
                        photos={this.state.other_profile['followers'][2].map((user,i) => "https://xelene.ru/road/php/images/avatars/" + user.avatar_name)} />
                    }>
                        {this.state.other_profile['followers'][0] ? this.state.other_profile['followers'][0] + " " + enumerate(this.state.other_profile['followers'][0], 
                        ['подписчик', 'подписчика', 'подписчиков']) : "нет подписчиков"}
                        {this.state.other_profile['followers'][1] ? " · " + 
                        this.state.other_profile['followers'][1] + " " + enumerate(this.state.other_profile['followers'][1], 
                        ['новый', 'новых', 'новых']) : ''}
                    </MiniInfoCell>
                    <MiniInfoCell
                        mode='full'
                        before={<Icon20WorkOutline/>}>
                        Дата регистрации: {new Date(this.state.other_profile.registered * 1e3).getDate() + " " + 
                        this.please_Month(new Date(this.state.other_profile['registered'] * 1e3).getMonth()) + " " + 
                        new Date(this.state.other_profile.registered * 1e3).getFullYear()}

                    </MiniInfoCell>
                    <MiniInfoCell
                    textWrap='full'
                    before={<Icon20BookOutline />}>
                        {recog_number(this.state.other_profile['good_answers'] + 
                        this.state.other_profile['bad_answers']) + " " + enumerate(this.state.other_profile['good_answers'] + this.state.other_profile['bad_answers'], 
                        ['Ответ', 'Ответа', 'Ответов'])}
                    </MiniInfoCell>
                    <MiniInfoCell
                    textWrap='full'
                    before={<Icon20Info />}>
                        {recog_number(
                        this.state.other_profile['good_answers']) + " " + enumerate(this.state.other_profile['good_answers'], 
                        ['Положительный', 'Положительныx', 'Положительных'])} · {recog_number(
                        this.state.other_profile['bad_answers']) + " " + enumerate(this.state.other_profile['bad_answers'], 
                        ['Отрицательный', 'Отрицательных', 'Отрицательных'])}
                    </MiniInfoCell>
                    {this.state.other_profile.public && <MiniInfoCell
                        mode='base'
                        before={<Icon20GlobeOutline/>}>
                        <Link href={'https://vk.com/id' + this.state.other_profile.vk_id}
                        target="_blank" rel="noopener noreferrer">Страница ВКонтакте</Link>
                    </MiniInfoCell>}
                    {this.props.account.special &&  <MiniInfoCell
                        before={<Icon20Add style={{transform: this.state.ShowServiceInfo ? "rotate(45deg)" : '', transition: 'all 0.3s'}} />}
                        mode="more"
                        onClick={() => {this.setState({ShowServiceInfo: !this.state.ShowServiceInfo})}}
                    >
                        Подробная информация
                    </MiniInfoCell>}
                    
                </Group>
                {this.state.ShowServiceInfo && 
                     <Group>
                        <MiniInfoCell 
                        before={<Icon20UserOutline />}
                        after={this.state.other_profile['age'] + " " + enumerate(this.state.other_profile['age'], ['год', 'года', 'лет'])}>
                            Возраст
                        </MiniInfoCell>
                        <MiniInfoCell
                        before={<Icon28WalletOutline width={20} height={20} />}
                        after={recog_number(this.state.other_profile['balance'])}>
                            Баланс
                        </MiniInfoCell>
                        
                        <MiniInfoCell
                        before={<Icon28PaletteOutline width={20} height={20} />}
                        after={SCHEMES[this.state.other_profile['scheme']]}>
                            Используемая тема
                        </MiniInfoCell>
                        <MiniInfoCell
                        before={<Icon28Notifications width={20} height={20} />}
                        after={NOTI[Number(this.state.other_profile['noti'])]}>
                            Уведомления
                        </MiniInfoCell>
                        <MiniInfoCell
                        mode='base'
                        before={<Icon20GlobeOutline/>}>
                            <Link href={'https://vk.com/id' + this.state.other_profile.vk_id}
                            target="_blank" 
                            rel="noopener noreferrer">
                                Страница ВКонтакте
                            </Link>
                        </MiniInfoCell>
                     </Group>         
                }
                </>
                }
                
                {!this.props.account['special'] &&
                <Group>
                    <Div>
                        <FormStatus header="Внимание! Важная информация" mode="default">
                        Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                        </FormStatus>
                    </Div>
                </Group>}
                </> : 
                this.state.other_profile &&
                <Placeholder 
                stretched
                icon={<Icon56DurationOutline style={{color: 'var(--dynamic_red)'}} />}>
                    {!this.state.other_profile['banned']['time_end'] ? "Этот аккаунт был заблокирован навсегда" : "Этот аккаунт был временно заблокирован"}
                    <br/>
                    {this.state.other_profile['banned']['time_end'] ? <p>До: {this.convertTime(this.state.other_profile.banned.time_end)}<br /></p> : null}
                    {this.state.other_profile['banned']['reason'] ? "Причина: " + this.state.other_profile['banned']['reason'] : null}
                </Placeholder>}
                {this.state.snackbar}
            </Panel>
            )
            }
        }
  
export default OtherProfile;