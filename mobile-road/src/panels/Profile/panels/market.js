import React from 'react';
import { 
    Panel,
    PanelHeader,
    Input,
    Avatar,
    Button,
    Header,
    Div,
    Snackbar,
    PanelHeaderBack,
    Separator,
    Text,
    SimpleCell,
    PanelHeaderButton
    } from '@vkontakte/vkui';

import Icon24Repeat from '@vkontakte/icons/dist/24/repeat';
import Icon28MoneyCircleOutline from '@vkontakte/icons/dist/28/money_circle_outline';

import Icon28MoneyHistoryBackwardOutline from '@vkontakte/icons/dist/28/money_history_backward_outline';
import Icon16CheckCircle from '@vkontakte/icons/dist/16/check_circle';
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon28InfoCircleOutline from '@vkontakte/icons/dist/28/info_circle_outline';

var avatars = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.png",
    "11.png",
    "12.png",
    "13.png",
    "14.png",
    "15.png",
    "16.png",
    "17.png",
    "18.png",
    "19.png",
    "20.png",
    "21.png",
    "22.png",
    "23.png",
    "24.png",
    "25.png",
    "26.png",
    // "27.png",
    // "28.png",

]

const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default class Market extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            changed_id: '',
            api_url: "https://xelene.ru/road/php/index.php?",
            last_selected: null,

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
    images() {
      var number = Object.keys(avatars).length;
      var object = []
          for (let i = 0; i < number; i++ ) {
              object.push(
                  <img id={i}
                  onClick={(e) => this.selectImage(e)} 
                  style={i === 0 ? {marginLeft: "20px"} : null} 
                  className="changes_avatars" key={i} 
                  src={"https://xelene.ru/road/php/images/avatars/" + avatars[i]}
                  alt={'ava'} />
              )
          }
      
      return(object)
  }
  selectImage(e) {
    let number = e.currentTarget.id;
    if(this.state.last_selected !== null){
      let last_image = document.getElementById(this.state.last_selected)
      last_image.className = "changes_avatars"
    }
    let image = document.getElementById(number);
    
    image.className = "changes_avatars select_avatar"
    this.setState({last_selected: Number(number)});
  }
    changeAvatar(last_selected) {
        fetch(this.state.api_url + "method=shop.changeAvatar&avatar_id=" + last_selected + "&" + window.location.search.replace('?', ''))
        .then(data => data.json())
        .then(data => {
          if(last_selected){
            let last_image = document.getElementById(this.state.last_selected)
            last_image.className = "changes_avatars"
            this.setState({last_selected: null})
          }
          
          
              if(data.result){
                  this.props.this.setSnack( 
                    <Snackbar
                      layout="vertical"
                      onClose={() => this.props.this.setSnack(null)}
                      before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                    >
                      Аватар успешно сменен
                    </Snackbar>
                  )

                  setTimeout(() => {
                    this.props.this.ReloadProfile();
                  }, 4000)
                }else{
                  this.props.this.setSnack(
                    <Snackbar
                    layout="vertical"
                    onClose={() => this.props.this.setSnack(null)}
                    before={<Icon20CancelCircleFillRed width={24} height={24} />}
                  >
                    {data.error.message}
                  </Snackbar>);
                }
            })
            .catch(err => {
                this.showErrorAlert(err)
        })
        
    }
    ChangeId() {
        if(this.state.changed_id){ 
          fetch(this.state.api_url + "method=shop.changeId&change_id=" + this.state.changed_id + "&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
                this.props.this.setSnack(
                <Snackbar
                  layout="vertical"
                  onClose={() => this.props.this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  id Агента успешно сменен
                </Snackbar>
              )
              setTimeout(() => {
                this.props.this.ReloadProfile();
              }, 4000)
            } else {
              this.props.this.setSnack(
                <Snackbar
                layout="vertical"
                onClose={() => this.props.this.setSnack(null)}
                before={<Icon20CancelCircleFillRed width={24} height={24} />}
              >
                {data.error.message}
              </Snackbar>);
            }
          })
          .catch(err => {
            this.showErrorAlert(err)
          })
        } else {
          this.props.this.setSnack(
            <Snackbar
            layout="vertical"
            onClose={() => this.props.this.setSnack(null)}
            before={<Icon20CancelCircleFillRed width={24} height={24} />}
          >
            Вы не указали желаемый id
          </Snackbar>);
        }
      }

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <><PanelHeaderBack onClick={() => window.history.back()} />
                        <PanelHeaderButton 
                        href='https://vk.com/@jedi_road-sistema-nachisleniya-ballov-i-shop'
                        target="_blank" rel="noopener noreferrer">
                          <Icon28InfoCircleOutline />
                        </PanelHeaderButton> </>
                }>
                    Магазин
                </PanelHeader>
                <Div>
                  <Text weight='medium'>Монетки — это универсальная условная единица для приобретения различных товаров в магазине</Text>
                </Div>
                <SimpleCell disabled indicator={this.props.account.balance}>Ваш баланс</SimpleCell>
                <Separator />
                <Header>Сменить аватар</Header>
                <div className="scrollImages">
                    {this.images()}
                </div>
                <Div>
                    <Button onClick={() => {this.changeAvatar(Number(this.state.last_selected) + 1)}} 
                    before={<Icon28MoneyCircleOutline 
                    style={{marginRight: "5px"}}/>} 
                    size="xl" 
                    mode="secondary"
                    disabled={(this.state.last_selected !== null) ? false : true}>Сменить за 1 монетку</Button>
                </Div>
                <Separator />
                <Header>Сменить свой ник</Header>
                <Div>
                    <Input placeholder="Введите желаемый ник (макс. 10 символов)" onChange={(e) => this.onChange(e)} value={this.state.changed_id} maxLength="10" name="changed_id"/>
                    <br/>
                    <Button onClick={() => {this.ChangeId(this.state.changed_id)}} 
                    before={<Icon24Repeat width={28} height={28} style={{marginRight: "5px"}}/>}
                    size="xl" 
                    mode="secondary"
                    disabled={(this.state.changed_id <= 0) ? true : false}>Сменить за 2 монетки</Button>
                </Div>
                {/* <Group separator="hide" header={<Header>Сброс статистики</Header>}>
                    <Div>
                        <Button onClick={() => props.this.deleteStats()} before={<Icon28GridSquareOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Сбросить за 150 монеток</Button>
                    </Div>
                </Group> */}
                <Separator />
                <Header>Опции</Header>
                    <Div>
                        <Button onClick={() => this.setActiveModal('send')} before={<Icon28MoneyHistoryBackwardOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Перевести</Button>
                        {/* <br/>
                        <Button onClick={() => props.this.goVitas()} before={<Icon28GlobeOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Обучать Витька</Button> */}
                    </Div>
                {this.props.this.state.snackbar}
                {/* <Group separator="hide" header={<Header>Обнулить статистику</Header>}>
                    <Div>
                        Мы обнулим вам встатистику, число всех ответов станет равным 0.
                    </Div>
                </Group>
                <Div>
                    <Button before={<Icon28MoneyCircleOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Купить за 350 монеток</Button>
                </Div>
                <Group separator="hide" header={<Header>Сменить id Агента</Header>}>
                    <Div>
                        Установите себе другой id и будьте заметнее!
                    </Div>
                </Group>
                <Div>
                    <Button before={<Icon28MoneyCircleOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Купить за 700 монеток</Button>
                </Div> */}
            </Panel>
        )
    }
}
