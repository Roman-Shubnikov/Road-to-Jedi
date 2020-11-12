import React from 'react';

import { 
    Button,
    Panel,
    PanelHeader,
    Group,
    Separator,
    Header,
    SimpleCell,
    Div,
    ScreenSpinner,
    FormLayout,
    FormStatus,
    Slider,
    Placeholder,
    PanelHeaderBack
    } from '@vkontakte/vkui';


import Icon28FavoriteOutline from '@vkontakte/icons/dist/28/favorite_outline';
import Icon28CoinsOutline from '@vkontakte/icons/dist/28/coins_outline';
import Icon28BillheadOutline from '@vkontakte/icons/dist/28/billhead_outline';
import Icon28FireOutline from '@vkontakte/icons/dist/28/fire_outline';

import SclidePlaceholder from '../../../images/start_slide_2.png'

export default class Start extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                AgeUser: 0,

            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
        }
        ChangeAge(age) {
            this.setPopout(<ScreenSpinner/>)
            fetch(this.state.api_url + "method=account.setAge&age=" + age + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                  console.log('registred')
              }
            })
            .catch(err => {
              this.showErrorAlert(err)
            })
          }
        render() {
            
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                left={
                  <PanelHeaderBack onClick={() => window.history.back()} /> 
                }>
                Road to Jedi
                </PanelHeader>

                {/* <img className="AvaModalPage" 
                src={this.props.account.id !== undefined ? this.props.account.avatar.url : null} 
                size={70}
                alt='твоя ава' /> */}
                  {/* <Header
                  subtitle='Помните, отвечать нужно вдумчиво.'>Вам присвоен номер #{this.props.account.id !== undefined ? this.props.account.id : "undefined"}</Header>
                <Separator /> */}
                <Placeholder 
                icon={<img style={{width: 200, height: 180}} src={SclidePlaceholder} alt='Тут была иконка... Press F to pay respect...' />}
                header='Прежде чем начать. Укажите следующие
                                    данные, они помогут нам оценивать
                                    Ваши ответы.'></Placeholder>
                <FormLayout>
                  <FormStatus header="Внимание! Важная информация" mode="error">
                    Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                  </FormStatus>
                    <Slider
                      min={10}
                      max={80}
                      step={1}
                      value={this.state.AgeUser}
                      onChange={e => {
                        this.setState({AgeUser: e});
                      }}
                      top={`Укажите свой возраст: ${this.state.AgeUser}`}
                    />
                  </FormLayout>
                  {/* <Group>
                    <SimpleCell disabled multiline
                    before={<Icon28CoinsOutline />}>
                      Зарабатывай монеты
                    </SimpleCell>
                    <SimpleCell disabled multiline
                    before={<Icon28BillheadOutline />}>
                      Отвечай на вопросы
                    </SimpleCell>
                    <SimpleCell disabled multiline
                    before={<Icon28FavoriteOutline />}>
                      Участвуй в рейтинге
                    </SimpleCell>
                    <SimpleCell disabled multiline
                    before={<Icon28FireOutline />}>
                      Получай отметку огня
                    </SimpleCell>
                  </Group> */}
                  <Placeholder>Убедительно просим, указывать только настоящие
                                данные, для избежания большого количества
                                        неверных оценок от лица
                                            модерации.
                  </Placeholder>
                  {/* <FormStatus header="Обратите внимание на это" mode="default">
                    Прежде чем нажать на кнопку. Пожалуйста, укажите свой возраст. Без этого продолжить не получится.
                  </FormStatus> */}
                  <Div>
                    <Button 
                    size='xl'
                    stretched
                    mode='secondary'
                    disabled={this.state.AgeUser ? false : true}
                    onClick={() => {
                      this.ChangeAge(this.state.AgeUser);
                      setTimeout(() => {
                        this.props.this.ReloadProfile();
                        this.props.this.changeData("activeStory", 'questions');
                      },2000);
                      
                    }}>Приступить!</Button>
                  </Div>
            </Panel>
            )
            }
        }
  