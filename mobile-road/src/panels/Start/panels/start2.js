import React from 'react';

import { 
    Button,
    Panel,
    PanelHeader,
    ScreenSpinner,
    FormLayout,
    FormStatus,
    Slider,
    Placeholder,
    PanelHeaderBack,
    Group,
    FormItem
    } from '@vkontakte/vkui';


import SclidePlaceholder from '../../../images/start_slide_2.svg'

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
            fetch(this.state.api_url + "method=account.setAge&" + window.location.search.replace('?', ''), 
              {method: 'post',
              headers: {"Content-type": "application/json; charset=UTF-8"},
                  // signal: controllertime.signal,
              body: JSON.stringify({'age': age })
            })
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                  console.log('registred')
                  setTimeout(() => {
                    this.props.this.ReloadProfile();
                    this.props.this.changeData("activeStory", 'questions');
                  },2000);
              }else{
                this.showErrorAlert(data.error.message)
              }
            })
            .catch(err => {
              this.props.this.changeData('activeStory', 'disconnect')
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
                <Group>
                  <Placeholder 
                  icon={<img style={{width: 200, height: 180}} src={SclidePlaceholder} alt='Тут была иконка... Press F to pay respect...' />}
                  header='Прежде чем начать, укажите следующие
                                      данные, они помогут нам оценивать
                                      Ваши ответы.'></Placeholder>
                </Group>
                <Group>
                  <Placeholder>Убедительно просим, указывать только настоящие
                                  данные, для избежания большого количества
                                          неверных оценок от лица
                                              модерации.
                    </Placeholder>
                </Group>
                <Group>
                  <FormLayout>
                    <FormStatus header="Внимание! Важная информация" mode="error">
                      Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                    </FormStatus>
                    <FormItem top={`Укажите свой возраст: ${this.state.AgeUser}`}>
                      <Slider
                          min={10}
                          max={80}
                          step={1}
                          value={this.state.AgeUser}
                          onChange={e => {
                            this.setState({AgeUser: e});
                          }}
                          
                        />
                    </FormItem>
                    <FormItem>
                      <Button 
                      size='l'
                      stretched
                      type='submit'
                      mode='secondary'
                      disabled={this.state.AgeUser ? false : true}
                      onClick={() => {
                        this.ChangeAge(this.state.AgeUser);
                        
                      }}>Приступить!</Button>
                    </FormItem>
                      
                    </FormLayout>
                </Group>
                
                
            </Panel>
            )
            }
        }
  