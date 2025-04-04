import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import {
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    Counter,
    SimpleCell,
    PullToRefresh,
    usePlatform,
    ScreenSpinner,
    Div,
    Alert,
    Switch,
    Caption,
    Platform,

} from '@vkontakte/vkui';

import {
    Icon28UserCardOutline,
    Icon28PenStackOutline,
    Icon28Notifications,
    Icon28StorefrontOutline,
    Icon28MessagesOutline,
    Icon28LifebuoyOutline,
    Icon28DonateOutline,
    Icon28CheckCircleOutline,
} from '@vkontakte/icons';

import { isEmptyObject } from 'jquery';
import { useSelector } from 'react-redux';
import { API_URL, COMMUNITY_ID, CONVERSATION_LINK, DEFAULT_PUBLIC_STATUS, MESSAGE_NO_VK, PERMISSIONS } from '../../../config';
import { sendGoal } from '../../../metrika';
import { ProfileCard, SimpleSeparator } from '../../../components';
import { StoreObject } from '../../../store';
import { useNavigation } from '../../../hooks';



export const ProfilePanel = (props: { reloadProfile: VoidFunction, id: string }) => {
    const platform = usePlatform();
    const account = useSelector((state: StoreObject) => state.account.account)
    const { activeStory } = useSelector((state: StoreObject) => state.views)
    const [fetching, setFetching] = useState(false);
    const [notify, setNotify] = useState(account ? account.settings.notify : false)

    const { 
        setActiveModal, 
        goPanel, 
        showErrorAlert, 
        setPopout, 
        goDisconnect,
    } = useNavigation();

    const permissions = account.permissions;
    const moderator_permission = permissions >= PERMISSIONS.special;
    const agent_permission = permissions === PERMISSIONS.agent;
    const total_answers = account['good_answers'] + account['bad_answers'];


    // const statusMenager = () => {
        // if(!editingStatus){
        //   setEdititingStatus(true);
        //     setOriginalStatus(account.publicStatus||'');
        //     setPublicStatus(account.publicStatus||'');
        // } else{
        //   setPopout(<ScreenSpinner/>);
        //   setEdititingStatus(false)

        

        // }
    // }

    const notifyMenager = (value: boolean) => {
        fetch(API_URL + "method=settings.set&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'setting': 'notify',
                    'value': Number(value),
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setNotify(value)
                    setPopout(null)
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(goDisconnect)
    }
    const changeNotifStatus = (notif: React.ChangeEvent<HTMLInputElement>) => {
        const status = notif.currentTarget.checked;
        setPopout(<ScreenSpinner />)
        if (status) {
            setPopout(<Alert

                actionsLayout='horizontal'
                actions={[{
                    title: 'Разрешить',
                    autoClose: true,
                    mode: 'default',
                    action: () => {
                        bridge.send("VKWebAppAllowMessagesFromGroup", { "group_id": COMMUNITY_ID })
                            .then(() => {
                                setNotify(true)
                                notifyMenager(true)
                                setTimeout(() => {
                                    props.reloadProfile()
                                }, 1000)

                            })
                            .catch(() => { notifyMenager(false) })
                    },
                }, {
                    title: 'Нет, спасибо',
                    autoClose: true,
                    mode: 'cancel',
                    action: () => { notifyMenager(false) },

                },]}
                onClose={() => setPopout(null)}
                header="Внимание!"
                text="Сейчас нужно будет разрешить сообщения от группы.
            Хотите получать уведомления?"
            />)
        } else {
            bridge.send("VKWebAppDenyNotifications")
                .then(() => {
                    notifyMenager(false)
                    setTimeout(() => {
                        props.reloadProfile()
                    }, 1000)
                }).catch(() => {
                    notifyMenager(true)
                })

        }
    }

    return (
        <Panel id={props.id}>
            {!isEmptyObject(account) ? <>
                <PanelHeader
                    separator={platform === Platform.VKCOM}
                    before={<><PanelHeaderButton onClick={() => {
                        setActiveModal("share");
                    }}>
                        <Icon28UserCardOutline />
                    </PanelHeaderButton>
                        <PanelHeaderButton label={account.notif_count ? <Counter size="s" mode="prominent">{account.notif_count}</Counter> : null}
                            onClick={() => {
                                goPanel(activeStory, 'notify', true)
                            }}>
                            <Icon28Notifications />
                        </PanelHeaderButton></>}>Профиль</PanelHeader>
                <PullToRefresh onRefresh={() => { setFetching(true); props.reloadProfile(); setTimeout(() => { setFetching(false) }, 1000) }} isFetching={fetching}>
                    <ProfileCard
                        avatarUrl={account.avatar.url}
                        profileId={account.id}
                        nickname={account.nickname}
                        permissions={permissions}
                        flash={account.flash}
                        donut={account.donut}
                        verified={account.verified}
                        good={account.good_answers + ''}
                        bad={account.bad_answers + ''}
                        total={total_answers + ''}
                        publicStatus={account.publicStatus || DEFAULT_PUBLIC_STATUS}
                        onClickStatus={() => { setActiveModal('edit_status') }} />

                    {/* <Group className={classNames(gradientStyles[calcInitialsAvatarColor(account.id)], style.backgroundProfile)}>
                        <div style={{height: 357}}></div>
                        <Div className={style.head_root}>
                            <div className={style.avatar}>
                                <Avatar withBorder={false} size={95} src={account['avatar']['url']} alt='ava' />
                            </div>
                            
                            <div
                            className={style.agentName}>
                                <NicknameMenager 
                                need_num={false}
                                nickname={account.nickname}
                                agent_id={account.id}
                                perms={permissions} />
                                <ProfileTags
                                size='m'
                                flash={account.flash}
                                donut={account.donut}
                                verified={account.verified} />
                            </div>
                            {editingStatus ? 
                            <FormLayout>
                                <FormItem bottom={publicStatus.trim().length + '/' + PUBLIC_STATUS_LIMIT}>
                                    <Textarea 
                                    placeholder="Введите статус тут..."
                                    maxLength={PUBLIC_STATUS_LIMIT}
                                    value={publicStatus}
                                    onChange={e => {setPublicStatus(e.currentTarget.value)}}
                                    />
                                </FormItem>
                                <FormItem>
                                    <div style={{display: 'flex'}}>
                                        <Button
                                        style={{marginRight: 5}}
                                        onClick={() => {setEdititingStatus(false);setPublicStatus(originalStatus)}}
                                        mode='secondary'
                                        size='s'>
                                            Отменить
                                        </Button>
                                        <Button
                                        onClick={() => statusMenager()}
                                        mode='primary'
                                        size='s'>
                                            Сохранить
                                        </Button>
                                    </div>
                                </FormItem>
                            </FormLayout>
                            : 
                            <Text
                            onClick={statusMenager}
                            className={style.publicStatus}>
                                {account.publicStatus || "Играю в любимую игру"}
                            </Text>
                        }
                        <InfoChipsStatistic
                            className={style.statistic}
                            good={account['good_answers']+''}
                            bad={account['bad_answers']+''}
                            total={total_answers+''} />
                        </Div>
                    </Group> */}

                    <Group>
                        <SimpleCell
                            before={<Icon28Notifications />}
                            disabled
                            after={
                                <Switch
                                    checked={notify}
                                    onChange={(e) => changeNotifStatus(e)} />
                            }>Получать уведомления</SimpleCell>
                        <Div>
                            <Caption style={{ color: '#818C99' }}>
                                Уведомления позволят получать последние события от Команды специальных агентов по модерации ваших ответов
                            </Caption>

                        </Div>
                    </Group>

                    <Group>

                        <SimpleCell
                            expandable
                            href={CONVERSATION_LINK}
                            target="_blank" rel="noopener noreferrer"
                            before={<Icon28MessagesOutline />}>
                            Чат
                        </SimpleCell>
                        {account.donut_chat_link && <SimpleCell
                            expandable
                            href={account.donut_chat_link}
                            target="_blank" rel="noopener noreferrer"
                            before={<Icon28DonateOutline />}>
                            Эксклюзивный чат
                        </SimpleCell>}
                        <SimpleSeparator />

                        {agent_permission && (moderator_permission || <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel(activeStory, 'qu', true);
                            }}
                            before={<Icon28PenStackOutline />}>Мои ответы</SimpleCell>)}
                        {/* <SimpleCell
                        expandable
                        before={<Icon28CupOutline />}
                        onClick={() => {
                            goPanel(activeStory, 'achievements', true);
                        }}>
                            Достижения
                        </SimpleCell> */}
                        <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel(activeStory, 'market', true);
                                sendGoal('marketClick')
                            }}
                            before={<Icon28StorefrontOutline />}>
                            Магазин
                        </SimpleCell>

                        {<SimpleCell
                        indicator={account.verified ? 'Присвоена' : null}
                        disabled={!!account.verified}
                        expandable={!account.verified}
                        onClick={!account.verified ? () => goPanel(activeStory, 'verf', true) : undefined}
                        before={<Icon28CheckCircleOutline />}>Верификация</SimpleCell>}

                        <SimpleCell
                            expandable
                            before={<Icon28LifebuoyOutline />}
                            onClick={() => {
                                goPanel(activeStory, 'faqMain', true);
                            }}>
                            Поддержка
                        </SimpleCell>
                        {!moderator_permission && MESSAGE_NO_VK}
                    </Group>
                </PullToRefresh>
            </> : null}
        </Panel>
    )
}