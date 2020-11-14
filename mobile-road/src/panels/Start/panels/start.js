import React from 'react';

import { 
    Button,
    Panel,
    PanelHeader,
    Div,
    Placeholder,
    } from '@vkontakte/vkui';


import SclidePlaceholder from '../../../images/start_slide_1.svg'


export default class Start extends React.Component {
        constructor(props) {
            super(props);
            this.state = {

            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
        }
        render() {
            
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                >
                Road to Jedi
                </PanelHeader>
                
                <Placeholder 
                icon={<img style={{width: 250, height: 130}} src={SclidePlaceholder} alt='Тут была иконка... Press F to pay respect...' />}
                header='Отвечайте на разные вопросы пользователей ВКонтакте'>
                  Вам присвоен номер #{this.props.account.id !== undefined ? this.props.account.id : "undefined"}
                  <br/><br/>Помните, отвечать нужно вдумчиво. После
                  ответа Команда наших специальных агентов
                  проверит его и в случае отрицательной
                  оценки — оставит комментарий, если все
                  хорошо, Вы получите уведомление.
                  <br/><br/>Сервис не имеет отношения к
                  Администрации ВКонтакте
                </Placeholder>
                <Div>
                  <Button 
                  size='xl'
                  stretched
                  onClick={() => {
                    this.props.this.goPanel('start2');
                  }}
                  mode='secondary'>Далее</Button>
                </Div>
            </Panel>
            )
            }
        }
  