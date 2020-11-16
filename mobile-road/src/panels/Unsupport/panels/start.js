import React from 'react';

import { 
    Panel,
    PanelHeader,
    Placeholder,
    Button,
    } from '@vkontakte/vkui';


import Icon56CheckCircleDeviceOutline from '@vkontakte/icons/dist/56/check_circle_device_outline';


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
                stretched
                icon={<Icon56CheckCircleDeviceOutline style={{color: 'var(--dynamic_orange)'}} />}
                header='Упс, кажется вы не сможете получить доступ в данный момент'
                action={<Button href='https://vk.me/jedi_road' target="_blank" rel="noopener noreferrer" size="l">Связаться с нами</Button>}>
                  Наш сервис не поддерживает Вашу платформу из-за проблем с совместимостью и обильного количества багов на ней.
                  <br/>Попробуйте зайти с другого устройства.
                </Placeholder>
            </Panel>
            )
            }
        }
  