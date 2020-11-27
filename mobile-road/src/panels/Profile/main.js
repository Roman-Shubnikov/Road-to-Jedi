import React from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import vkQr from '@vkontakte/vk-qr';
// import {svg2png} from 'svg-png-converter'



import { 
  Alert,
  Avatar,
  Header,
  Cell,
  View,
  ScreenSpinner,
  ModalRoot,
  ModalCard,
  ModalPage,
  ModalPageHeader,
  PanelHeaderButton,
  Input,
  List,
  Snackbar,
  ANDROID,
  IOS,
  withPlatform,
  FormLayout,
  Button,
  Div,
  } from '@vkontakte/vkui';

import '@vkontakte/vkui/dist/vkui.css';
import '../../style.css';
// Импортируем панели
import Prof from './panels/profile';
import Market from './panels/market';
import Achievements from './panels/achives';
import MYQuest from './panels/AllQuestions';
import Settings from './panels/settings';
import SchemeChange from './panels/schemechange';
import Info from './panels/info'
import Verfy from './panels/verfy'
import Tiket from '../../components/tiket';
import OtherProfile from '../../components/other_profile'

//Импортируем модальные карточки
import ModalPrometay from '../../Modals/Prometay';
import ModalDonut from '../../Modals/Donut'
import ModalComment from '../../Modals/Comment';
import ModalBan from '../../Modals/Ban';

import Icon24Dismiss              from '@vkontakte/icons/dist/24/dismiss';
import Icon24Qr                   from '@vkontakte/icons/dist/24/qr';
// import Icon28MessagesOutline      from '@vkontakte/icons/dist/28/messages_outline';
import Icon24Linked               from '@vkontakte/icons/dist/24/linked';
import Icon56MoneyTransferOutline from '@vkontakte/icons/dist/56/money_transfer_outline'
import Icon16CheckCircle          from '@vkontakte/icons/dist/16/check_circle';
import Icon28SortOutline          from '@vkontakte/icons/dist/28/sort_outline';


// const queryString = require('query-string');
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
// var click_qr = false;
// const parsedHash = queryString.parse(window.location.search.replace('?', ''));
// const hash = queryString.parse(window.location.hash);
function enumerate (num, dec) {
  if (num > 100) num = num % 100;
  if (num <= 20 && num >= 10) return dec[2];
  if (num > 20) num = num % 10;
  return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
}


function qr(agent_id, sheme) {
  let hex = "foregroundColor"
  if(sheme === "bright_light") {
    hex = "#000"
  }
  if(sheme === "space_gray") {
    hex = "#fff"
  }
  return (
    vkQr.createQR('https://vk.com/app7409818#agent_id=' + agent_id, {
    qrSize: 120,
    isShowLogo: true,
    foregroundColor: hex,
    className: 'svgqr'
  })
  )
}
const blueBackground = {
  backgroundColor: 'var(--accent)'
};
var ignore_back = false;
export default withPlatform(class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            activePanel: 'profile',
            activeModal: null,
            modalHistory: [],
            popout: null,
            ticket_id: null,
            history: ['profile'],
            active_other_profile: 0,
            other_profile: null,
            ban_reason: "",
            comment: '',
            transfer: {
              'avatar': '',
              'comment': ''
            },
            moneys: null,
            money_transfer_send: '',
            money_transfer_count: '',
            money_transfer_comment: '',
            AgeUser: 0,
            snackbar: null,
            myQuestions:[],
        }
        this.changeData = this.props.this.changeData;
        this.playAudio = this.props.this.playAudio;
        this.ReloadProfile = this.props.reloadProfile;
        this.setPopout = (value) => {
          this.setState({popout: value})
          if(value && value.type.name === 'ScreenSpinner'){
            ignore_back = true;
          }else{
            ignore_back = false;
          }
        }
        this.myQuestions = () => {
          fetch(this.state.api_url + "method=tickets.getByModeratorAnswers&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.setState({myQuestions: data.response})
                setTimeout(() => {
                    this.setState({fetching: false});
                    this.setPopout(null);
                }, 500)
                
              }else{
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
              this.changeData('activeStory', 'disconnect')
    
            })
        }
        this.handlePopstate = (e) => {
          e.preventDefault();
          this.goBack()
        }
        this.setSnack = (value) => {
          this.setState({snackbar: value})
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
          if(!ignore_back){
            ignore_back = true;
            const history = this.state.history;
            if(history.length === 1) {
                bridge.send("VKWebAppClose", {"status": "success"});
            } else if (history.length > 1) {
                history.pop()
                this.setActiveModal(null);
                if(this.state.activePanel === 'profile') {
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
          if(panel === 'profile') {
            bridge.send('VKWebAppEnableSwipeBack');
          }
          this.setState({history: history, activePanel: panel, snackbar: null})
          // if(panel === 'ticket'){
          //   this.changeData('need_epic', false)
          // } else{
          //   this.changeData('need_epic', true)
          // }
        }
        this.setActiveModal = (activeModal) => {
          ignore_back = true
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
            setTimeout(() => {
              ignore_back = false
            }, 500)
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

    sendMoney() {
      this.setPopout(<ScreenSpinner />)
      fetch(this.state.api_url + 'method=transfers.send&' + window.location.search.replace('?', ''),
      {method: 'post',
      headers: {"Content-type": "application/json; charset=UTF-8"},
          // signal: controllertime.signal,
      body: JSON.stringify({
        'summa': this.state.money_transfer_count,
        'send_to': this.state.money_transfer_send,
        'comment': this.state.money_transfer_comment,
    })
      })
      .then(data => data.json())
      .then(data => {
        if(data.result) {
          setTimeout(() => {
            this.ReloadProfile();
            this.setPopout(null)
            this.setState({moneys: data.response, money_transfer_comment: '', money_transfer_count: '', money_transfer_send: ''})
            this.setActiveModal("moneys")
          }, 4000)
          
        } else {
          this.showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        this.changeData('activeStory', 'disconnect')
      })
    }
    validateInputs(title){
      if(title.length > 0){
        let valid = ['error', 'Заполните это поле' ];
          if(/^[a-zA-ZА-Яа-я0-9_ .,"'!?\-=+]*$/ui.test(title)){
            valid = ['valid', '']
          }else{
            valid = ['error', 'Поле не должно содержать спец. символы'];
          }
  
        return valid
      }
      return ['default', '']
      
    }
    // async GenerateFileQr(Qr){
    //   // if(click_qr){
    //   //   return
    //   // }
    //   // let outputBuffer = await svg2png({ 
    //   //   input: Qr, 
    //   //   encoding: 'buffer', 
    //   //   format: 'png',
    //   // })
    //   // let hr = new Blob([outputBuffer], {
    //   //   type: 'image/png'
    //   // });
    //   // hr = URL.createObjectURL(hr);
    //   // console.log(hr)
    //   // let el = document.getElementsByClassName('qrdown')[0];
    //   // el.href = hr;
    //   // el.click();
    //   // bridge.send("VKWebAppDownloadFile", {"url": hr, "filename": "test.svg"})
    //   // click_qr = true
    //   // берём любое изображение
      
    //   let img = document.querySelector('svgqr');

    //   // создаём <canvas> того же размера
    //   let canvas = document.createElement('canvas');
    //   canvas.width = 128;
    //   canvas.height = 128;

    //   let context = canvas.getContext('2d');

    //   // копируем изображение в  canvas (метод позволяет вырезать часть изображения)
    //   context.drawImage(img, 0, 0);
    //   // мы можем вращать изображение при помощи context.rotate() и делать множество других преобразований

    //   // toBlob является асинхронной операцией, для которой callback-функция вызывается при завершении
    //   canvas.toBlob(function(blob) {
    //     // после того, как Blob создан, загружаем его
    //     let link = document.createElement('a');
    //     link.download = 'example.png';

    //     link.href = URL.createObjectURL(blob);
    //     link.click();

    //     // удаляем внутреннюю ссылку на Blob, что позволит браузеру очистить память
    //     URL.revokeObjectURL(link.href);
    //   }, 'image/png');
    // }
    componentDidMount(){

      bridge.send('VKWebAppEnableSwipeBack');
      window.addEventListener('popstate', this.handlePopstate); 
      this.myQuestions();
    }
    componentWillUnmount(){
      bridge.send('VKWebAppDisableSwipeBack');
      window.removeEventListener('popstate', this.handlePopstate)
    }
    render() {
      // var QR = new Blob([qr(this.props.account['id'], this.props.this.state.scheme)], {
      //   type: 'image/png'
      // });
      // var hrefqr = URL.createObjectURL(QR);
      const { platform } = this.props;
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
              <ModalCard 
              id='answers'
              onClose={() => this.setActiveModal(null)}
              icon={<Icon28SortOutline width={56} height={56} />}
              header={'Вы оценили ' + this.props.account['marked'] + " " + enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов'])}
              caption={"Для преодоления порога необходимо оценить ещё " + (1000 - this.props.account['marked']) + " " + enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов']) + " за неделю"}
              actions={[{
                title: 'Понятно',
                mode: 'primary',
                action: () => this.setActiveModal(null)
              }
              ]}>
              </ModalCard>

              <ModalBan 
              id='ban_user'
              onClose={() => this.setActiveModal(null)}
              other_profile={this.state.other_profile}
              this={this}
              />

              <ModalCard
                id='send'
                onClose={() => this.setActiveModal(null)}
                icon={<Icon56MoneyTransferOutline />}
                header="Отправляйте монетки друзьям"
              >
                <FormLayout>
                  <Input maxLength="15" 
                  onChange={(e) => this.onChange(e)} 
                  placeholder="Введите id или ник агента" 
                  name="money_transfer_send" 
                  value={this.state.money_transfer_send} 
                  status={this.validateInputs(this.state.money_transfer_send)[0]}
                  bottom={this.validateInputs(this.state.money_transfer_send)[1]} />
                  <Input maxLength="5" 
                  type='number' 
                  name="money_transfer_count" 
                  onChange={(e) => this.onChange(e)} 
                  placeholder="Введите кол-во монеток" 
                  value={this.state.money_transfer_count} />
                  <Input 
                  maxLength="100" 
                  name="money_transfer_comment" 
                  onChange={(e) => this.onChange(e)} 
                  placeholder="Введите комментарий к переводу" 
                  value={this.state.money_transfer_comment}
                  status={this.validateInputs(this.state.money_transfer_comment)[0]}
                  bottom={this.validateInputs(this.state.money_transfer_comment)[1]} />
                </FormLayout>
                
                <Div>
                  <Button 
                  disabled={
                    !this.state.money_transfer_send || !this.state.money_transfer_count
                  }
                  size='xl'
                  stretched
                  mode='secondary'
                  onClick={() => {
                    this.setActiveModal(null)
                    this.sendMoney();
                  }}>Отправить</Button>
                </Div>
                
              </ModalCard>
              <ModalCard
                id='moneys'
                onClose={() => this.setActiveModal(null)}
                icon={<Avatar src={this.state.moneys ? this.state.moneys.avatar : null} size={72} />}
                header={this.state.moneys ? "Ваш баланс: " + this.state.moneys.money : null}
                caption={this.state.moneys ? this.state.moneys.text : null}
                actions={[{
                  title: 'Закрыть',
                  mode: 'secondary',
                  action: () => {
                    this.setActiveModal(null);
                    this.setState({moneys: null, money_transfer_count: '', money_transfer_send: ''})
                  }
                }]}
              >
              </ModalCard>
              <ModalCard
                id='transfer'
                onClose={() => this.setActiveModal(null)}
                icon={<Avatar src={this.state.transfer.avatar} size={72} />}
                header='Перевод монеток'
                caption={this.state.transfer.comment}
                actions={[{
                  title: 'Закрыть',
                  mode: 'secondary',
                  action: () => {
                    this.setActiveModal(null);
                  }
                }]}
              >
              </ModalCard>
              <ModalPage
                id="share"
                onClose={this.modalBack}
                header={
                  <ModalPageHeader
                  right={platform === IOS && <Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
                  left={platform === ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
                  >
                    Поделиться
                  </ModalPageHeader>
                }
                >
                  <List>
                    <Cell onClick={() => this.setActiveModal("qr")} before={<Icon24Qr width={28} height={28}/>}>QR-code</Cell>
                    {/* <Cell onClick={() => {bridge.send("VKWebAppShowWallPostBox", {"message": "https://vk.com/app7409818#agent_id=" + this.props.account['id']}); this.setActiveModal(null);}} before={<Icon28MessagesOutline width={28} height={28}/>}>В сообщения</Cell> */}
                    <Cell onClick={() => {bridge.send("VKWebAppCopyText", {text: "https://vk.com/app7409818#agent_id=" + this.props.account['id']}); this.setActiveModal(null);this.setSnack(<Snackbar
                    layout="vertical"
                    onClose={() => this.setSnack(null)}
                    before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                  >
                    Ссылка скопирована
                  </Snackbar>);}} before={<Icon24Linked width={28} height={28}/>}>Скопировать ссылку</Cell>
                  </List>
                </ModalPage>

                <ModalPage
                id="qr"
                onClose={this.modalBack}
                dynamicContentHeight
                header={
                  <ModalPageHeader
                  // right={<Header onClick={this.modalBack}><Icon24Dismiss style={{color: 'var(--placeholder_icon_foreground_primary)'}} /></Header>}
                  right={platform === IOS && <Header onClick={this.modalBack}><Icon24Dismiss /></Header>}
                  left={platform === ANDROID && <PanelHeaderButton onClick={this.modalBack}><Icon24Dismiss /></PanelHeaderButton>}
                  >
                    QR
                  </ModalPageHeader>
                }
                >
                 {<div className="qr" dangerouslySetInnerHTML={{__html: qr(this.props.account['id'], this.props.this.state.scheme)}}/>}
                 <br/>
                 <div className="qr" >Отсканируйте камерой ВКонтакте!</div>
                 <br/>
                 {/* <div className="qr">или</div>
                 <br/>
                 <Div>
                   <Button className='qrdown' onClick={() => {platformname ? 
                    this.GenerateFileQr(QR) : this.GenerateFileQr(QR);console.log('click') }} download='QR.svg'>Скачать svg</Button>
                 </Div> */}
                </ModalPage>
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

              <Prof id="profile" this={this} account={this.props.account} />
              <MYQuest id="qu" this={this} account={this.props.account} myQuestions={this.state.myQuestions} /> 
              <Market id="market" this={this} account={this.props.account} />
              <Achievements id="achievements" this={this} account={this.props.account} />
              <Settings id="settings" this={this} account={this.props.account} popout={this.state.popout} />
              <SchemeChange id="schemechange" this={this} default_scheme={this.props.default_scheme} account={this.props.account} />
              <Info id='info' this={this} />
              <Verfy id='verf' this={this} account={this.props.account} />
              <Tiket id="ticket" this={this} ticket_id={this.state.ticket_id} account={this.props.account} />
              <OtherProfile id="other_profile" this={this} agent_id={this.state.active_other_profile} account={this.props.account}/>
            </View>   
        )
    }
}
)