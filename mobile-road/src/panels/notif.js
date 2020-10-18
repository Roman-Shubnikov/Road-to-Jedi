import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';

import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import Icon24SmileOutline from '@vkontakte/icons/dist/24/smile_outline';
import Icon24Report from '@vkontakte/icons/dist/24/report';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

function fix_time(time) {
    if(time < 10) {
        return "0" + time
    } else {
        return time
    }
}

var month= [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
];


    class Reader extends React.Component {
        constructor(props) {
            super(props);
        }

        

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader>
                Уведомления
                </PanelHeader>
                {console.log(props.state.notification)}
                {props.state.notification.length > 0 ?
                props.state.notification.map(function(result, i) {
                  return (
                      <div key={i}>
                  <Cell
                      key={i}
                      onClick={result['object']['object'] !== '0' ? () => props.goTiket(result['object']['object']) : () => props.openMoneyTransfer("https://api.xelene.me" + result['image'], result['text'], result['comment'])}
                      description={new Date(result['time'] * 1e3).getDate() + " " + month[new Date(result['time'] * 1e3).getMonth()] + " " + new Date(result['time'] * 1e3).getFullYear() + " в " 
                      + fix_time(new Date(result['time'] * 1e3).getHours()) + ":" + fix_time(new Date(result['time'] * 1e3).getMinutes())}
                      size="l"
                      before={<Avatar src={"https://api.xelene.me" + result['image']} size={56}/>}
                      multiline="boolean"
                  >
                    <div style={{lineHeight: "17px", marginTop: "3px"}}>{result['text']}</div>
                    <div style={{marginTop: "4px"}}></div>
                  </Cell>
                  <Separator className={{width: "100%"}}></Separator>
                  </div>
                  )
                }) :
                <div className="stub">У Вас нет новых уведомлений</div>
                }
            </Panel>
            )
            }
        }
  
export default Reader;