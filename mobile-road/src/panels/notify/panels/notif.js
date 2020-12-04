import React from 'react';

import { 
    Panel,
    PanelHeader,
    Avatar,
    Placeholder,
    Separator,
    PullToRefresh,
    PanelSpinner,
    SimpleCell,
    PanelHeaderBack,
    } from '@vkontakte/vkui';

import Icon56NotificationOutline from '@vkontakte/icons/dist/56/notification_outline';


import Destruct_img from '../images/notify_destructive.png';
import Verif_img from '../images/notify_approve.png';
import Done_img from '../images/notify_done.png';
import Info_img from '../images/notify_info.png';
import Paycard_img from '../images/notify_paycard.png';
import Donut_img from '../images/notify_donut.png';
import Comment_img from '../images/notify_comment.png';


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

function getAvatarNotify(objectNotif){
    let Type = objectNotif['object']['type']
    let avatar = null;
    if(Type === 'add_good_answer'){
        avatar = Done_img;
    }else if(Type === 'add_bad_answer'){
        avatar = Destruct_img;
    }else if(Type === 'money_transfer_send' || Type === 'money_transfer_give'){
        avatar = Paycard_img;
    }else if(Type === 'reply_approve'){
        avatar = Info_img;
    }else if(Type === 'comment_add'){
        avatar = Comment_img;
    }else if(Type === 'donut_add'){
        avatar = Donut_img;
    }else if(Type === 'donut_del'){
        avatar = Donut_img;
    }else if(Type === 'verification_send'){
        avatar = Info_img;
    }else if(Type === 'verification_approve'){
        avatar = Verif_img;
    }else if(Type === 'verification_demiss'){
        avatar = Destruct_img
    }else if(Type === 'promo_activate'){
        avatar = Info_img;
    }else {
        console.log(Type);
    }
    return avatar
}


export default class ReaderNotif extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                notification: null,
                fetching: false,

            }
            this.detectNotif = (Res) => {
                let props = this.props.this; 
                let Type = Res['object']['type'];
                if(Type === 'add_good_answer' || Type === 'add_bad_answer' || Type === 'reply_approve' || Type === 'comment_add'){
                    props.goTiket(Res['object']['object'])
                }else if(Type === 'money_transfer_send' || Type === 'money_transfer_give'){
                    props.openMoneyTransfer(Res['image'], Res['text'], Res['comment'])
                }else{
                    return true;
                }
                return false;
                
            }
            this.detectClicable = (Res) => {
                let Type = Res['object']['type'];
                if(Type === 'add_good_answer' || Type === 'add_bad_answer' || Type === 'reply_approve' || Type === 'comment_add' || Type === 'money_transfer_send' || Type === 'money_transfer_give'){
                    return false
                }
                return true
            }
            this.getNotif = () => {
                fetch(this.props.this.state.api_url + "method=notifications.get&" + window.location.search.replace('?', ''))
                .then(res => res.json())
                .then(data => {
                if(data.result) {
                    this.setState({notification: data.response})
                    setTimeout(() => {
                        this.setState({ fetching: false });
                      }, 500);
                }else {
                   this.props.this.showErrorAlert(data.error.message)
                  }
                })
                .catch(err => {
                    this.props.this.changeData('activeStory', 'disconnect')

                })
            }
            this.markView = () => {
                fetch(this.props.this.state.api_url + "method=notifications.markAsViewed&" + window.location.search.replace('?', ''))
                .then(res => res.json())
                .then(data => {
                if(data.result) {
                    setTimeout(() => {
                        this.props.this.ReloadProfile();
                      }, 4000)
                }else {
                   this.props.this.showErrorAlert(data.error.message)
                  }
                })
                .catch(err => {
                    this.props.this.changeData('activeStory', 'disconnect')

                })
            }
        }
        
        componentDidMount() {
            this.getNotif();
            this.markView();
        }
        

        render() {
            return (
                <Panel id={this.props.id}>
                <PanelHeader
                left={<PanelHeaderBack onClick={() => {this.props.this.changeData("activeStory", 'profile');}} />}>
                Уведомления
                </PanelHeader>
                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.getNotif()}} isFetching={this.state.fetching}>
                    {this.state.notification ? this.state.notification.length > 0 ?
                    this.state.notification.map((result, i) =>
                    <React.Fragment key={i}> 
                        <SimpleCell
                            expandable={!this.detectClicable(result)}
                            onClick={() => this.detectNotif(result)}
                            description={new Date(result['time'] * 1e3).getDate() + " " + month[new Date(result['time'] * 1e3).getMonth()] + " " + new Date(result['time'] * 1e3).getFullYear() + " в " 
                            + fix_time(new Date(result['time'] * 1e3).getHours()) + ":" + fix_time(new Date(result['time'] * 1e3).getMinutes())}
                            size="l"
                            // before={<Avatar src={result['image']} />}
                            before={getAvatarNotify(result) ? <Avatar src={getAvatarNotify(result)} /> : null}
                            multiline="boolean"
                            disabled={this.detectClicable(result)}
                        >
                            <div style={{lineHeight: "17px", marginTop: "3px"}}>{result['text']}</div>
                            <div style={{marginTop: "4px"}}></div>
                        </SimpleCell>
                        <Separator className={{width: "100%"}}></Separator>
                    </React.Fragment>
                    ) :
                    <Placeholder 
                    icon={<Icon56NotificationOutline />}>
                        У Вас нет новых уведомлений
                    </Placeholder>
                    :
                    <PanelSpinner />
                    }
                </PullToRefresh></>
            </Panel>
            )
            }
        }
  