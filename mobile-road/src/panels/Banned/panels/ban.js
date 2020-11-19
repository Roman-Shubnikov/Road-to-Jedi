import React from 'react';

import { 
    Panel,
    PanelHeader,
    Placeholder,
    Button,
    } from '@vkontakte/vkui';
import Icon56DurationOutline from '@vkontakte/icons/dist/56/duration_outline';


export default class Banned extends React.Component {
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
                Ban
                </PanelHeader>
                <Placeholder 
                stretched
                icon={<Icon56DurationOutline style={{color: 'var(--dynamic_red)'}} />}
                header='Ваш аккаунт был заблокирован'
                action={<Button href='https://vk.me/jedi_road' target="_blank" rel="noopener noreferrer" size="l">Связаться с нами</Button>}>
                    Причина:<br/><br/>{this.props.reason ? this.props.reason : "Не указана"}
                </Placeholder>
                {/* <iframe src="https://vk.com/video_ext.php?oid=413636725&id=456239192&hash=2f41f276d3619f78" width="600vw" height="360" frameborder="0" allowfullscreen></iframe> */}
                
            </Panel>
            )
            }
        }
  