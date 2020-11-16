import React from 'react';

import { 
    Div,
    Panel,
    PanelHeader,
    Placeholder,
    Headline,
    Text,
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
                icon={<Icon56DurationOutline style={{color: 'var(--dynamic_red)'}} />}
                header='Ваш аккаунт был заблокирован'>
                </Placeholder>
                <Headline weight='semibold' style={{margin: '0 40vw'}}>Причина:</Headline>
                <Div>
                    <Text weight="medium" style={{color: 'gray'}}>{this.props.reason}</Text>
                </Div>
                
                
            </Panel>
            )
            }
        }
  