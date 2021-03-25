import React, { useCallback, useEffect, useState } from 'react';

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
    Group,
    } from '@vkontakte/vkui';

import Icon56NotificationOutline from '@vkontakte/icons/dist/56/notification_outline';


import Destruct_img from '../images/notify_destructive.svg';
import Verif_img from '../images/notify_approve.svg';
import Done_img from '../images/notify_done.svg';
import Info_img from '../images/notify_info.svg';
import Paycard_img from '../images/notify_paycard.svg';
import Donut_img from '../images/notify_donut.svg';
import Comment_img from '../images/notify_comment.svg';
import { inArray } from 'jquery';
import { getHumanyTime } from '../../../Utils';
import { useDispatch } from 'react-redux';
import { viewsActions } from '../../../store/main';
import { API_URL } from '../../../config';


function getAvatarNotify(objectNotif){
    let typeNotif = objectNotif['object']['type'];
    let avatar;
    if(inArray(typeNotif, ['add_good_answer']) !== -1){
        avatar = Done_img;
    }else if(inArray(typeNotif, ['add_bad_answer', 'verification_demiss']) !== -1){
        avatar = Destruct_img;
    }else if(inArray(typeNotif, ['money_transfer_send', 'money_transfer_give']) !== -1){
        avatar = Paycard_img;
    }else if(inArray(typeNotif, ['reply_approve', 'verification_send', 'promo_activate', 'report_approve']) !== -1){
        avatar = Info_img;
    }else if(inArray(typeNotif, ['comment_add']) !== -1){
        avatar = Comment_img;
    }else if(inArray(typeNotif, ['donut_add', 'donut_del']) !== -1){
        avatar = Donut_img;
    }else if(inArray(typeNotif, ['verification_approve']) !== -1){
        avatar = Verif_img;
    }else{
        console.log(typeNotif);
    }
    return avatar
}
const clicableTypes = [
    'add_good_answer',
    'add_bad_answer',
    'reply_approve',
    'comment_add',
    'money_transfer_send',
    'money_transfer_give',

];
const ticketTypes = [
    'add_good_answer',
    'add_bad_answer',
    'comment_add',
    'reply_approve',
];
const moneyTypes = [
    'money_transfer_send',
    'money_transfer_give',
]
export default props => {
    const dispatch = useDispatch();
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
    const { showErrorAlert, goTiket, openMoneyTransfer } = props.callbacks;
    const [fetching, setFetching] = useState(false);
    const [notification, setNotifications] = useState(null);

    const detectNotif = (res) => {
        let typeNotif = res['object']['type'];
        if(inArray(typeNotif, ticketTypes) !== -1){
            goTiket(res['object']['object'])
        }else if(inArray(typeNotif, moneyTypes) !== -1){
            openMoneyTransfer(res['image'], res['text'], res['comment'], typeNotif)
        }else{
            return true;
        }
        return false;
    }

    const detectClickable = (res) => {
        let typeNotif = res['object']['type'];
        if(inArray(typeNotif, clicableTypes) !== -1){
            return true
        }
        return false
    }
    const getNotif = () => {
        fetch(API_URL + "method=notifications.get&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
        if(data.result) {
            setNotifications(data.response)
            setTimeout(() => {
                setFetching(false)
              }, 500);
        }else {
           showErrorAlert(data.error.message)
          }
        })
        .catch(err => {
            setActiveStory('disconnect')

        })
    }
    const markView = () => {
        fetch(API_URL + "method=notifications.markAsViewed&" + window.location.search.replace('?', ''))
        .then(res => res.json())
        .then(data => {
        if(data.result) {
            setTimeout(() => {
                props.reloadProfile();
              }, 4000)
        }else {
            showErrorAlert(data.error.message)
          }
        })
        .catch(err => {
            setActiveStory('disconnect')

        })
    }

    useEffect(() => {
        getNotif();
        markView();
        // eslint-disable-next-line
    }, [])


    return (
        <Panel id={props.id}>
        <PanelHeader
        left={<PanelHeaderBack onClick={() => {setActiveStory('profile');}} />}>
        Уведомления
        </PanelHeader>
        <Group>
            <><PullToRefresh onRefresh={() => {setFetching(true);getNotif()}} isFetching={fetching}>
                {notification ? notification.length > 0 ?
                notification.map((result, i) =>
                <React.Fragment key={i}> 
                    {(i === 0) || <Separator/>}
                    <SimpleCell
                        expandable={detectClickable(result)}
                        onClick={() => detectNotif(result)}
                        description={getHumanyTime(result.time).datetime}
                        size="l"
                        // before={<Avatar src={result['image']} />}
                        before={getAvatarNotify(result) ? <Avatar src={getAvatarNotify(result)} /> : null}
                        multiline="boolean"
                        disabled={!detectClickable(result)}
                    >
                        <div style={{lineHeight: "17px", marginTop: "3px"}}>{result['text']}</div>
                        <div style={{marginTop: "4px"}}></div>
                    </SimpleCell>
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
        </Group>
        
    </Panel>
    )
}