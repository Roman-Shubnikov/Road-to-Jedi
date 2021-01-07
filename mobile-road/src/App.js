import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import music from './music/Soloriver.mp3';

import { 
  Alert,
  Avatar,
  ScreenSpinner,
  Snackbar,
  Tabbar,
  TabbarItem,
  Epic,
  ConfigProvider,
  AdaptivityProvider,
  AppRoot,
  withAdaptivity,
  withPlatform,
  VKCOM,
  ViewWidth,
  SplitLayout,
  SplitCol,
  Panel,
  PanelHeader,
  Group,
  Root,
  Platform,
  ViewHeight,

  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './styles/style.css'
// Импортируем панели
import Questions      from './panels/questions/main';
import Advice         from './panels/Advice/main';
import Top            from './panels/topUsers/main';
import Notification   from './panels/notify/main';
import Profile        from './panels/Profile/main';
import Start          from './panels/Start/main';
import Banned         from './panels/Banned/main';
import LoadingScreen  from './panels/Loading/main';
import Unsupport      from './panels/Unsupport/main';
import Disconnect     from './panels/Disconnect/main';
import Moderation     from './panels/Moderation/main';

import {
  Icon28CompassOutline,
  Icon28WorkOutline,
  Icon28FavoriteOutline,
  Icon28ArticleOutline,
  Icon16CheckCircle,
  Icon28Profile,

} from '@vkontakte/icons'

import EpicItemPC from './components/EpicItem';


const queryString = require('query-string');
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
const hash = queryString.parse(window.location.hash);

const blueBackground = {
  backgroundColor: 'var(--accent)'
};
function isEmpty(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}
var DESKTOP_SIZE = 1000;
var TABLET_SIZE = 900;
var SMALL_TABLET_SIZE = 768;
var MOBILE_SIZE = 320;
var MOBILE_LANDSCAPE_HEIGHT = 414;
var MEDIUM_HEIGHT = 720;
var ignore_promo = false;


function calculateAdaptivity(windowWidth, windowHeight) {
  var viewWidth = ViewWidth.SMALL_MOBILE;
  var viewHeight = ViewHeight.SMALL;

  if (windowWidth >= DESKTOP_SIZE) {
    viewWidth = ViewWidth.DESKTOP;
  } else if (windowWidth >= TABLET_SIZE) {
    viewWidth = ViewWidth.TABLET;
  } else if (windowWidth >= SMALL_TABLET_SIZE) {
    viewWidth = ViewWidth.SMALL_TABLET;
  } else if (windowWidth >= MOBILE_SIZE) {
    viewWidth = ViewWidth.MOBILE;
  } else {
    viewWidth = ViewWidth.SMALL_MOBILE;
  }

  if (windowHeight >= MEDIUM_HEIGHT) {
    viewHeight = ViewHeight.MEDIUM;
  } else if (windowHeight > MOBILE_LANDSCAPE_HEIGHT) {
    viewHeight = ViewHeight.SMALL;
  } else {
    viewHeight = ViewHeight.EXTRA_SMALL;
  }
  return {
    viewWidth: viewWidth,
    viewHeight: viewHeight,
  };
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account:[],
            activeStory: 'loading',
            scheme: "bright_light",
            default_scheme: "bright_light",
            api_url: "https://xelene.ru/road/php/index.php?",
            popout: <ScreenSpinner/>,
            snackbar: null,
            switchKeys: false,
            need_epic: true,
            first_start: false,
            LoadWebView: false,
            BanObject: null,

        };
        this.componentDidMount = this.componentDidMount.bind(this);
        this.changeData = (name,value) => {
          this.setState({ [name]: value });
        }
        this.LoadProfile = () => {
          fetch(this.state.api_url + "method=account.get&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
          if(data.result) {
              this.setState({account: data.response,popout: null, switchKeys: data.response.noti})
              if(this.state.activeStory === 'disconnect'){
                this.setState({activeStory: 'questions', LoadWebView: true})
              }
              if(!isEmpty(this.state.account)){
                if(Number(this.state.account.scheme) === 0){
                  this.setState({scheme: this.state.default_scheme})
                  if(this.state.default_scheme === 'bright_light'){
                    if(platformname){
                      bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#FFFFFF",'navigation_bar_color': "#FFFFFF"});
                    }
                  }
                  if(this.state.default_scheme === 'space_gray'){
                    if(platformname){
                      bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191A",'navigation_bar_color': "#19191A"});
                    }
                  }
                }
                if(Number(this.state.account.scheme) === 1){
                  this.setState({scheme: 'bright_light'})
                  if(platformname){
                    bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#FFFFFF",'navigation_bar_color': "#FFFFFF"});
                  }
                  
                }
                if(Number(this.state.account.scheme) === 2){
                  this.setState({scheme: 'space_gray'})
                  if(platformname){
                    bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191A",'navigation_bar_color': "#19191A"});
                  }
                }
              }else{
                this.setState({scheme: data.scheme})
                if(data.scheme === 'space_gray'){
                  if(platformname){
                    bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191A",'navigation_bar_color': "#19191A"});
                  }
                }else{
                  if(platformname){
                    bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#FFFFFF",'navigation_bar_color': "#FFFFFF"});
                  }
                }
                }
            }})
          .catch(err => {
            this.changeData('activeStory', 'disconnect')
    
          })
        }
        this.setPopout = (value) => {
          this.setState({popout: value})
        }
          this.playAudio = () => {
            if(!this.audio.paused){
              this.audio.pause()
            } else {
              this.audio.volume = 0.1;
              this.audio.currentTime = 0;
              const audioPromise = this.audio.play()
              if (audioPromise !== undefined) {
              audioPromise
                .then(_ => {
                // autoplay started
                
                })
                .catch(err => {
                // catch dom exception
                console.info(err)
                })
              }
            }
            this.setState({paused: this.audio.paused})
          }
    }
    componentDidMount() {
      // if(/Mac|Macintosh|iPhone|iPad|iPod/i.test(navigator.userAgent)){
      //   this.setState({activeStory: 'unsupport', LoadWebView: true});
      //   return
      // }
      this.setState({
          snackbar: null,
          switchKeys: false,
          first_start: false,
          BanObject: null,
      })
      this.audio = new Audio(music)
      this.audio.load()
      this.audio.loop = true;
      bridge.subscribe(({ detail: { type, data }}) => { 
        if(type === 'VKWebAppViewHide') {
          console.log('closing...')
        }
        if(type === 'VKWebAppViewRestore') {
          this.componentDidMount()
        }
			  if (type === 'VKWebAppUpdateConfig') {
          this.setState({default_scheme: data.scheme});
          if(!isEmpty(this.state.account)){
            if(Number(this.state.account.scheme) === 0){
              this.setState({scheme: data.scheme})
            }
            if(Number(this.state.account.scheme) === 1){
              this.setState({scheme: 'bright_light'})
              if(platformname){
                bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#FFFFFF",'navigation_bar_color': "#FFFFFF"});
              }
            }
            if(Number(this.state.account.scheme) === 2){
              this.setState({scheme: 'space_gray'})
              if(platformname){
                bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191A",'navigation_bar_color': "#19191A"});
              }
            }
          }else{
            this.setState({scheme: data.scheme})
            if(data.scheme === 'space_gray'){
              if(platformname){
                bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191A",'navigation_bar_color': "#19191A"});
              }
            }else{
              if(platformname){
                bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#FFFFFF",'navigation_bar_color': "#FFFFFF"});
              }
            }
            }
          }
        })
        fetch(this.state.api_url + "method=account.get&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            // var account_new = data.response;
            this.setState({account: data.response, popout: null, switchKeys: data.response.noti, first_start: data.response.is_first_start})
              if(Number(this.state.account.scheme) === 1){
                this.setState({scheme: 'bright_light'})
                if(platformname){
                  bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "dark", "action_bar_color": "#FFFFFF", 'navigation_bar_color': "#FFFFFF"});
                }
              }
              if(Number(this.state.account.scheme) === 2){
                this.setState({scheme: 'space_gray'})
                if(platformname){
                  bridge.send("VKWebAppSetViewSettings", {"status_bar_style": "light", "action_bar_color": "#19191A",'navigation_bar_color': "#19191A"});
                }
              }
            if(this.state.account.is_first_start){
              this.setState({activeStory: 'start', LoadWebView: true});
            }else{
              if(hash.promo !== undefined && !ignore_promo){
                ignore_promo = true;
                this.setState({activeStory: 'profile', LoadWebView: true, need_epic: true})
              }else if(this.state.activeStory === 'loading' || this.state.activeStory === 'disconnect'){
                this.setState({activeStory: 'questions', LoadWebView: true, need_epic: true})
              }
            }
          } else {
            if(data.error.error_code !== 5){
                this.setPopout(
                  <Alert
                    actions={[{
                      title: 'Повторить',
                      autoclose: true,
                      action: () => this.componentDidMount()
                    }]}
                    onClose={() => {this.setPopout(null);this.componentDidMount()}}
                  >
                    <h2>Ошибка</h2>
                    <p>{data.error.message}</p>
                        </Alert>)
            }else{
              this.setState({BanObject: data.error.error_obj, activeStory: 'banned', LoadWebView: true})
            }
          }
        })
        .catch(err => {
          this.setState({activeStory: 'disconnect', need_epic: false})
          this.showErrorAlert('Ошибка запроса. Пожалуйста, попробуйте позже. Возможно, вы попали на флуд-контроль.')
        })
    }

    showAlert(title, text) {
      this.setState({
        popout: 
          <Alert
            actions={[{
              title: 'Закрыть',
              autoclose: true,
              style: 'cancel'
            }]}
            onClose={this.setPopout(null)}
          >
            <h2>{title}</h2>
            <p>{text}</p>
        </Alert>
      })
    }


    deleteStats() {
      this.setState({popout: <ScreenSpinner/>})
      fetch(this.state.api_url + "method=delete.stats&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if(data.response) {
          this.setState({snackbar: 
            <Snackbar
              layout="vertical"
              onClose={() => this.setState({ snackbar: null })}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              Статистика профиля сброшена
            </Snackbar>, popout: null
          })
          this.LoadProfile()
          window.history.back()
        } else {
          this.showAlert('Ошибка', data.error_text);
        }
      })
      .catch(err => {
        this.showErrorAlert()
      })
    }
    showErrorAlert(error = null, action = null) {
      this.setPopout(
        <Alert
          actionsLayout="horizontal"
          actions={[{
            title: 'Отмена',
            autoclose: true,
            mode: 'cancel',
            action: action,
          }]}
          onClose={() => this.setPopout(null)}
          header="Ошибка"
          text={error ? `${error}` : "Что-то пошло не так, попробуйте снова!"}
        />
      )
    }

    
    render() {
      const platformwithPlat = this.props.platform;
      var platform = null
      if(platformname){
        platform = platformwithPlat;
      }else{
        platform = Platform.VKCOM;
      }
      const { viewWidth } = this.props;
      const isDesktop = viewWidth >= ViewWidth.SMALL_TABLET;
      const hasHeader = platform !== VKCOM;
        return (
        <>
        {/* {!this.state.LoadWebView ? <div style={{width: '100vw', height: '100vh', backgroundColor: 'var(--background_page_my)', zIndex: 20, position: 'absolute', textAlign:'center'}}>
            <h1 style={{margin: '50vh 0'}}>Загрузка...</h1>
            </div> : null}
          <webview 
          onLoad={() => {this.setState({LoadWebView: true});document.body.style.overflow = "auto"}}
          > */}

            
              <ConfigProvider scheme={this.state.scheme} 
              platform={platform}
              > 
              <AppRoot>
                <SplitLayout
                header={hasHeader && <PanelHeader separator={false} />}
                style={{ justifyContent: "center" }}>

                  {isDesktop && this.state.need_epic && (<SplitCol fixed width="280px" maxWidth="280px">
                    <Panel>
                      {hasHeader && <PanelHeader/>}
                      <Group>
                        <EpicItemPC
                        icon={<Icon28ArticleOutline />}
                        story="questions"
                        activeStory={this.state.activeStory}
                        changeStory={this.changeData}>
                          Вопросы
                        </EpicItemPC>
                        <EpicItemPC
                        icon={<Icon28CompassOutline />}
                        story="advice"
                        activeStory={this.state.activeStory}
                        changeStory={this.changeData}>
                          Обзор
                        </EpicItemPC>
                        <EpicItemPC
                        icon={<Icon28FavoriteOutline />}
                        story="top"
                        activeStory={this.state.activeStory}
                        changeStory={this.changeData}>
                          Пантеон
                        </EpicItemPC>
                        {this.state.account.special && 
                        <EpicItemPC
                        icon={<Icon28WorkOutline />}
                        story="moderation"
                        activeStory={this.state.activeStory}
                        changeStory={this.changeData}>
                          Модерация
                        </EpicItemPC>}
                        <EpicItemPC
                        icon={<Icon28Profile />}
                        story="profile"
                        activeStory={this.state.activeStory}
                        changeStory={this.changeData}>
                          Профиль
                        </EpicItemPC>
                      </Group>
                      
                    </Panel>
                  </SplitCol>)}

                  <SplitCol
                    animate={!isDesktop}
                    spaced={isDesktop}
                    width={isDesktop ? '560px' : '100%'}
                    maxWidth={isDesktop ? '560px' : '100%'}
                  >
                    {!isDesktop ? <Epic activeStory={this.state.activeStory}
                      tabbar={
                        this.state.need_epic && !isDesktop &&
                        <Tabbar>
                          <TabbarItem
                            onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                            selected={this.state.activeStory === 'questions'}
                            data-story="questions"
                            text='Вопросы'
                          ><Icon28ArticleOutline/></TabbarItem>
                          <TabbarItem
                            onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                            selected={this.state.activeStory === 'advice'}
                            data-story="advice"
                            text='Обзор'
                          ><Icon28CompassOutline/></TabbarItem>
                          <TabbarItem
                            onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                            selected={this.state.activeStory === 'top'}
                            data-story="top"
                            text='Пантеон'
                          ><Icon28FavoriteOutline /></TabbarItem>
                          {this.state.account.special ? <TabbarItem
                            onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                            selected={this.state.activeStory === 'moderation'}
                            data-story="moderation"
                            text='Модерация'
                          ><Icon28WorkOutline /></TabbarItem> : null}
                          <TabbarItem
                            onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                            selected={this.state.activeStory === 'profile' || this.state.activeStory === "notif"}
                            data-story="profile"
                            text='Профиль'
                          ><Icon28Profile /></TabbarItem>
                          
                        </Tabbar>
                      }
                      >
                      <Questions 
                      id='questions'
                      this={this}
                      scheme={this.state.scheme}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      first_start={this.state.first_start}
                      popout={this.state.popout} />

                      <Advice 
                      id="advice"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      popout={this.state.popout} />

                      <Top 
                      id='top'
                      this={this}
                      reloadProfile={this.LoadProfile}
                      scheme={this.state.scheme}
                      account={this.state.account}
                      popout={this.state.popout} />

                      <Notification 
                      id="notif"
                      this={this}
                      scheme={this.state.scheme}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      popout={this.state.popout}
                      />

                      <Profile 
                      id="profile"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      scheme={this.state.scheme}
                      default_scheme={this.state.default_scheme}
                      account={this.state.account}
                      popout={this.state.popout} />

                      <Moderation 
                      id="moderation"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      sizeX={this.props.sizeX}
                      />
                      
                      <Start 
                      id="start"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      scheme={this.state.scheme}
                      account={this.state.account}
                      popout={this.state.popout} />

                      <Banned 
                      id="banned"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      scheme={this.state.scheme}
                      account={this.state.account}
                      BanObject={this.state.BanObject}
                      popout={this.state.popout} />

                      <Unsupport 
                      id="unsupport"
                      this={this}
                      reloadProfile={this.LoadProfile} />

                      <Disconnect
                      id="disconnect"
                      this={this}
                      compdid={this.componentDidMount}
                      popout={this.state.popout}
                      reloadProfile={this.LoadProfile} />
                      <LoadingScreen 
                      id="loading"
                      this={this} />
                    </Epic>
                     : 
                    <Root activeView={this.state.activeStory}>
                      <Questions 
                      id='questions'
                      this={this}
                      scheme={this.state.scheme}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      first_start={this.state.first_start}
                      popout={this.state.popout} />

                      <Advice 
                      id="advice"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      popout={this.state.popout} />

                      <Top 
                      id='top'
                      this={this}
                      scheme={this.state.scheme}
                      account={this.state.account}
                      reloadProfile={this.LoadProfile}
                      popout={this.state.popout} />

                      <Notification 
                      id="notif"
                      this={this}
                      scheme={this.state.scheme}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      popout={this.state.popout}
                      />

                      <Profile 
                      id="profile"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      scheme={this.state.scheme}
                      default_scheme={this.state.default_scheme}
                      account={this.state.account}
                      popout={this.state.popout} />

                      <Moderation 
                      id="moderation"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      account={this.state.account}
                      />
                      
                      <Start 
                      id="start"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      scheme={this.state.scheme}
                      account={this.state.account}
                      popout={this.state.popout} />

                      <Banned 
                      id="banned"
                      this={this}
                      reloadProfile={this.LoadProfile}
                      scheme={this.state.scheme}
                      account={this.state.account}
                      BanObject={this.state.BanObject}
                      popout={this.state.popout} />
                      <Unsupport 
                      id="unsupport"
                      this={this}
                      reloadProfile={this.LoadProfile} />

                      <Disconnect
                      id="disconnect"
                      this={this}
                      compdid={this.componentDidMount}
                      popout={this.state.popout}
                      reloadProfile={this.LoadProfile} />
                      <LoadingScreen 
                      id="loading"
                      this={this} />
                      
                    </Root>
                    
                    }
                  </SplitCol>
                </SplitLayout>
              </AppRoot>
            </ConfigProvider>
            
          {/* </webview> */}
          </>
            
        );



    }
}

const AdaptiveApp = withAdaptivity(withPlatform(App), { viewWidth: true });

export default () => (
  <AdaptivityProvider viewWidth={ calculateAdaptivity( document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
    <AdaptiveApp />
  </AdaptivityProvider>
);

