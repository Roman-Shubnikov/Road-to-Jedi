import React, { useEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    Group,
    Div,
    FormStatus,
    Avatar,
    ScreenSpinner,
    ActionSheet,
    ActionSheetItem,
    PanelHeaderBack,
    Placeholder,
    Header,
    Snackbar,
    MiniInfoCell,
    UsersStack,
    Button,
    Link,
    PanelSpinner,
    IconButton,
    SimpleCell,


    } from '@vkontakte/vkui';


import { 
    Icon20StatisticsOutline,
    Icon20BookOutline,
    Icon16Fire,
    Icon16Verified,
    Icon16StarCircleFillYellow,
    Icon28WalletOutline,
    Icon28PaletteOutline,
    Icon28Notifications,
    Icon56DurationOutline,
    Icon28DiamondOutline,
    Icon16CheckCircle,
    Icon24MoreVertical,
    Icon20ArticleOutline,
    Icon20FollowersOutline,
    Icon20Info,
    Icon20GlobeOutline,
    Icon20WorkOutline,
    Icon20Add,
    Icon20UserOutline,
    Icon20CalendarOutline,
 } from '@vkontakte/icons';
import {
    Icon48DonateOutline,
} from '@vkontakte/icons';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { accountActions, viewsActions } from '../store/main';
import { API_URL, AVATARS_URL } from '../config';
import { isEmptyObject } from 'jquery';
import { getHumanyTime, enumerate, recog_number } from '../Utils';

const SCHEMES = [
    'Автоматическая',
    'Light',
    'Dark',
]
const NOTI = [
    'Выключены',
    'Включены'
]

const blueBackground = {
    backgroundColor: 'var(--accent)'
  };

export default props => {
    const dispatch = useDispatch();
    const [ShowServiceInfo, setShowServiceInfo] = useState(false);
    const [snackbar, setSnackbar] = useState(null);
    const profRef = useRef(null);
    const { setPopout, showErrorAlert, setActiveModal, setReport } = props.callbacks;
    const {other_profile: OtherProfileData, account} = useSelector((state) => (state.account))
    const setActiveStory = (story) => dispatch(viewsActions.setActiveStory(story))
    const { online, id: agent_id, 
        nickname, 
        flash, 
        verified: verif, 
        vk_id, 
        banned, 
        diamond, 
        avatar, 
        donut, 
        subscribe, 
        followers,
        good_answers,
        bad_answers,
        age,
        balance,
        donuts,

    } = OtherProfileData;
    const total_answers = good_answers + bad_answers;

    

    
    const subscribeUnsubscribe = () => {
        setPopout(<ScreenSpinner />)
        let method = OtherProfileData.subscribe ? "followers.unsubscribe&" : "followers.subscribe&"
        fetch(API_URL + `method=${method}` + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'agent_id': agent_id,
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    dispatch(accountActions.getOtherProfile(agent_id))
                    setPopout(null);

                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                setActiveStory('disconnect')
            })
    }
    const subscribeMenu = () => {
        if (OtherProfileData.subscribe) {
            setPopout(
                <ActionSheet onClose={() => setPopout(null)}
                    toggleRef={profRef.current}
                    iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
                    <ActionSheetItem mode='destructive' onClick={() => {
                        subscribeUnsubscribe()
                    }}>Отписаться</ActionSheetItem>
                </ActionSheet>)
        } else {
            subscribeUnsubscribe()
        }
    }
    const infoMenu = (id) => {
        setPopout(
            <ActionSheet onClose={() => setPopout(null)}
                toggleRef={profRef.current}
                iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
                {account.special ?
                    <ActionSheetItem autoclose onClick={() => { setActiveModal('ban_user'); }}>
                        Заблокировать
                </ActionSheetItem>
                    : null}
                <ActionSheetItem autoclose
                    onClick={() => {
                        bridge.send("VKWebAppCopyText", { text: "https://vk.com/app7409818#agent_id=" + id });
                        setSnackbar(<Snackbar
                            layout="vertical"
                            onClose={() => setSnackbar(null)}
                            before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}>
                            Ссылка скопирована
                        </Snackbar>)
                    }}>
                    Скопировать ссылку
                </ActionSheetItem>
                <ActionSheetItem autoclose
                    mode='destructive'
                    onClick={() => {
                        setReport(2, agent_id)
                    }}>
                    Пожаловаться
                </ActionSheetItem>
            </ActionSheet>)
    }
    useEffect(() => {

    })

    return(
        <Panel id={props.id}>
            <PanelHeader
            left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Профиль
            </PanelHeader>

            {!isEmptyObject(OtherProfileData) && !banned ? <>
                <Group>
                    <SimpleCell
                        disabled
                        after={
                            <>
                            <IconButton
                                onClick={() => infoMenu(agent_id)}
                                getRootRef={profRef}
                                icon={<Icon24MoreVertical/>}>
                            </IconButton>
                                </>
                            
                        }
                        description={online.is_online ? "online" : getHumanyTime(online.last_seen).date + " в " + getHumanyTime(online.last_seen).time}
                        before={diamond ?
                            <div style={{ position: 'relative', margin: 10 }}><Avatar src={avatar.url} size={70} style={{ position: 'relative' }} />
                                <Icon28DiamondOutline width={25} height={25} className='Diamond_profile' />
                            </div> : <Avatar size={70} src={avatar.url} style={{ position: 'relative'}} />}
                    >
                        <div style={{ display: 'flex' }}>
                            {nickname ? nickname : `Агент Поддержки #${agent_id}`}
                            {flash &&
                                <div className="profile_moderator_name_icon">
                                    <Icon16Fire width={12} height={12} style={{ color: "var(--prom_icon)" }} onClick={() => setActiveModal('prom')} />
                                </div>}
                            {donut &&
                                <div className="profile_moderator_name_icon">
                                    <Icon16StarCircleFillYellow width={12} height={12} onClick={() => setActiveModal('donut')} />
                                </div>}
                            {verif &&
                                <div className="profile_moderator_name_icon_ver">
                                    <Icon16Verified style={{ color: "var(--dynamic_blue)" }} onClick={() => setActiveModal('verif')} />
                                </div>}
                        </div>
                    </SimpleCell>
                    <Div style={{ display: 'flex' }}>
                        {vk_id && <Button
                            size='m'
                            stretched
                            target="_blank" rel="noopener noreferrer"
                            href={"https://vk.me/id" + vk_id}
                            style={{ marginRight: 8 }}>
                            Сообщение
                        </Button>}
                        <Button
                            size='m'
                            stretched
                            onClick={() => subscribeMenu()}
                            mode={subscribe ? 'secondary' : 'primary'}>
                            {subscribe ? "Вы подписаны" : "Подписаться"}
                        </Button>
                    </Div>
                </Group>

                {
                    (OtherProfileData.special || OtherProfileData.generator || banned) ?
                        <div style={{ marginTop: 20, marginBottom: 20 }} className="help_title_profile">{banned ?
                            'Этот профиль заблокирован' :
                            'Вы не можете просматривать этот профиль'}
                        </div> :
                        <>
                            <Group header={<Header mode='tertiary'>Основная информация</Header>}>
                                <MiniInfoCell
                                    before={<Icon20ArticleOutline />}
                                    textWrap='full'>
                                    {OtherProfileData.publicStatus || "Играю в любимую игру"}
                                </MiniInfoCell>
                                <MiniInfoCell
                                    before={<Icon20FollowersOutline />}
                                    after={
                                        <UsersStack
                                            photos={OtherProfileData.followers[2].map((user, i) => AVATARS_URL + user.avatar_name)} />
                                    }>
                                    {followers[0] ? followers[0] + " " + enumerate(followers[0],
                                        ['подписчик', 'подписчика', 'подписчиков']) : "нет подписчиков"}
                                    {followers[1] ? " · " +
                                        followers[1] + " " + enumerate(followers[1],
                                            ['новый', 'новых', 'новых']) : ''}
                                </MiniInfoCell>
                                <MiniInfoCell
                                    mode='full'
                                    before={<Icon20WorkOutline />}>
                                    Дата регистрации: {getHumanyTime(OtherProfileData.registered).date}

                                </MiniInfoCell>
                                <MiniInfoCell
                                    textWrap='full'
                                    before={<Icon20BookOutline />}>
                                    {recog_number(total_answers) + " " + enumerate(total_answers,
                                            ['Ответ', 'Ответа', 'Ответов'])}
                                </MiniInfoCell>
                                <MiniInfoCell
                                    textWrap='full'
                                    before={<Icon20Info />}>
                                    {recog_number(good_answers) + " " + enumerate(good_answers,
                                            ['Положительный', 'Положительныx', 'Положительных'])} · {recog_number(
                                                bad_answers) + " " + enumerate(bad_answers,
                                                    ['Отрицательный', 'Отрицательных', 'Отрицательных'])}
                                </MiniInfoCell>
                                {OtherProfileData.public && <MiniInfoCell
                                    mode='base'
                                    before={<Icon20GlobeOutline />}>
                                    <Link href={'https://vk.com/id' + vk_id}
                                        target="_blank" rel="noopener noreferrer">Страница ВКонтакте</Link>
                                </MiniInfoCell>}
                                {account.special && <MiniInfoCell
                                    before={<Icon20Add style={{ transform: ShowServiceInfo ? "rotate(45deg)" : '', transition: 'all 0.3s' }} />}
                                    mode="more"
                                    onClick={() => { setShowServiceInfo(prevState => !prevState) }}
                                >
                                    Подробная информация
                    </MiniInfoCell>}

                            </Group>
                            {ShowServiceInfo &&
                                <Group>
                                    <MiniInfoCell
                                        before={<Icon20UserOutline />}
                                        after={agent_id}>
                                        Id Агента
                        </MiniInfoCell>
                                    <MiniInfoCell
                                        before={<Icon20CalendarOutline />}
                                    after={age + " " + enumerate(age, ['год', 'года', 'лет'])}>
                                        Возраст
                        </MiniInfoCell>
                                    <MiniInfoCell
                                        before={<Icon28WalletOutline width={20} height={20} />}
                                    after={recog_number(balance)}>
                                        Баланс
                        </MiniInfoCell>
                                    <MiniInfoCell
                                        before={<Icon48DonateOutline width={20} height={20} />}
                                    after={recog_number(donuts)}>
                                        Пончики
                        </MiniInfoCell>
                                    <MiniInfoCell
                                        before={<Icon28PaletteOutline width={20} height={20} />}
                                        after={SCHEMES[OtherProfileData.scheme]}>
                                        Используемая тема
                        </MiniInfoCell>
                                    <MiniInfoCell
                                        before={<Icon28Notifications width={20} height={20} />}
                                    after={NOTI[Number(OtherProfileData.noti)]}>
                                        Уведомления
                        </MiniInfoCell>
                                    <MiniInfoCell
                                        before={<Icon20StatisticsOutline width={20} height={20} />}
                                    after={OtherProfileData.coff_active}>
                                        Рейтинг Престижности
                        </MiniInfoCell>
                                    <MiniInfoCell
                                        mode='base'
                                        before={<Icon20GlobeOutline />}>
                                        <Link href={'https://vk.com/id' + vk_id}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            Страница ВКонтакте
                            </Link>
                                    </MiniInfoCell>
                                </Group>
                            }
                        </>
                }

                {!account.special &&
                    <Group>
                        <Div>
                            <FormStatus header="Внимание! Важная информация" mode="default">
                                Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                        </FormStatus>
                        </Div>
                    </Group>}
            </> :
                OtherProfileData && banned ?
                <Placeholder
                    stretched
                    icon={<Icon56DurationOutline style={{ color: 'var(--dynamic_red)' }} />}>
                    {!banned.time_end ? "Этот аккаунт был заблокирован навсегда" : "Этот аккаунт был временно заблокирован"}
                    <br />
                    {banned.time_end ? <p>До: {getHumanyTime(banned.time_end).datetime}<br /></p> : null}
                    {banned.reason ? "Причина: " + banned.reason : null}
                </Placeholder> : <PanelSpinner/>}
            {snackbar}
        </Panel>
    )
}