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
            this.state = {
                notification: [],

            }
            this.getNotif = () => {
                fetch(this.props.this.state.api_url + "method=notifications.get&" + window.location.search.replace('?', ''))
                .then(res => res.json())
                .then(data => {
                if(data.result) {
                    this.setState({notification: data.response})
                    this.setState({ activeStory: "notif", history: ["notif"], activePanel: "notif"})
                }
                })
                .catch(err => {
                this.props.this.showErrorAlert()

                })
            }
        }
        componentDidMount() {
            this.getNotif();
        }
        

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader>
                Уведомления
                </PanelHeader>
                <><PullToRefresh onRefresh={() => {props.setState({fetching: true});this.getNotif()}} isFetching={props.state.fetching}>
                    {this.state.notification.length > 0 ?
                    this.state.notification.map((result, i) =>
                    <React.Fragment key={i}> 
                        <SimpleCell
                            onClick={result['object']['object'] !== '0' ? () => props.goTiket(result['object']['object']) : () => props.openMoneyTransfer(result['image'], result['text'], result['comment'])}
                            description={new Date(result['time'] * 1e3).getDate() + " " + month[new Date(result['time'] * 1e3).getMonth()] + " " + new Date(result['time'] * 1e3).getFullYear() + " в " 
                            + fix_time(new Date(result['time'] * 1e3).getHours()) + ":" + fix_time(new Date(result['time'] * 1e3).getMinutes())}
                            size="l"
                            before={<Avatar src={result['image']} />}
                            multiline="boolean"
                        >
                            <div style={{lineHeight: "17px", marginTop: "3px"}}>{result['text']}</div>
                            <div style={{marginTop: "4px"}}></div>
                        </SimpleCell>
                        <Separator className={{width: "100%"}}></Separator>
                    </React.Fragment>
                    ) :
                    <Placeholder 
                    stretched
                    icon={<Icon56NotificationOutline />}>
                        У Вас нет новых уведомлений
                    </Placeholder>
                    }
                </PullToRefresh></>
            </Panel>
            )
            }
        }
  
export default Reader;