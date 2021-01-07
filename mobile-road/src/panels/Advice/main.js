import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  Alert,
  View,
  ScreenSpinner,
  ModalRoot,
  } from '@vkontakte/vkui';

// Импортируем панели
import Advice         from './panels/adv';
import Donuts         from './panels/donuts';
import Premium        from './panels/premium';
import NewTicket      from './panels/new_tiket';
import OtherProfile   from '../../components/other_profile';
import Reports        from '../../components/report';

//Импортируем модальные карточки
import ModalPrometay  from '../../Modals/Prometay';
import ModalDonut     from '../../Modals/Donut'
import ModalBan       from '../../Modals/Ban';
import ModalVerif     from '../../Modals/Verif'


var ignore_back = false;


export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'advice',
            activeModal: null,
            modalHistory: [],
            popout: this.props.popout,
            history: ['advice'],
            active_other_profile: 0,
            other_profile: null,
            snackbar: null,
            id_rep: 1,
            typeres: 1,
            recomndations: null,

        }
        this.changeData = this.props.this.changeData;
        this.ReloadProfile = this.props.reloadProfile;
        this.setReport = (typeres, id_rep) => {
          this.setState({typeres, id_rep})
          this.goPanel("report")
        }
      
        this.setPopout = (value) => {
          this.setState({popout: value})
          if(value && value.type.name === 'ScreenSpinner'){
            ignore_back = true;
          }else{
            ignore_back = false;
          }
        }
        this.handlePopstate = (e) => {
          e.preventDefault();
          this.goBack()
        }
        this.goTiket = (id) => {
          this.setPopout(<ScreenSpinner/>)
          this.setState({ticket_id: id})
          this.goPanel('ticket');
          this.setPopout(null);
        }
        this.onChange = (event) => {
          var name = event.currentTarget.name;
          var value = event.currentTarget.value;
          this.setState({ [name]: value });
      }
        this.goOtherProfile = (id) => {
          this.setState({active_other_profile: id})
          this.goPanel("other_profile")
        }
        this.modalBack = () => {
            this.setActiveModal(this.state.modalHistory[this.state.modalHistory.length - 2]);
        };
        this.goBack = () => {
          // this.setPopout(<ScreenSpinner />)
          if(!ignore_back){
            ignore_back = true;
            const history = this.state.history;
            this.setActiveModal(null);
            if(history.length === 1) {
                bridge.send("VKWebAppClose", {"status": "success"});
            } else if (history.length > 1) {
                history.pop()
                if(this.state.activePanel === 'questions') {
                  bridge.send('VKWebAppDisableSwipeBack');
                }
                this.setState({activePanel: history[history.length - 1]})
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
          if(panel === 'questions') {
            bridge.send('VKWebAppEnableSwipeBack');
          }
          this.setState({history: history, activePanel: panel})
        }
        this.setActiveModal = (activeModal) => {
            activeModal = activeModal || null;
            let modalHistory = this.state.modalHistory ? [...this.state.modalHistory] : [];
        
            if (activeModal === null) {
              modalHistory = [];
            } else if (modalHistory.indexOf(activeModal) !== -1) {
              modalHistory = modalHistory.splice(0, modalHistory.indexOf(activeModal) + 1);
            } else {
              modalHistory.push(activeModal);
            }
        
            this.setState({
              activeModal: activeModal,
              modalHistory: modalHistory
            });
          };
          this.showAlert = (title, text) => {
            this.setState({
              popout:
                <Alert
                actionsLayout="horizontal"
                  actions={[{
                    title: 'Закрыть',
                    autoclose: true,
                    mode: 'cancel'
                  }]}
                  onClose={() => this.setPopout(null)}
                  header={title}
                  text={text}
                />
            })
          }
          this.showErrorAlert = (error = null, action = null) => {
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
        this.getRecomendations = () => {
          fetch(this.state.api_url + "method=recommendations.get&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.setState({recomndations: data.response})
              this.setPopout(null);
            }else{
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.changeData('activeStory', 'disconnect')

          })
        }
    }
    
    componentDidMount(){
      bridge.send('VKWebAppEnableSwipeBack');
      window.addEventListener('popstate', this.handlePopstate);
      this.getRecomendations();
      this.changeData('need_epic', true)
    }
    componentWillUnmount(){
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', this.handlePopstate)
    }
    render() {
        const modal = (
            <ModalRoot
            activeModal={this.state.activeModal}
            >
              <ModalPrometay
              id='prom'
              onClose={() => this.setActiveModal(null)}
              action={() => this.setActiveModal(null)} />

              <ModalDonut
              id='donut'
              onClose={() => this.setActiveModal(null)}
              action={() => this.setActiveModal(null)} />

              <ModalVerif
              id='verif'
              onClose={() => this.setActiveModal(null)}
              action={() => this.setActiveModal(null)} />

              <ModalBan 
              id='ban_user'
              onClose={() => this.setActiveModal(null)}
              other_profile={this.state.other_profile}
              this={this}
              />
            </ModalRoot>
        )
        return(
            <View 
            id={this.props.id}
            activePanel={this.state.activePanel}
            modal={modal}
            history={this.state.history}
            onSwipeBack={() => window.history.back()}
            popout={this.state.popout}
            >
              <Advice id="advice" 
              this={this}
              recomndations={this.state.recomndations}
              account={this.props.account}
               />
              <Premium id="premium" 
              account={this.props.account}
              this={this} />

              <Donuts id="donuts" 
              account={this.props.account} />

              <NewTicket id='new_ticket'
                this={this}
                account={this.props.account} />

              <OtherProfile id="other_profile" 
              this={this} 
              agent_id={this.state.active_other_profile} 
              account={this.props.account}/>

              <Reports id="report" 
              this={this} 
              id_rep={this.state.id_rep} 
              typeres={this.state.typeres} /> 
            </View>  
        )
    }
}