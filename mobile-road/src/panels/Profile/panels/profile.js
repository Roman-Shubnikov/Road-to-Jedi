import React from 'react';
// import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    Avatar,
    Counter,
    SimpleCell,
    Div,
    FormStatus,
    PullToRefresh,
    RichCell,
    Header,
    HorizontalScroll,
    HorizontalCell,
    MiniInfoCell,
    Alert,
    Textarea,


    } from '@vkontakte/vkui';

import {
    Icon12Fire,
    Icon16Verified,
    Icon28PollSquareOutline,
    Icon28MarketOutline,
    Icon28Notifications,
    Icon28ShareExternalOutline,
    Icon16StarCircleFillYellow,
    Icon28Messages,
    Icon28DiamondOutline,
    Icon28BrainOutline,
    Icon28SettingsOutline,
    Icon20ArticleOutline,
    Icon48DonateOutline,
    
} from '@vkontakte/icons';

function isEmpty(obj) {
    for (let key in obj) {
      // если тело цикла начнет выполняться - значит в объекте есть свойства
      return false;
    }
    return true;
  }

  function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }
class Profile extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            fetching: false,
            subscribe: false,
            newStatus: this.props.account.publicStatus
        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.setActiveModal = propsbi.setActiveModal;
        this.changeStatus = this.changeStatus.bind(this)
        this.onChange = (event) => {
            var name = event.currentTarget.name;
            var value = event.currentTarget.value;
            this.setState({ [name]: value });
            
        }

    }
    changeStatus(){
        this.setPopout(
            <Alert 
            actionsLayout="horizontal"
            actions={[{
              title: 'Отмена',
              autoclose: true,
              mode: 'cancel'
            },
            {
                title: 'Сохранить',
                autoclose: true,
                mode: 'default',
                action: () => this.saveNewStatus()
              }]}
            onClose={() => this.setPopout(null)}
            header="Ваш статус">
                <Textarea maxLength="140" onChange={this.onChange} name="newStatus" defaultValue={this.state.newStatus} />
            </Alert>
        )
    }
    saveNewStatus(){
        fetch(this.state.api_url + "method=account.changeStatus&" + window.location.search.replace('?', ''),
          {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'status': this.state.newStatus.trim(),
                })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              setTimeout(() => {
                this.props.this.ReloadProfile();
              }, 1000)
            } else {
                this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.props.this.changeData('activeStory', 'disconnect')
          })
    }
    componentDidMount(){
        // bridge.send("VKWebAppJoinGroup", {group_id: 188280516})
        // .then(data => {
        //     console.log(data)
        // })
    }
    render(){
        var props = this.props.this;
        return(
            <Panel id={this.props.id}>
                {!isEmpty(this.props.account) ? <>
                <PanelHeader
                left={<><PanelHeaderButton onClick={() => {
                    this.setActiveModal("share");
                }}>
                        <Icon28ShareExternalOutline />
                    </PanelHeaderButton>
                    <PanelHeaderButton label={this.props.account.notif_count ? <Counter size="s" mode="prominent">{this.props.account.notif_count}</Counter> : null}
                    onClick={() => {
                        this.props.this.changeData("activeStory", 'notif');
                        window.history.pushState( { panel: 'notif' }, 'notif' );
                    }}>
                        <Icon28Notifications/>
                    </PanelHeaderButton></>}>Профиль</PanelHeader>
                    <PullToRefresh onRefresh={() => {this.setState({fetching: true});this.props.this.ReloadProfile();setTimeout(() => {this.setState({fetching: false});}, 1000)}} isFetching={this.state.fetching}>
                        <Group>
                        <RichCell
                            disabled
                            before={this.props.account.diamond ?
                                <div style={{position:'relative', margin: 10}}><Avatar src={this.props.account['avatar']['url']} size={72} style={{position: 'relative'}} />
                                <Icon28DiamondOutline width={25} height={25} className='Diamond_profile' />
                                </div> : <Avatar size={72} src={this.props.account['avatar']['url']} />}
                            >
                                <div style={{display:"flex"}}>
                                    {this.props.account['nickname'] ? this.props.account['nickname'] : `Агент Поддержки #${this.props.account['id']}`}
                                    {this.props.account['flash'] === true ? 
                                            <div className="profile_icon">
                                                <Icon12Fire width={12} height={12} onClick={() => props.setActiveModal('prom')}/>  
                                            </div>
                                            : null}
                                    {this.props.account['donut'] === true ? 
                                        <div className="profile_icon">
                                            <Icon16StarCircleFillYellow width={12} height={12} onClick={() => props.setActiveModal('donut')} />  
                                        </div>
                                        : null}
                                    {this.props.account['verified'] === true ? 
                                        <div className="profile_icon_ver">
                                            <Icon16Verified onClick={() => props.setActiveModal('verif')} />  
                                        </div>
                                        : null}
                                </div>
                                
                            </RichCell>
                        </Group>
                        <Group>
                            <MiniInfoCell
                            before={<Icon20ArticleOutline />}
                            textWrap='full'
                            onClick={() => {
                                this.changeStatus()
                            }}>
                                {this.props.account.publicStatus || "Играю в любимую игру"}
                            </MiniInfoCell>
                        </Group>
                        {this.props.account.followers[0] ?
                            <Group header={
                            <Header 
                            mode="secondary"
                            aside={this.props.account.followers[0] + " " + enumerate(this.props.account.followers[0], ['подписчик', 'подписчика', 'подписчиков'])}
                            >
                                Подписчики
                            </Header>
                            }>
                                    <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
                                    <div style={{ display: 'flex' }}>
                                        {
                                            this.props.account.followers[2].map((item, i) => 
                                            <HorizontalCell 
                                            key={item.id} 
                                            size='s' 
                                            header={item.nickname ? item.nickname : `Агент #${item.from_id}`}
                                            onClick={() => {
                                                this.props.this.goOtherProfile(item.from_id);
                                            }}>
                                                <Avatar size={56} src={"https://xelene.ru/road/php/images/avatars/" + item.avatar_name}/>
                                            </HorizontalCell>)
                                        }
                                    </div>
                                    </HorizontalScroll>
                            </Group>
                        :null}
                        
                        <Group>
                            <SimpleCell
                                expandable
                                href="https://vk.me/join/zyWQzsgQ9iw6V2YAfbwiGtuO883rnYhXwAY="
                                target="_blank" rel="noopener noreferrer"
                                before={<Icon28Messages />}>
                                    Чат
                            </SimpleCell>
                            {this.props.account.donut_chat_link && <SimpleCell
                                expandable
                                href={this.props.account.donut_chat_link}
                                target="_blank" rel="noopener noreferrer"
                                before={<Icon48DonateOutline width={28} height={28} />}>
                                    Чат для донов
                            </SimpleCell>}

                        </Group>
                        <Group>
                            {(this.props.account['special'] || this.props.account['generator']) || <SimpleCell
                            expandable
                            onClick={() => {
                                this.props.this.goPanel('qu');
                            }}
                            before={<Icon28PollSquareOutline />}>Мои ответы</SimpleCell>}
                            <SimpleCell
                            expandable
                            onClick={() => {
                                this.props.this.goPanel('market');
                            }}
                            before={<Icon28MarketOutline />}>Магазин</SimpleCell>

                            {this.props.account['generator'] && <SimpleCell
                            expandable
                            onClick={() => {
                                this.props.this.goPanel('new_ticket');
                            }}
                            before={<Icon28BrainOutline />}>Генератор вопросов</SimpleCell>}
                            
                            <SimpleCell
                            expandable
                            onClick={() => {
                                this.props.this.goPanel('settings');
                            }}
                            before={<Icon28SettingsOutline />}>Настройки</SimpleCell>
                            
                            {/* 
                            <SimpleCell
                            expandable
                            onClick={() => {
                                this.props.this.goPanel('achievements');
                            }}
                            before={<Icon28PaletteOutline />}>Достижения</SimpleCell> */}
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
                            
                        
                            {!this.props.account['special'] ? <Div>
                                <FormStatus header="Внимание! Важная информация" mode="default">
                                Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                                </FormStatus>
                            </Div> : null}
                        </Group>
                    </PullToRefresh>
                {this.props.this.state.snackbar}
                </> : null}
            </Panel>
        )
    }
        
}


export default Profile