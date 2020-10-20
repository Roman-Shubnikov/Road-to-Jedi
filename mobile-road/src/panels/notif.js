import React from 'react';

import { 
    Panel,
    PanelHeader,
    Group,
    Alert,
    Avatar,
    Placeholder,
    Separator,
    PullToRefresh,
    PanelSpinner,
    InfoRow,
    Header,
    Counter,
    SimpleCell,
    PromoBanner,
    FixedLayout,
    Cell,
    Div,
    HorizontalScroll,
    View,
    Switch,
    } from '@vkontakte/vkui';

import Icon56NotificationOutline from '@vkontakte/icons/dist/56/notification_outline';

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
                      onClick={result['object']['object'] !== '0' ? () => props.goTiket(result['object']['object']) : () => props.openMoneyTransfer(result['image'], result['text'], result['comment'])}
                      description={new Date(result['time'] * 1e3).getDate() + " " + month[new Date(result['time'] * 1e3).getMonth()] + " " + new Date(result['time'] * 1e3).getFullYear() + " в " 
                      + fix_time(new Date(result['time'] * 1e3).getHours()) + ":" + fix_time(new Date(result['time'] * 1e3).getMinutes())}
                      size="l"
                      before={<Avatar src={result['image']} size={56}/>}
                      multiline="boolean"
                  >
                    <div style={{lineHeight: "17px", marginTop: "3px"}}>{result['text']}</div>
                    <div style={{marginTop: "4px"}}></div>
                  </Cell>
                  <Separator className={{width: "100%"}}></Separator>
                  </div>
                  )
                }) :
                <Placeholder 
                stretched
                icon={<Icon56NotificationOutline />}>
                    У Вас нет новых уведомлений
                </Placeholder>
                }
            </Panel>
            )
            }
        }
  
export default Reader;