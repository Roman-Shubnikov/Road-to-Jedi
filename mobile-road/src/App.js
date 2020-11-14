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
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import './style.css'
// Импортируем панели
import Questions from './panels/questions/main'
import Top from './panels/topUsers/main'
import Notification from './panels/notify/main'
import Profile from './panels/Profile/main'
import Start from './panels/Start/main'

import Icon28Profile from '@vkontakte/icons/dist/28/profile';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon28ArticleOutline from '@vkontakte/icons/dist/28/article_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';

// const queryString = require('query-string');
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
// const hash = queryString.parse(window.location.hash);


const blueBackground = {
  backgroundColor: 'var(--accent)'
};
function isEmpty(obj) {
  for (let key in obj) {
    // если тело цикла начнет выполняться - значит в объекте есть свойства
    return false;
  }
  return true;
}
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            account:[],
            activeStory: 'questions',
            scheme: "bright_light",
            default_scheme: "bright_light",
            api_url: "https://xelene.ru/road/php/index.php?",
            popout: <ScreenSpinner/>,
            snackbar: null,
            switchKeys: false,
            need_epic: true,
            first_start: false

        };
        this.changeData = (name,value) => {
          this.setState({ [name]: value });
        }
        this.LoadProfile = () => {
          fetch(this.state.api_url + "method=account.get&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
          if(data.result) {
              this.setState({account: data.response,popout: null, switchKeys: data.response.noti})
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
            this.showErrorAlert(err)
    
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
      this.audio = new Audio(music)
      this.audio.load()
      this.audio.loop = true;
      bridge.subscribe(({ detail: { type, data }}) => { 
        if(type === 'VKWebAppAllowMessagesFromGroupResult') {
          fetch(this.state.api_url + "method=notifications.swift&swift=on&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data) {
                this.setState({switchKeys: true})
              }
            })
            .catch(err => {
              this.showErrorAlert()
            })
        }
        if(type === 'VKWebAppAllowMessagesFromGroupFailed') {
          fetch(this.state.api_url + "method=notifications.swift&swift=off&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data) {
                this.setState({switchKeys: false})
              }
            })
            .catch(err => {
              this.showErrorAlert()
            })
        }
        if(type === 'VKWebAppViewHide') {
          console.log('closing...')
        }
			  if (type === 'VKWebAppUpdateConfig') {
          // console.log(data)
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
              this.setState({activeStory: 'start'});
            }
          } else {
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
          }
        })
        .catch(err => {
          this.showErrorAlert(err)
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
    showErrorAlert(error=null){
      this.setPopout(
        <Alert
            actions={[{
            title: 'Отмена',
            autoclose: true,
            mode: 'cancel'
            }]}
            onClose={() => this.setPopout(null)}
        >
          <h2>Ошибка</h2>
          {error ? <p>{error}</p> : <p>Что-то пошло не так, попробуйте снова!</p>}
        </Alert>
    )
  }

    
    render() {
        return(
            <ConfigProvider isWebView={platformname} scheme={this.state.scheme}> 
              <Epic activeStory={this.state.activeStory}
              tabbar={
                  this.state.need_epic &&
                  <Tabbar>
                    <TabbarItem
                      onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                      selected={this.state.activeStory === 'questions'}
                      data-story="questions"
                      text='Вопросы'
                    ><Icon28ArticleOutline/></TabbarItem>
                    <TabbarItem
                      onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                      selected={this.state.activeStory === 'top'}
                      data-story="top"
                      text='Топ'
                    ><Icon28FavoriteOutline /></TabbarItem>
                    <TabbarItem
                      onClick={(e) => {this.setState({activeStory: e.currentTarget.dataset.story})}} 
                      selected={this.state.activeStory === 'profile'}
                      data-story="profile"
                      text='Профиль'
                    ><Icon28Profile /></TabbarItem>
                  </Tabbar>
                }>
                <Questions 
                id='questions'
                this={this}
                scheme={this.state.scheme}
                reloadProfile={this.LoadProfile}
                account={this.state.account}
                first_start={this.state.first_start}
                popout={this.state.popout} />

                <Top 
                id='top'
                this={this}
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
                
                <Start 
                id="start"
                this={this}
                reloadProfile={this.LoadProfile}
                scheme={this.state.scheme}
                account={this.state.account}
                popout={this.state.popout} />
              </Epic>
            </ConfigProvider>
        );
    }
}

export default App;