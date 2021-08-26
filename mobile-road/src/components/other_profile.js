import React, { useLayoutEffect, useRef } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import $ from 'jquery';

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
    usePlatform,
    VKCOM,
} from '@vkontakte/vkui';


import {
    Icon16Fire,
    Icon16Verified,
    Icon16StarCircleFillYellow,
    Icon28WalletOutline,
    Icon56DurationOutline,
    Icon28DiamondOutline,
    Icon16CheckCircle,
    Icon24MoreVertical,
    Icon20ArticleOutline,
    Icon20FollowersOutline,
    Icon20Add,
    Icon16FireVerified,
    Icon28BlockOutline,
    Icon28CopyOutline,
    Icon28ReportOutline,
    Icon28UserIncomingOutline,
    Icon28MentionOutline,
    Icon28HashtagOutline,
    Icon28FaceIdOutline,
    Icon28DonateOutline,
    Icon28PaletteOutline,
    Icon28Notifications,
    Icon28StatisticsOutline,
    Icon28LogoVkOutline,

} from '@vkontakte/icons';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { accountActions, viewsActions } from '../store/main';
import { API_URL, AVATARS_URL, LINK_APP, PERMISSIONS } from '../config';
import { isEmptyObject } from 'jquery';
import { getHumanyTime, enumerate, recog_number } from '../Utils';
import { DonutTooltip, FlashTooltip, FlashVerifTooltip, VerifTooltip } from './Tooltips';
import InfoArrows from './InfoArrows';
import { rubberBand } from 'react-animations';
import styled, { keyframes } from 'styled-components';
const RubberBand = styled.div`animation: .8s ${keyframes`${rubberBand}`}`;
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
    const [tooltip1, setTooltip1] = useState(false);
    const [tooltip2, setTooltip2] = useState(false);
    const [tooltip3, setTooltip3] = useState(false);
    const [tooltip4, setTooltip4] = useState(false);
    const platform = usePlatform();
    const profRef = useRef(null);
    const { setPopout, showErrorAlert, setActiveModal, setReport } = props.callbacks;
    const { other_profile: OtherProfileData, account } = useSelector((state) => (state.account))
    const setActiveStory = (story) => dispatch(viewsActions.setActiveStory(story))

    const [ref1, setRef1] = useState(null);
    const [ref2, setRef2] = useState(null);
    const [ref3, setRef3] = useState(null);
    const [ref4, setRef4] = useState(null);

    const ref1Setter = node => { setRef1(node) };
    const ref2Setter = node => { setRef2(node) };
    const ref3Setter = node => { setRef3(node) };
    const ref4Setter = node => { setRef4(node) };

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
    const permissions = account.permissions;
    const moderator_permission = permissions >= PERMISSIONS.special;



    const subscribeUnsubscribe = () => {
        setPopout(<ScreenSpinner />)
        let method = subscribe ? "followers.unsubscribe&" : "followers.subscribe&"
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
                    let DataProf = { ...OtherProfileData };
                    DataProf.subscribe = !subscribe;
                    dispatch(accountActions.setOtherProfile(DataProf))
                    setPopout(null);

                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                console.log(err)
                setActiveStory('disconnect')
            })
    }
    const subscribeMenu = () => {
        if (OtherProfileData.subscribe) {
            setPopout(
                <ActionSheet onClose={() => setPopout(null)}
                    toggleRef={profRef.current}
                    iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
                    <ActionSheetItem mode='destructive'
                        before={<Icon28UserIncomingOutline />}
                        onClick={() => {
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
                {moderator_permission ?
                    <ActionSheetItem autoclose onClick={() => { setActiveModal('ban_user'); }}
                        before={<Icon28BlockOutline />}>
                        Заблокировать
                    </ActionSheetItem>
                    : null}
                <ActionSheetItem autoclose
                    before={<Icon28CopyOutline />}
                    onClick={() => {
                        bridge.send("VKWebAppCopyText", { text: LINK_APP + "#agent_id=" + id });
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
                    before={<Icon28ReportOutline />}
                    mode='destructive'
                    onClick={() => {
                        setReport(2, agent_id)
                    }}>
                    Пожаловаться
                </ActionSheetItem>
            </ActionSheet>)
    }
    useLayoutEffect(() => {
        if (platform === VKCOM) {
            $(ref1).on('mouseover.ref1_otherProf', () => {
                setTooltip1(true)
            })
            $(ref2).on('mouseover.ref2_otherProf', () => {
                setTooltip2(true)
            })
            $(ref3).on('mouseover.ref3_otherProf', () => {
                setTooltip3(true)
            })
            $(ref4).on('mouseover.ref4_otherProf', () => {
                setTooltip4(true)
            })
        }

        return () => {
            $(ref1).off('mouseover.ref1_otherProf');
            $(ref2).off('mouseover.ref2_otherProf');
            $(ref3).off('mouseover.ref3_otherProf');
            $(ref4).off('mouseover.ref4_otherProf');
        }
    }, [ref1, ref2, ref3, ref4, platform])

    return (
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
                                    icon={<Icon24MoreVertical />}>
                                </IconButton>
                            </>

                        }
                        description={online.is_online ? "online" : getHumanyTime(online.last_seen).date + " в " + getHumanyTime(online.last_seen).time}
                        before={diamond ?
                            <div style={{ position: 'relative', margin: 10 }}><Avatar src={avatar.url} size={70} style={{ position: 'relative' }} />
                                <Icon28DiamondOutline width={25} height={25} className='Diamond_profile' />
                            </div> : <Avatar size={70} src={avatar.url} style={{ position: 'relative' }} />}
                    >
                        <div style={{ display: 'flex' }}>
                            {nickname ? nickname : `Агент Поддержки #${agent_id}`}
                            {flash && verif &&
                                <FlashVerifTooltip
                                    isShown={tooltip1}
                                    offsetX={-23}
                                    onClose={() => setTooltip1(false)}>
                                    <div ref={ref1Setter} className="profile_moderator_name_icon">
                                        <Icon16FireVerified width={12} height={12} style={{ color: "var(--prom_icon)" }} onClick={() => setActiveModal('prom')} />
                                    </div>
                                </FlashVerifTooltip>
                            }
                            {flash && !verif &&
                                <FlashTooltip
                                    offsetX={-23}
                                    isShown={tooltip2}
                                    onClose={() => setTooltip2(false)}>
                                    <div ref={ref2Setter} className="profile_moderator_name_icon">
                                        <Icon16Fire width={12} height={12} style={{ color: "var(--prom_icon)" }} onClick={() => setActiveModal('prom')} />
                                    </div>
                                </FlashTooltip>
                            }
                            {donut &&
                                <DonutTooltip
                                    isShown={tooltip3}
                                    offsetX={-23}
                                    onClose={() => setTooltip3(false)}>
                                    <div ref={ref3Setter} className="profile_moderator_name_icon">
                                        <Icon16StarCircleFillYellow width={12} height={12} onClick={() => setActiveModal('donut')} />
                                    </div>
                                </DonutTooltip>
                            }
                            {verif && !flash &&
                                <VerifTooltip
                                    offsetX={-23}
                                    isShown={tooltip4}
                                    onClose={() => setTooltip4(false)}>
                                    <div ref={ref4Setter} className="profile_moderator_name_icon_ver">
                                        <Icon16Verified style={{ color: "var(--dynamic_blue)" }} onClick={() => setActiveModal('verif')} />
                                    </div>
                                </VerifTooltip>
                            }
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
                    ((OtherProfileData.permissions >= PERMISSIONS.special) || OtherProfileData.generator || banned) ?
                        <div style={{ marginTop: 20, marginBottom: 20 }} className="help_title_profile">{banned ?
                            'Этот профиль заблокирован' :
                            'Вы не можете просматривать этот профиль'}
                        </div> :
                        <>
                            <Group header={<Header>Общая информация</Header>}>
                                <MiniInfoCell
                                    before={<Icon20ArticleOutline />}
                                    textWrap='full'>
                                    {OtherProfileData.publicStatus || "Играю в любимую игру"}
                                </MiniInfoCell>
                                <InfoArrows
                                    good_answers={good_answers}
                                    bad_answers={bad_answers}
                                    total_answers={total_answers}
                                />
                                <SimpleCell
                                disabled
                                before={<Icon20FollowersOutline width={28} height={28} />}
                                after={
                                    <UsersStack
                                        photos={OtherProfileData.followers[2].map((user, i) => AVATARS_URL + user.avatar_name)} />
                                }>
                                    {followers[0] ? followers[0] + " " + enumerate(followers[0],
                                        ['подписчик', 'подписчика', 'подписчиков']) : "Нет подписчиков"}
                                    {followers[1] ? " · " +
                                        followers[1] + " " + enumerate(followers[1],
                                            ['новый', 'новых', 'новых']) : ''}
                                </SimpleCell>
                                <SimpleCell
                                    disabled
                                    before={<Icon28MentionOutline />}
                                    after={getHumanyTime(OtherProfileData.registered).date}>
                                        Дата регистрации
                                </SimpleCell>
                                {moderator_permission && 
                                <MiniInfoCell
                                    before={<Icon20Add style={{ transform: ShowServiceInfo ? "rotate(45deg)" : '', transition: 'all 0.3s' }} />}
                                    mode="more"
                                    onClick={() => { setShowServiceInfo(prevState => !prevState) }}
                                    >
                                        Подробная информация
                                </MiniInfoCell>}
                            </Group>
                            {ShowServiceInfo &&
                                <RubberBand><Group>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28HashtagOutline />}
                                    after={agent_id}>
                                        Id Агента
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28FaceIdOutline />}
                                    after={age + " " + enumerate(age, ['год', 'года', 'лет'])}>
                                        Возраст
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28WalletOutline />}
                                    after={recog_number(balance)}>
                                        Баланс
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28DonateOutline />}
                                    after={recog_number(donuts)}>
                                        Пончики
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28PaletteOutline />}
                                    after={SCHEMES[OtherProfileData.scheme]}>
                                        Используемая тема
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28Notifications />}
                                    after={NOTI[Number(OtherProfileData.noti)]}>
                                        Уведомления
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28StatisticsOutline />}
                                    after={OtherProfileData.coff_active}>
                                        Рейтинг Престижности
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28LogoVkOutline />}>
                                        <Link href={'https://vk.com/id' + vk_id}
                                            target="_blank"
                                            rel="noopener noreferrer">
                                            Страница ВКонтакте
                                        </Link>
                                    </SimpleCell>
                                   
                                </Group></RubberBand>
                            }
                        </>
                }

                {!moderator_permission &&
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
                    </Placeholder> : <PanelSpinner />}
            {snackbar}
        </Panel>
    )
}