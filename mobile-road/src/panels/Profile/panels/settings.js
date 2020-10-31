import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
    Panel,
    PanelHeader,
    Group,
    Alert,
    Counter,
    SimpleCell,
    Snackbar,
    PanelHeaderBack,
    CellButton,
    } from '@vkontakte/vkui';

import Icon28DoneOutline from '@vkontakte/icons/dist/28/done_outline';
import Icon28CoinsOutline from '@vkontakte/icons/dist/28/coins_outline';
import Icon28DeleteOutline from '@vkontakte/icons/dist/28/delete_outline';
import Icon28PaletteOutline from '@vkontakte/icons/dist/28/palette_outline';
import Icon20CancelCircleFillRed from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon28TargetOutline from '@vkontakte/icons/dist/28/target_outline';
import Icon28InfoOutline from '@vkontakte/icons/dist/28/info_outline';


export default class Settings extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",

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
          this.showErrorAlert(err)

      })
    }

    render() {
        var props = this.props.this;
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <PanelHeaderBack onClick={() => this.props.this.goBack()} /> 
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
                  expandable
                  onClick={() => props.goPanel('schemechange')}>Смена темы</SimpleCell>
                  <SimpleCell
                  onClick={() => this.props.this.setSnack(
                    <Snackbar
                    layout="vertical"
                    onClose={() => this.props.this.setSnack(null)}
                    before={<Icon20CancelCircleFillRed width={24} height={24} />}
                  >
                    Данный раздел ещё не готов для просмотра. Он стесняется :)
                  </Snackbar>)}
                  before={<Icon28DoneOutline />}>Верификация</SimpleCell>
                </Group>
                <Group>
                  <SimpleCell
                  disabled
                  indicator={<Counter>{this.props.account.balance}</Counter>}
                  before={<Icon28CoinsOutline />}>Баланс</SimpleCell>
                  <SimpleCell
                  expandable
                  onClick={() => {
                      this.props.this.goPanel("info");
                  }}
                  before={<Icon28InfoOutline />}>О приложении</SimpleCell>
                </Group>
                <Group>
                  <CellButton 
                  mode="danger"
                  onClick={() => this.setPopout(<Alert
                    actionsLayout='vertical'
                    actions={[{
                      title: 'Нет, я нажал сюда случайно',
                      autoclose: true,
                      style: 'cancel'
                    },{
                      title: 'Удалить аккаунт',
                      autoclose: true,
                      mode: 'destructive',
                      action: () => this.deleteAccount(),
                    }]}
                    onClose={() => this.setPopout(null)}
                  >
                    <h2>Внимание, опасность</h2>
                    <p>Данное действие ведёт к удалению вашего аккаунта: всех ответов, достижений и другой информации, которая сохранена на вашем аккаунте. Вы действительно хотите его удалить?</p>
                </Alert>)}
                  before={<Icon28DeleteOutline />}>Удалить аккаунт</CellButton>
                </Group>
                {this.props.this.state.snackbar}
            </Panel>
        )
    }
}
