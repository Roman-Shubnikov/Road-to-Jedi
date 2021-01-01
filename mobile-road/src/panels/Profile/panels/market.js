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
    Text,
    SimpleCell,
    PanelHeaderButton,
    Alert,
    FormLayout,
    CellButton,
    Group,
    HorizontalScroll,
    HorizontalCell,
    FormItem,
    } from '@vkontakte/vkui';

import Icon24Repeat from '@vkontakte/icons/dist/24/repeat';
import Icon28MoneyCircleOutline from '@vkontakte/icons/dist/28/money_circle_outline';

import Icon28MoneyHistoryBackwardOutline  from '@vkontakte/icons/dist/28/money_history_backward_outline';
import Icon16CheckCircle                  from '@vkontakte/icons/dist/16/check_circle';
import Icon20CancelCircleFillRed          from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon28InfoCircleOutline            from '@vkontakte/icons/dist/28/info_circle_outline';
import Icon24BlockOutline                 from '@vkontakte/icons/dist/24/block_outline';
import Icon48DonateOutline                from '@vkontakte/icons/dist/48/donate_outline';



import UserTopC from '../../../components/userTop';


const avatars = [
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
    "27.png",
    "28.png",
    "29.png",
    "30.png",
    "31.png",
    "32.png",
    "33.png",
    "34.png",
    
]

const donutAvatars = [
  "1001.png",
  "1002.png",
  "1003.png",
  "1004.png",
  "1005.png",
  "1006.png",
  "1007.png",
  "1008.png",
  "1009.png",
  "1010.png",

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
            selectedAvatar: 0,

        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.showAlert = propsbi.showAlert;
        this.setActiveModal = propsbi.setActiveModal;
        this.selectImage = this.selectImage.bind(this);
        this.changeAvatar = this.changeAvatar.bind(this)
        this.onChange = (event) => {
            var name = event.currentTarget.name;
            var value = event.currentTarget.value;
            this.setState({ [name]: value });
        }
    }
  selectImage(number) {
    this.setState({selectedAvatar:number});
  }
    changeAvatar() {
      let method = (this.state.selectedAvatar > 1000) ? "shop.changeDonutAvatars&" : "shop.changeAvatar&";
        fetch(this.state.api_url + `method=${method}` + window.location.search.replace('?', ''),
        {method: 'post',
        headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
        body: JSON.stringify({
            'avatar_id': (Number(this.state.selectedAvatar) > 1000 ) ? Number(this.state.selectedAvatar) - 1000 : Number(this.state.selectedAvatar),
        })
        })
        .then(data => data.json())
        .then(data => {
          this.setState({selectedAvatar: 0})
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
          this.props.this.changeData('activeStory', 'disconnect')
      })
        
    }
    ChangeId() {
        if(this.state.changed_id){ 
          fetch(this.state.api_url + "method=shop.changeId&" + window.location.search.replace('?', ''),
          {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'change_id': this.state.changed_id.trim(),
                })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
                this.props.this.setSnack(
                <Snackbar
                  layout="vertical"
                  onClose={() => this.props.this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  Вы успешно сменили ник
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
            this.props.this.changeData('activeStory', 'disconnect')
          })
        } else {
          this.props.this.setSnack(
            <Snackbar
            layout="vertical"
            onClose={() => this.props.this.setSnack(null)}
            before={<Icon20CancelCircleFillRed width={24} height={24} />}
          >
            Вы не указали желаемый ник
          </Snackbar>);
        }
      }
      ResetId() {
          fetch(this.state.api_url + "method=shop.resetId&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
                this.props.this.setSnack(
                <Snackbar
                  layout="vertical"
                  onClose={() => this.props.this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  Вы успешно удалили ник
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
            this.props.this.changeData('activeStory', 'disconnect')
          })
      }

      buyDiamond() {
        fetch(this.state.api_url + "method=shop.buyDiamond&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
          if(data.result) {
              this.props.this.setSnack(
              <Snackbar
                layout="vertical"
                onClose={() => this.props.this.setSnack(null)}
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
              >
                Вы успешно купили алмаз
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
          this.props.this.changeData('activeStory', 'disconnect')
        })
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
                
                <Group>
                  <Div>
                    <Text weight='medium'>Монетки — это универсальная условная единица для приобретения различных товаров в магазине</Text>
                  </Div>
                  <SimpleCell disabled indicator={this.props.account.balance}>Ваш баланс</SimpleCell>
                  {this.props.account.donut && <SimpleCell disabled indicator={this.props.account.donuts}>Пончики</SimpleCell>}
                  <CellButton onClick={() => this.props.this.goPanel('promocodes')}>Активировать промокод</CellButton>
                </Group>
        
                {/* <Div>
                  <FormStatus >
                    Скидки для тестеровщиков
                  </FormStatus>
                </Div> */}
                <Group header={<Header>Сменить аватар</Header>}>
                  <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
                  <div style={{ display: 'flex' }}>
                    {avatars.map((ava, i) => 
                    <HorizontalCell key={i} size='m' 
                    className={((i + 1) === this.state.selectedAvatar) ? 'select_avatar' : ''}
                    onClick={(e) => (this.props.account.avatar.id === i +1) ? this.props.this.setSnack(
                      <Snackbar
                      layout="vertical"
                      onClose={() => this.props.this.setSnack(null)}
                      before={<Icon20CancelCircleFillRed width={24} height={24} />}
                    >
                      Вы уже имеете данный аватар
                    </Snackbar>) : (this.state.selectedAvatar === (i + 1) ) ? this.selectImage(0) : this.selectImage(i + 1)}>
                        <Avatar id={i} size={88} src={"https://xelene.ru/road/php/images/avatars/" + ava}/>
                      
                    </HorizontalCell>)}
                  </div>
                  </HorizontalScroll>
                  <Div>
                      <Button onClick={this.changeAvatar}
                      before={<Icon28MoneyCircleOutline 
                      style={{marginRight: "5px"}}/>} 
                      size="l" 
                      stretched
                      mode="secondary"
                      disabled={this.state.selectedAvatar === 0 || this.state.selectedAvatar > 1000}>Сменить за 700 монеток</Button>
                  </Div>
                </Group>
                {this.props.account.donut && 
                <Group header={<Header>Эксклюзивные аватарки</Header>}>
                  <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
                  <div style={{ display: 'flex' }}>
                    {donutAvatars.map((ava, i) => 
                    <HorizontalCell key={i} size='m' 
                    className={((i + 1 + 1000) === this.state.selectedAvatar) ? 'select_avatar' : ''}
                    onClick={(e) => (this.props.account.avatar.id === i +1+1000) ? this.props.this.setSnack(
                      <Snackbar
                      layout="vertical"
                      onClose={() => this.props.this.setSnack(null)}
                      before={<Icon20CancelCircleFillRed width={24} height={24} />}
                    >
                      Вы уже имеете данный аватар
                    </Snackbar>) : (this.state.selectedAvatar === (i + 1 + 1000) ) ? this.selectImage(0) : this.selectImage(i + 1 + 1000)}>
                        <Avatar id={i} size={88} src={"https://xelene.ru/road/php/images/avatars/" + ava}/>
                      
                    </HorizontalCell>)}
                  </div>
                  </HorizontalScroll>
                  <Div>
                      <Button onClick={this.changeAvatar} 
                      before={<Icon48DonateOutline width={28} height={28}
                      style={{marginRight: "5px"}}/>} 
                      size="l" 
                      stretched
                      mode="secondary"
                      disabled={this.state.selectedAvatar === 0 || this.state.selectedAvatar < 1000}>Сменить за 50 пончиков</Button>
                  </Div>
                </Group>}

                <Group header={<Header>Сменить свой ник</Header>}>
                  <FormLayout>
                    <FormItem>
                      <Input placeholder="Введите желаемый ник" 
                      bottom='Макс. 10 символов'
                      onChange={(e) => this.onChange(e)} 
                      value={this.state.changed_id} 
                      maxLength="10" 
                      name="changed_id"/>
                    </FormItem>
                    <FormItem>
                      <div style={{display: 'flex'}}>
                        <Button onClick={() => {this.ChangeId(this.state.changed_id)}} 
                          style={{marginRight: 8}}
                          before={<Icon24Repeat width={28} height={28} />}
                          stretched
                          size="m" 
                          mode="secondary"
                          disabled={(this.state.changed_id <= 0) ? true : false}>Сменить за 1500 монеток</Button>
                        <Button 
                          stretched
                          onClick={() => this.setPopout(<Alert
                          actionsLayout='vertical'
                          actions={[{
                            title: 'Удалить ник',
                            autoclose: true,
                            mode: 'destructive',
                            action: () => this.ResetId(),
                          },{
                            title: 'Нет, я нажал сюда случайно',
                            autoclose: true,
                            style: 'cancel'
                          },]}
                          onClose={() => this.setPopout(null)}
                          header="Осторожно!"
                          text="Если вы удалите ник, то, возможно, его сможет забрать кто-то другой. После удаления ника у вас будет отображён начальный id"
                        />)}
                        before={<Icon24BlockOutline width={28} height={28} />}
                        size="m" 
                        mode='destructive'>Удалить ник</Button>
                      </div>
                    </FormItem>
                  </FormLayout>
                  
                </Group>
                

                
                {this.props.account ? !this.props.account.diamond ? 
                <Group header={<Header>Купить алмаз</Header>}>
                  <Div>
                    <Text weight='medium'>После приобретения этого товара, около вашей аватарки начнёт светиться фиолетовый алмаз. Это выглядит примерно так:</Text>
                  </Div>
                  <UserTopC {...this.props.account} 
                  diamond />
                  <Div>
                      <Button 
                      onClick={() => this.buyDiamond()} 
                      stretched
                      before={<Icon28MoneyHistoryBackwardOutline 
                      style={{marginRight: "5px"}}/>} size="l" mode='destructive'>Купить за 10 000 монеток</Button>
                  </Div>
                </Group> : null : null}
                <Group header={<Header>Опции</Header>}>
                  <Div>
                      <Button 
                      onClick={() => this.setActiveModal('send')} 
                      before={<Icon28MoneyHistoryBackwardOutline style={{marginRight: "5px"}}/>} 
                      size="l" 
                      mode="secondary"
                      stretched>Перевести</Button>
                  </Div>
                </Group>
                
                {this.props.this.state.snackbar}
            </Panel>
        )
    }
}
