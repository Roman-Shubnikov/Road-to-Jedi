import React, { useCallback, useState } from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    Avatar,
    Counter,
    SimpleCell,
    Div,
    FormStatus,
    PullToRefresh,
    RichCell,
    Header,
    HorizontalScroll,
    HorizontalCell,
    MiniInfoCell,
    Alert,
    Textarea,


    } from '@vkontakte/vkui';

import {
    Icon12Fire,
    Icon16Verified,
    Icon28PollSquareOutline,
    Icon28MarketOutline,
    Icon28Notifications,
    Icon28ShareExternalOutline,
    Icon16StarCircleFillYellow,
    Icon28Messages,
    Icon28DiamondOutline,
    Icon28SettingsOutline,
    Icon20ArticleOutline,
    
} from '@vkontakte/icons';
import { enumerate } from '../../../Utils';
import { isEmptyObject } from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, AVATARS_URL, CONVERSATION_LINK } from '../../../config';
import { viewsActions } from '../../../store/main';


export default props => {
    const dispatch = useDispatch();
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
    const account = useSelector((state) => state.account.account)
    const { setPopout, showErrorAlert, setActiveModal, goOtherProfile, goPanel } = props.callbacks;
    const [newStatus, setNewStatus] = useState('');
    const [fetching, setFetching] = useState(false);

    const changeStatus = () => {
        setNewStatus(account.publicStatus)
        setPopout(
            <Alert
                actionsLayout="horizontal"
                actions={[{
                    title: 'Отмена',
                    autoclose: true,
                    mode: 'cancel'
                },
                {
                    title: 'Сохранить',
                    autoclose: true,
                    mode: 'default',
                    action: () => saveNewStatus()
                }]}
                onClose={() => setPopout(null)}
                header="Ваш статус">
                <Textarea maxLength="140" onChange={(e) => setNewStatus(e.currentTarget.value)} name="newStatus" defaultValue={newStatus} />
            </Alert>
        )
    }
    const saveNewStatus = () => {
        fetch(API_URL + "method=account.changeStatus&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'status': newStatus.trim(),
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setTimeout(() => {
                        props.reloadProfile();
                    }, 1000)
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                setActiveStory('disconnect');
            })
    }
    return (
        <Panel id={props.id}>
            {!isEmptyObject(account) ? <>
                <PanelHeader
                    left={<><PanelHeaderButton onClick={() => {
                        setActiveModal("share");
                    }}>
                        <Icon28ShareExternalOutline />
                    </PanelHeaderButton>
                        <PanelHeaderButton label={account.notif_count ? <Counter size="s" mode="prominent">{account.notif_count}</Counter> : null}
                            onClick={() => {
                                setActiveStory('notif')
                                window.history.pushState({ panel: 'notif' }, 'notif');
                            }}>
                            <Icon28Notifications />
                        </PanelHeaderButton></>}>Профиль</PanelHeader>
                <PullToRefresh onRefresh={() => { setFetching(true); props.reloadProfile(); setTimeout(() => { setFetching(false) }, 1000) }} isFetching={fetching}>
                    <Group>
                        <RichCell
                            disabled
                            before={account.diamond ?
                                <div style={{ position: 'relative', margin: 10 }}><Avatar src={account['avatar']['url']} size={72} style={{ position: 'relative' }} />
                                    <Icon28DiamondOutline width={25} height={25} className='Diamond_profile' />
                                </div> : <Avatar size={72} src={account['avatar']['url']} />}
                        >
                            <div style={{ display: "flex" }}>
                                {account['nickname'] ? account['nickname'] : `Агент Поддержки #${account['id']}`}
                                {account['flash'] === true ?
                                    <div className="profile_icon">
                                        <Icon12Fire width={12} height={12} onClick={() => setActiveModal('prom')} />
                                    </div>
                                    : null}
                                {account['donut'] === true ?
                                    <div className="profile_icon">
                                        <Icon16StarCircleFillYellow width={12} height={12} onClick={() => setActiveModal('donut')} />
                                    </div>
                                    : null}
                                {account['verified'] === true ?
                                    <div className="profile_icon_ver">
                                        <Icon16Verified onClick={() => setActiveModal('verif')} />
                                    </div>
                                    : null}
                            </div>
                        </RichCell>
                        <MiniInfoCell
                            before={<Icon20ArticleOutline />}
                            textWrap='full'
                            onClick={() => {
                                changeStatus()
                            }}>
                            {account.publicStatus || "Играю в любимую игру"}
                        </MiniInfoCell>
                    </Group>
                    {account.followers[0] ?
                        <Group header={
                            <Header
                                mode="secondary"
                                aside={account.followers[0] + " " + enumerate(account.followers[0], ['подписчик', 'подписчика', 'подписчиков'])}
                            >
                                Подписчики
                            </Header>
                        }>
                            <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
                                <div style={{ display: 'flex' }}>
                                    {
                                        account.followers[2].map((item, i) =>
                                            <HorizontalCell key={item.from_id}
                                                size='s'
                                                header={item.nickname ? item.nickname : `Агент #${item.from_id}`}
                                                onClick={() => {
                                                    goOtherProfile(item.from_id);
                                                }}>
                                                <Avatar size={56} src={AVATARS_URL + item.avatar_name} />
                                            </HorizontalCell>)
                                    }
                                </div>
                            </HorizontalScroll>
                        </Group>
                        : null}

                    <Group>
                        <SimpleCell
                            expandable
                            href={CONVERSATION_LINK}
                            target="_blank" rel="noopener noreferrer"
                            before={<Icon28Messages />}>
                            Чат
                            </SimpleCell>
                        {(account.special || account.generator) || <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel('qu');
                            }}
                            before={<Icon28PollSquareOutline />}>Мои ответы</SimpleCell>}
                        <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel('market');
                            }}
                            before={<Icon28MarketOutline />}>Магазин</SimpleCell>

                        <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel('settings');
                            }}
                            before={<Icon28SettingsOutline />}>Настройки</SimpleCell>


                        {!account.special ? <Div>
                            <FormStatus header="Внимание! Важная информация" mode="default">
                                Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                                </FormStatus>
                        </Div> : null}
                    </Group>
                </PullToRefresh>
                {props.snackbar}
            </> : null}
        </Panel>
    )
}