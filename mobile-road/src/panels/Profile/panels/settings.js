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
    CellButton,
    PromoBanner,
    FixedLayout,
    } from '@vkontakte/vkui';

import {platform, IOS} from '@vkontakte/vkui';

import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28CoinsOutline from '@vkontakte/icons/dist/28/coins_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28PaletteOutline from '@vkontakte/icons/dist/28/palette_outline';
import Icon28TargetOutline from '@vkontakte/icons/dist/28/target_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';
import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
export default class Settings extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            ShowBanner: true

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
    deleteAccount(){
      fetch(this.state.api_url + "method=account.delete&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
      if(data.result) {
        bridge.send("VKWebAppClose", {"status": "success"});
      }else{
          this.showErrorAlert(data.error.message)
      }
      })
      .catch(err => {
        this.props.this.changeData('activeStory', 'disconnect')

      })
    }
    nofinc(){
      return
    }
    componentDidMount(){
      // if(platformname){
      //   this.setPopout(<ScreenSpinner/>)
      // }
      // setTimeout(() => {
      //   if(this.props.popout && this.props.popout.type.name === "ScreenSpinner"){
      //     this.setPopout(null)
      //   }
      // },5000)

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
                  className='pointer'
                  expandable
                  onClick={() => props.goPanel('schemechange')}>Смена темы</SimpleCell>

                  <SimpleCell
                  className='pointer'
                  indicator={this.props.account['verified'] ? 'Присвоен' : null}
                  disabled={this.props.account['verified']}
                  expandable={!this.props.account['verified']}
                  onClick={!this.props.account['verified'] ? () => props.goPanel('verf') : () => this.nofinc()}
                  before={<Icon28DoneOutline />}>Верификация</SimpleCell>

                  
                </Group>
                <Group>
                  <SimpleCell
                  disabled
                  indicator={<Counter>{this.props.account.balance}</Counter>}
                  before={<Icon28CoinsOutline />}>Баланс</SimpleCell>
                  
                  {(platform() === IOS && platformname) ? null :
                  <SimpleCell
                  className='pointer'
                  expandable
                  href="https://vk.com/jedi_road?source=description&w=donut_payment-188280516"
                  target="_blank" rel="noopener noreferrer"
                  before={<Icon28FavoriteOutline/>}>VK Donut</SimpleCell>}
                </Group>
                <Group>
                  <SimpleCell
                  className='pointer'
                  expandable
                  onClick={() => {
                      this.props.this.goPanel("info");
                  }}
                  before={<Icon28InfoOutline />}>О приложении</SimpleCell>
                </Group>
                <Group style={{paddingBottom: 30}}>
                  <CellButton 
                  mode="danger"
                  onClick={() => this.setPopout(<Alert
                    actionsLayout='vertical'
                    actions={[{
                      title: 'Удалить аккаунт',
                      autoclose: true,
                      mode: 'destructive',
                      action: () => this.deleteAccount(),
                    },{
                      title: 'Нет, я нажал сюда случайно',
                      autoclose: true,
                      mode: 'cancel'
                    },]}
                    onClose={() => this.setPopout(null)}
                  >
                    <h2>Внимание, опасность</h2>
                    <p>Данное действие ведёт к удалению вашего аккаунта: всех ответов, достижений и другой информации, которая сохранена на вашем аккаунте. Вы действительно хотите его удалить?</p>
                </Alert>)}
                  before={<Icon28DeleteOutline />}>Удалить аккаунт</CellButton>
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