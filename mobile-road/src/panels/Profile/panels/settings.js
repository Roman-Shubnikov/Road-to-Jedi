import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
    Panel,
    PanelHeader,
    Group,
    Alert,
    Counter,
    SimpleCell,
    PanelHeaderBack,
    PromoBanner,
    FixedLayout,
    Switch,
    ScreenSpinner,
    platform, 
    IOS,
    } from '@vkontakte/vkui';


import Icon28DoneOutline            from '@vkontakte/icons/dist/28/done_outline';
import Icon28CoinsOutline           from '@vkontakte/icons/dist/28/coins_outline';
import Icon28PaletteOutline         from '@vkontakte/icons/dist/28/palette_outline';
import Icon28TargetOutline          from '@vkontakte/icons/dist/28/target_outline';
import Icon28InfoOutline            from '@vkontakte/icons/dist/28/info_outline';
import Icon28FavoriteOutline        from '@vkontakte/icons/dist/28/favorite_outline';
import Icon28Notifications          from '@vkontakte/icons/dist/28/notifications';
import Icon28GestureOutline         from '@vkontakte/icons/dist/28/gesture_outline';

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
export default class Settings extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            ShowBanner: true,
            noti: this.props.account ? this.props.account.settings.notify : null,
            public: this.props.account ? this.props.account.settings.public : false,

        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.showAlert = propsbi.showAlert;
        this.setActiveModal = propsbi.setActiveModal;
        this.onChange = (event) => {
            var name = event.currentTarget.name;
            var value = event.currentTarget.value;
            this.setState({ [name]: value });
        }
    }
    nofinc(){
      return
    }
    demissNotif(){
      fetch(this.state.api_url + "method=settings.set&" + window.location.search.replace('?', ''),
      {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          body: JSON.stringify({
              'setting': 'notify',
              'value': 0,
          })
          })
      .then(res => res.json())
      .then(data => {
      if(data.result) {
        this.setState({noti: false})
        this.setPopout(null)
      }else{
          this.showErrorAlert(data.error.message)
      }
      })
      .catch(err => {
        this.props.this.changeData('activeStory', 'disconnect')

      })
    }
    approveNotif(){
      fetch(this.state.api_url + "method=settings.set&" + window.location.search.replace('?', ''),
      {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          body: JSON.stringify({
              'setting': 'notify',
              'value': 1,
          })
          })
      .then(res => res.json())
      .then(data => {
      if(data.result) {
        this.setState({noti: true})
        this.setPopout(null)
      }else{
          this.showErrorAlert(data.error.message)
      }
      })
      .catch(err => {
        this.props.this.changeData('activeStory', 'disconnect')

      })
    }
    changeNotifStatus(notif){
      notif = notif.currentTarget.checked;
      this.setPopout(<ScreenSpinner />)
      if(notif){
          this.setPopout(<Alert
            actionsLayout='horizontal'
            actions={[{
              title: 'Разрешить',
              autoclose: true,
              mode: 'default',
              action: () => {
                bridge.send("VKWebAppAllowMessagesFromGroup", {"group_id": 188280516})
                .then(data => {
                  this.setState({noti: true})
                  this.approveNotif();
                  setTimeout(() => {
                    this.props.this.ReloadProfile()
                  }, 1000)
                  
                })
                .catch(() => {this.demissNotif()})
            },
            },{
              title: 'Нет, спасибо',
              autoclose: true,
              mode: 'cancel',
              action: () => {this.demissNotif()},
              
            },]}
            onClose={() => this.setPopout(null)}
            header="Внимание!"
            text="Включая уведомления, Вы соглашаетесь что они могут приходить вам неограниченное кол-во раз, 
            в неогранниченный промежуток времени (по возможности и в соответствии с вашими действиями в приложении), но для этого нам нужен доступ к ним. 
            Если вы не согласны с данным условием, то не включайте их.
            Вы всегда можете их отключить. 
            Хотите получать уведомления?"
          />)
      }else{
        bridge.send("VKWebAppDenyNotifications")
        .then(data => {
          this.demissNotif()
          setTimeout(() => {
            this.props.this.ReloadProfile()
          }, 1000)
        }).catch(() => {
          this.approveNotif();
        })
        
      }
    }
    publicProfile(showAlert=true){
      if(showAlert){
        this.setPopout(
        <Alert
        actionsLayout="horizontal"
        actions={[{
          title: 'Отмена',
          autoclose: true,
          mode: 'cancel'
        },{
          title: 'Хочу',
          autoclose: true,
          action: () => this.publicProfile(false),
          mode: 'destructive',
        }]}
        onClose={() => this.setPopout(null)}
        header="Вы действительно хотите открыть свой профиль"
        text="После публикации профиля, все смогут видеть вашу настоящую страницу ВК. Вы действительно хотите опубликовать его?"
        />)
      }else{
        fetch(this.state.api_url + "method=settings.set&" + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          body: JSON.stringify({
              'setting': 'public',
              'value': Number(!this.state.public),
          })
          })
          .then(res => res.json())
          .then(data => {
          if(data.result) {
            this.setState({public: !this.state.public})
            setTimeout(() => {
              this.props.this.ReloadProfile()
            }, 1000)
          }else{
            this.showErrorAlert(data.error.message)
          }
        }).catch(() => {
          this.props.this.changeData('activeStory', 'disconnect')
        })
      }
    }
    componentDidMount(){
      bridge.send('VKWebAppGetAds')
    .then((promoBannerProps) => {
        this.setState({ promoBannerProps });
    })
    }
    render() {
        var props = this.props.this;
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderBack onClick={() => window.history.back()} /> 
                }>
                    Настройки
                </PanelHeader>
                <Group>
                  <SimpleCell
                  disabled
                  indicator={this.props.account.age}
                  before={<Icon28TargetOutline/>}>Ваш возраст</SimpleCell>
                  
                </Group>
                <Group>
                  <SimpleCell
                  before={<Icon28PaletteOutline />}
                  expandable
                  onClick={() => props.goPanel('schemechange')}>Смена темы</SimpleCell>

                  <SimpleCell
                  indicator={this.props.account['verified'] ? 'Присвоен' : null}
                  disabled={this.props.account['verified']}
                  expandable={!this.props.account['verified']}
                  onClick={!this.props.account['verified'] ? () => props.goPanel('verf') : () => this.nofinc()}
                  before={<Icon28DoneOutline />}>Верификация</SimpleCell>

                  <SimpleCell
                    before={<Icon28Notifications />}
                    disabled 
                    after={
                    <Switch 
                      checked={this.state.noti}
                      onChange={(e) => this.changeNotifStatus(e)} />
                    }>Получать уведомления</SimpleCell>

                  <SimpleCell
                  before={<Icon28GestureOutline/>}
                  disabled 
                  after={
                    <Switch 
                      checked={this.state.public}
                      onChange={() => this.publicProfile(this.state.public === false)} />
                    }
                    >
                    Публичный профиль
                  </SimpleCell>
                </Group>
                <Group>
                  <SimpleCell
                  disabled
                  indicator={<Counter>{this.props.account.balance}</Counter>}
                  before={<Icon28CoinsOutline />}>Баланс</SimpleCell>
                  
                  {(platform() === IOS && platformname) ? null :
                  <SimpleCell
                  expandable
                  href="https://vk.com/jedi_road?source=description&w=donut_payment-188280516"
                  target="_blank" rel="noopener noreferrer"
                  before={<Icon28FavoriteOutline/>}>VK Donut</SimpleCell>}
                </Group>
                <Group>
                  
                  <SimpleCell
                  expandable
                  onClick={() => {
                      this.props.this.goPanel("info");
                  }}
                  before={<Icon28InfoOutline />}>О приложении</SimpleCell>
                </Group>
                
                { this.state.promoBannerProps && this.state.ShowBanner && 
                <FixedLayout vertical='bottom'>
                  <PromoBanner onClose={() => {this.setState({ShowBanner: false})}} bannerData={ this.state.promoBannerProps } />
                </FixedLayout> }
                {this.props.this.state.snackbar}
            </Panel>
        )
    }
}
// this.props.this.setSnack(
//   <Snackbar
//   layout="vertical"
//   onClose={() => this.props.this.setSnack(null)}
//   before={<Icon20CancelCircleFillRed width={24} height={24} />}
// >
//   Данный раздел ещё не готов для просмотра. Он стесняется :)
// </Snackbar>)