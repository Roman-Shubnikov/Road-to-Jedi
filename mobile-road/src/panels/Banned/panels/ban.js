import React from 'react';

import { 
    Panel,
    PanelHeader,
    Placeholder,
    Button,
    Group,
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
        convertStandartDate(num){
            let out = '';
            if(num < 10){
                out = "0" + num;
            }else{
                out = num;
            }
            return out;
        }
        convertTime(timei){
            let out = '';
            let time = new Date(timei * 1000);
            out = this.convertStandartDate(time.getDate()) + 
            '.' + (this.convertStandartDate(time.getMonth() + 1)) + 
            '.' + time.getFullYear() + 
            ' ' +  this.convertStandartDate(time.getHours()) + 
            ':' + this.convertStandartDate(time.getMinutes())
            return out;
        }
        render() {
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                >
                Ban
                </PanelHeader>
                <Group>
                    <Placeholder
                    icon={<Icon56DurationOutline style={{color: 'var(--dynamic_red)'}} />}
                    header='Ваш аккаунт был заблокирован'
                    action={<Button href='https://vk.me/club201542328' target="_blank" rel="noopener noreferrer" size="l">Связаться с нами</Button>}>
                        Истекает: {this.props.BanObject.time_end ? this.convertTime(this.props.BanObject.time_end) : "Никогда(infinite)"}<br/>
                        Причина:<br/>{this.props.BanObject.reason ? this.props.BanObject.reason : "Не указана"}
                    </Placeholder>
                </Group>
                
                {/* <iframe src="https://vk.com/video_ext.php?oid=413636725&id=456239192&hash=2f41f276d3619f78" width="600vw" height="360" frameborder="0" allowfullscreen></iframe> */}
                
            </Panel>
            )
            }
        }
  