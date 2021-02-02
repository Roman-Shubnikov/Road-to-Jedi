import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
  Alert,
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,
  Button,


  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
// Импортируем панели
import Questions    from './panels/panelconstruct';
import OtherProfile from '../../components/other_profile';
import Tiket        from '../../components/tiket';
import Reports      from '../../components/report';

//Импортируем модальные карточки
import ModalPrometay  from '../../Modals/Prometay';
import ModalDonut     from '../../Modals/Donut';
import ModalComment   from '../../Modals/Comment';
import ModalVerif     from '../../Modals/Verif';
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
var ignore_back = false;
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
            answers: null,
            answers_helper:null,
            offseta: 0,
            counta:20,
            offsetq: 0,
            countq:20,
            offsetv: 0,
            countv:20,
            verification: null,
            verification_helper:null,
            offsetr: 0,
            countr: 20,
            reports: null,
            reports_helper: null,
            typeres: 1,
            id_rep: 1,

        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        // this.copy = this.props.this.copy;
        // this.recordHistory = (panel) => {
        //   this.setState({history: [...this.state.history, panel]})
        // }
        this.setReport = (typeres, id_rep) => {
          this.setState({typeres, id_rep})
          this.goPanel("report")
        }
        this.changeQuest = (name,value) => {
          this.setState({ [name]: value });
        }
        this.getQuestions = (need_offset=false) => {
          if(!need_offset){
            this.setState({ offsetq: 20})
          }
          let offset = need_offset ? this.state.offsetq : 0;
          fetch(this.state.api_url + "method=special.getNewMessages&" + window.location.search.replace('?', ''),
          {method: 'post',
            headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
            body: JSON.stringify({
              'offset': offset,
              'count': this.state.countq,
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
                  this.setState({ offsetq: this.state.offsetq + 20 })
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
        this.getAnswers = (need_offset=false) => {
          if(!need_offset){
            this.setState({ offseta: 20})
          }
          let offset = need_offset ? this.state.offseta : 0;
          fetch(this.state.api_url + "method=special.getNewModerationTickets&" + window.location.search.replace('?', ''),
          {method: 'post',
            headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
            body: JSON.stringify({
              'offset': offset,
              'count': this.state.counta,
            })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              var sliyan = [];
              if(this.state.answers !== null){
                let tickets = this.state.answers.slice();
                if(!need_offset){
                  sliyan = data.response;
                }else{
                  sliyan = data.response ? tickets.concat(data.response) : this.state.answers;
                }
              }else{
                sliyan = data.response
              }
              
              this.setState({answers: sliyan, answers_helper: data.response})
              if(need_offset){
                  this.setState({ offseta: this.state.offseta + 20 })
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
        this.getVerification = (need_offset=false) => {
          if(!need_offset){
            this.setState({ offsetv: 20})
          }
          let offset = need_offset ? this.state.offsetv : 0;
          fetch(this.state.api_url + "method=admin.getVerificationRequests&" + window.location.search.replace('?', ''),
          {method: 'post',
            headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
            body: JSON.stringify({
              'offset': offset,
              'count': this.state.countv,
            })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              var sliyan = [];
              if(this.state.verification !== null){
                let tickets = this.state.verification.slice();
                if(!need_offset){
                  sliyan = data.response;
                }else{
                  sliyan = data.response ? tickets.concat(data.response) : this.state.verification;
                }
              }else{
                sliyan = data.response
              }
              
              this.setState({verification: sliyan, verification_helper: data.response})
              if(need_offset){
                  this.setState({ offsetv: this.state.offsetv + 20 })
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
        this.getReports = (need_offset=false) => {
          if(!need_offset){
            this.setState({ offsetr: 20})
          }
          let offset = need_offset ? this.state.offsetr : 0;
          fetch(this.state.api_url + "method=reports.getReports&" + window.location.search.replace('?', ''),
          {method: 'post',
            headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
            body: JSON.stringify({
              'offset': offset,
              'count': this.state.countr,
            })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              var sliyan = [];
              if(this.state.reports !== null){
                let tickets = this.state.reports.slice();
                if(!need_offset){
                  sliyan = data.response;
                }else{
                  sliyan = data.response ? tickets.concat(data.response) : this.state.reports;
                }
              }else{
                sliyan = data.response
              }
              
              this.setState({reports: sliyan, reports_helper: data.response})
              if(need_offset){
                  this.setState({ offsetr: this.state.offsetr + 20 })
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
          if (!ignore_back) {
            ignore_back = true;
            const history = this.state.history;
            if (history.length === 1) {
              bridge.send("VKWebAppClose", { "status": "success" });
            } else if (history.length > 1) {
              history.pop()
              this.setActiveModal(null);
              if (this.state.activePanel === 'profile') {
                bridge.send('VKWebAppDisableSwipeBack');
              }
              this.setState({ activePanel: history[history.length - 1] })
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
            setTimeout(() => { ignore_back = false; }, 500)
    
          } else {
            const history = this.state.history;
            window.history.pushState({ panel: history[history.length - 1] }, history[history.length - 1]);
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
    }

    
    
    componentDidMount(){
      bridge.send('VKWebAppEnableSwipeBack');
      window.addEventListener('popstate', this.handlePopstate); 
      this.getQuestions()
      this.getAnswers()
      if(this.props.account['special2']){
        this.getVerification()
        this.getReports()
      }
      
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

              <ModalCard 
              id='answers'
              onClose={() => this.setActiveModal(null)}
              icon={<Icon28SortOutline width={56} height={56} />}
              header={'Вы оценили ' + this.props.account['marked'] + " " + enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов'])}
              subheader={(150 - this.props.account['marked'] < 0) ? "Порог достигнут" : "Для преодоления порога необходимо оценить ещё " + 
              (150 - this.props.account['marked']) + 
              " " + enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов']) + " за неделю"}
              actions={<Button mode='primary' stretched size='l' onClick={() => this.setActiveModal(null)}>Понятно</Button>}>
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
              <Questions id="questions" 
              this={this} 
              account={this.props.account} 
              questions={this.state.questions} 
              questions_helper={this.state.questions_helper} 
              answers={this.state.answers} 
              answers_helper={this.state.answers_helper}
              verification={this.state.verification}
              verification_helper={this.state.verification_helper}
              reports={this.state.reports}
              reports_helper={this.state.reports_helper} />

              <OtherProfile id="other_profile" 
              this={this} 
              agent_id={this.state.active_other_profile} 
              account={this.props.account}/>

              <Tiket id="ticket"
              this={this} 
              ticket_id={this.state.ticket_id} 
              account={this.props.account} />

              <Reports id="report" 
              this={this} 
              id_rep={this.state.id_rep} 
              typeres={this.state.typeres} />

            </View>   
        )
    }
}