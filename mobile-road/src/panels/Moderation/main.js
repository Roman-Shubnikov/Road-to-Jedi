import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  Alert,
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,

  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import '../../style.css';
// Импортируем панели
import Questions    from './panels/questions';
import OtherProfile from '../../components/other_profile';
import Tiket        from '../../components/tiket';

//Импортируем модальные карточки
import ModalPrometay  from '../../Modals/Prometay';
import ModalDonut     from '../../Modals/Donut';
import ModalComment   from '../../Modals/Comment';
import ModalBan       from '../../Modals/Ban';


import Icon28SortOutline          from '@vkontakte/icons/dist/28/sort_outline';

// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


// const queryString = require('query-string');
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
// const hash = queryString.parse(window.location.hash);
function enumerate (num, dec) {
  if (num > 100) num = num % 100;
  if (num <= 20 && num >= 10) return dec[2];
  if (num > 20) num = num % 10;
  return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
}
export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'questions',
            activeModal: null,
            modalHistory: [],
            popout: null,
            ticket_id: null,
            history: ['questions'],
            active_other_profile: 0,
            other_profile: null,
            ban_reason: "",
            comment: '',
            questions: null,
            questions_helper:null,
            offset: 0,
            count:20,

        

        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.getQuestions = (need_offset=false) => {
          if(!need_offset){
            this.setState({ offset: 20})
          }
          let offset = need_offset ? this.state.offset : 0;
          fetch(this.state.api_url + "method=special.getNewMessages&" + window.location.search.replace('?', ''),
          {method: 'post',
            headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
            body: JSON.stringify({
              'offset': offset,
              'count': this.state.count,
            })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              var sliyan = [];
              if(this.state.questions !== null){
                let tickets = this.state.questions.slice();
                if(!need_offset){
                  sliyan = data.response;
                }else{
                  sliyan = data.response ? tickets.concat(data.response) : this.state.questions;
                }
              }else{
                sliyan = data.response
              }
              
              this.setState({questions: sliyan, questions_helper: data.response})
              if(need_offset){
                  this.setState({ offset: this.state.offset + 20 })
              }
              this.setPopout(null);
            }else{
              this.showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            this.changeData('activeStory', 'disconnect')

          })
        }
        this.setPopout = (value) => {
          this.setState({popout: value})
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
          const history = this.state.history;
          this.setActiveModal(null);
          if(history.length === 1) {
              bridge.send("VKWebAppClose", {"status": "success"});
          } else if (history.length > 1) {
              history.pop()
              if(this.state.activePanel === 'top') {
                bridge.send('VKWebAppDisableSwipeBack');
              }
              this.setState({activePanel: history[history.length - 1]})
              // if(history[history.length - 1] === 'ticket'){
              //   this.changeData('need_epic', false)
              // } else{
              //   this.changeData('need_epic', true)
              // }
          }
      }
        this.goPanel = (panel) => {
          let history = this.state.history.slice();
          history.push(panel)
          window.history.pushState( { panel: panel }, panel );
          if(panel === 'top') {
            bridge.send('VKWebAppEnableSwipeBack');
          }
          this.setState({history: history, activePanel: panel})
          // if(panel === 'ticket'){
          //   this.changeData('need_epic', false)
          // } else{
          //   this.changeData('need_epic', true)
          // }
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
      this.getQuestions()
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

              <ModalBan 
              id='ban_user'
              onClose={() => this.setActiveModal(null)}
              other_profile={this.state.other_profile}
              this={this}
              />

              <ModalCard 
              id='answers'
              onClose={() => this.setActiveModal(null)}
              icon={<Icon28SortOutline width={56} height={56} />}
              header={'Вы оценили ' + this.props.account['marked'] + " " + enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов'])}
              caption={(150 - this.props.account['marked'] < 0) ? "Порог достигнут" : "Для преодоления порога необходимо оценить ещё " + 
              (150 - this.props.account['marked']) + 
              " " + enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов']) + " за неделю"}
              actions={[{
                title: 'Понятно',
                mode: 'primary',
                action: () => this.setActiveModal(null)
              }
              ]}>
              </ModalCard>
              <ModalComment
                  id='comment'
                  onClose={this.modalBack}
                  comment={this.state.comment} />
            </ModalRoot>
        )
        return(
            <View 
            id={this.props.id}
            activePanel={this.state.activePanel}
            modal={modal}
            popout={this.state.popout}
            history={this.state.history}
            onSwipeBack={() => window.history.back()}
            >
              <Questions id="questions" this={this} account={this.props.account} questions={this.state.questions} questions_helper={this.state.questions_helper} />
              <OtherProfile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
              <Tiket id="ticket" this={this} ticket_id={this.state.ticket_id} account={this.props.account} />
            </View>   
        )
    }
}