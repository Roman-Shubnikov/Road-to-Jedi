import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
  Alert,
  View,
  ScreenSpinner,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import '../../style.css'
// Импортируем панели
import Startov from './panels/home';

var ignore_back = false;

export default class Disconnect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          activePanel: 'load',
          api_url: "https://xelene.ru/road/php/index.php?",
          history: ['start'],
        

        }
        this.changeData = this.props.this.changeData;
        this.compdid = this.props.compdid;
        this.ReloadProfile = this.props.reloadProfile;
        this.handlePopstate = (e) => {
          e.preventDefault();
          this.goBack()
        }
        this.onChange = (event) => {
          var name = event.currentTarget.name;
          var value = event.currentTarget.value;
          this.setState({ [name]: value });
      }
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };
        this.goBack = () => {
          if(!ignore_back){
            ignore_back = true;
            const history = this.state.history;
            if(history.length === 1) {
                bridge.send("VKWebAppClose", {"status": "success"});
            } else if (history.length > 1) {
                history.pop()
                if(this.state.activePanel === 'load') {
                  bridge.send('VKWebAppDisableSwipeBack');
                }
                this.setState({activePanel: history[history.length - 1]})
                // if(history[history.length - 1] === 'ticket'){
                //   this.changeData('need_epic', false)
                // } else{
                //   this.changeData('need_epic', true)
                // }
                this.setPopout(<ScreenSpinner />)
                setTimeout(() => {
                  this.setPopout(null)
                }, 500)
            }
            setTimeout(() => {ignore_back = false;}, 500)
            
          }else{
            const history = this.state.history;
            window.history.pushState( { panel: history[history.length - 1] }, history[history.length - 1] );
          }
      }
        this.goPanel = (panel) => {
          let history = this.state.history.slice();
          history.push(panel)
          window.history.pushState( { panel: panel }, panel );
          if(panel === 'load') {
            bridge.send('VKWebAppEnableSwipeBack');
          }
          this.setState({history: history, activePanel: panel})
          // if(panel === 'ticket'){
          //   this.changeData('need_epic', false)
          // } else{
          //   this.changeData('need_epic', true)
          // }
        }
          this.showAlert = (title, text) => {
            this.setState({
              popout: 
                <Alert
                  actions={[{
                    title: 'Закрыть',
                    autoclose: true,
                    mode: 'cancel'
                  }]}
                  onClose={() => this.setPopout(null)}
                >
                  <h2>{title}</h2>
                  <p>{text}</p>
              </Alert>
            })
          }
          this.showErrorAlert = (error=null, action=null) => {
            this.setPopout(
              <Alert
                  actions={[{
                  title: 'Отмена',
                  autoclose: true,
                  mode: 'cancel',
                  action: action,
                  }]}
                  onClose={() => this.setPopout(null)}
              >
                <h2>Ошибка</h2>
                {error ? <p>{error}</p> : <p>Что-то пошло не так, попробуйте снова!</p>}
              </Alert>
          )
        }
    }
    componentDidMount(){
      bridge.send('VKWebAppEnableSwipeBack');
      window.addEventListener('popstate', this.handlePopstate); 
      this.changeData('need_epic', false)
    }
    componentWillUnmount(){
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', this.handlePopstate)
    }
    render() {
        return(
            <View 
            id={this.props.id}
            activePanel={this.state.activePanel}
            popout={this.props.popout}
            history={this.state.history}
            onSwipeBack={() => window.history.back()}
            >
              <Startov id='load' account={this.props.account} this={this} />
              {/* <Startov2 id='start2' account={this.props.account} this={this} /> */}
            </View>   
        )
    }
}