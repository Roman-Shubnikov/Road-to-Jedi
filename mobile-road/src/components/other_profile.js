import React, { useRef } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import {
    Panel,
    PanelHeader,
    Group,
    Div,
    Avatar,
    ActionSheet,
    ActionSheetItem,
    PanelHeaderBack,
    Placeholder,
    Header,
    Snackbar,
    Link,
    PanelSpinner,
    IconButton,
    SimpleCell,
    Button,
    Spacing,
    PanelHeaderButton,
} from '@vkontakte/vkui';


import {
    Icon28WalletOutline,
    Icon56DurationOutline,
    Icon16CheckCircle,
    Icon24MoreVertical,
    Icon28BlockOutline,
    Icon28CopyOutline,
    Icon28ReportOutline,
    Icon28MentionOutline,
    Icon28HashtagOutline,
    Icon28DonateOutline,
    Icon28Notifications,
    Icon28StatisticsOutline,
    Icon28LogoVkOutline,
    Icon56LockOutline,
    Icon28FireOutline,

} from '@vkontakte/icons';

import { useSelector } from 'react-redux';
import { LINK_APP, PERMISSIONS } from '../config';
import { isEmptyObject } from 'jquery';
import { getHumanyTime, recog_number } from '../Utils';
import InfoArrows from './InfoArrows';
import { ProfileTags } from './ProfileTags';
import { ProfileCard } from './ProfileCard';
import { useNavigation } from '../hooks';
const NOTI = [
    'Выключены',
    'Включены'
]

const blueBackground = {
    backgroundColor: 'var(--accent)'
};

export default props => {
    const profRef = useRef(null);
    const { setPopout, setActiveModal, setReport, setSnackbar } = useNavigation();
    const { other_profile: OtherProfileData, account } = useSelector((state) => (state.account))


    const { online, id: agent_id,
        nickname,
        flash,
        verified: verif,
        vk_id,
        banned,
        avatar,
        donut,
        good_answers,
        bad_answers,
        balance,
        donuts,

    } = OtherProfileData;
    const total_answers = good_answers + bad_answers;
    const permissions = account.permissions;
    const admin_permission = permissions >= PERMISSIONS.admin;
    const is_private = OtherProfileData.permissions >= PERMISSIONS.special && account.permissions < PERMISSIONS.special

    const infoMenu = (id) => {
        setPopout(
            <ActionSheet onClose={() => setPopout(null)}
                toggleRef={profRef.current}
                iosCloseItem={<ActionSheetItem autoClose mode="cancel">Отменить</ActionSheetItem>}>
                {admin_permission ?
                    <ActionSheetItem autoClose onClick={() => { setActiveModal('ban_user'); }}
                        before={<Icon28BlockOutline />}>
                        Заблокировать
                    </ActionSheetItem>
                    : null}
                <ActionSheetItem autoClose
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
                <ActionSheetItem autoClose
                    before={<Icon28ReportOutline />}
                    mode='destructive'
                    onClick={() => {
                        setReport(2, agent_id)
                    }}>
                    Пожаловаться
                </ActionSheetItem>
            </ActionSheet>)
    }

    return (
        <Panel id={props.id}>
            <PanelHeader
            before={<><PanelHeaderBack onClick={() => window.history.back()} /><PanelHeaderButton onClick={() => {
                infoMenu(agent_id);
            }}><Icon24MoreVertical /></PanelHeaderButton></>}>
                Профиль
            </PanelHeader>

            {!isEmptyObject(OtherProfileData) && !banned ? <>
                <Group>
                    <Spacing size={10} />
                    <SimpleCell
                        disabled
                        after={
                            <>
                                <IconButton
                                    aria-label='Опции'
                                    onClick={() => infoMenu(agent_id)}
                                    getRootRef={profRef}>
                                        <Icon24MoreVertical />
                                </IconButton>
                            </>

                        }
                        subtitle={online.is_online ? "online" : getHumanyTime(online.last_seen).date + " в " + getHumanyTime(online.last_seen).time}
                        before={<Avatar size={70} src={avatar.url} />}
                    >
                        <div style={{ display: 'flex' }}>
                            {nickname ? nickname : `Агент Поддержки #${agent_id}`}
                            <ProfileTags
                            size='m'
                            verified={verif}
                            flash={flash}
                            donut={donut}
                             />
                        </div>
                    </SimpleCell>
                    <Spacing size={10} />
                    {!is_private && <Div>
                        <InfoArrows
                        special={OtherProfileData.permissions >= PERMISSIONS.special}
                        good_answers={good_answers}
                        bad_answers={bad_answers}
                        total_answers={total_answers}
                        />
                    </Div>}
                </Group>
                <ProfileCard
                    avatarUrl={avatar.url}
                    profileId={agent_id}
                    nickname={nickname}
                    permissions={OtherProfileData.permissions}
                    flash={flash}
                    donut={donut}
                    verified={verif}
                    good={good_answers+''}
                    bad={bad_answers+''}
                    total={total_answers+''}
                    publicStatus={OtherProfileData.publicStatus || "Играю в любимую игру"}
                    onClickStatus={() => {}} />

                {
                    is_private ?
                    <Group>
                        <Placeholder
                        header='Служебный профиль'
                        icon={<Icon56LockOutline />}
                        action={<Button size='m' href='https://vk.com/club201542328' target='_blank' rel='noopener noreferrer'>
                            Задать вопрос в Поддержку
                        </Button>}>
                            Профиль используется Специальным агентом
                        </Placeholder>
                    </Group>
                         :
                        <>
                            <Group header={<Header>Общая информация</Header>}>
                                <SimpleCell
                                disabled
                                before={<Icon28MentionOutline />}
                                after={getHumanyTime(OtherProfileData.registered).date}>
                                    Дата регистрации
                                </SimpleCell>
                            </Group>
                            {account.permissions >= PERMISSIONS.special &&
                                <Group>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28HashtagOutline />}
                                    after={agent_id}>
                                        Цифровой ID
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
                                    before={<Icon28Notifications />}
                                    after={NOTI[Number(OtherProfileData.noti)]}>
                                        Уведомления
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    href={'https://vk.com/id' + vk_id}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    before={<Icon28LogoVkOutline />}>
                                        <Link>
                                            Страница ВКонтакте
                                        </Link>
                                    </SimpleCell>
                                    {account.permissions >= PERMISSIONS.admin && <>
                                    {OtherProfileData.permissions < PERMISSIONS.special ? 
                                    <SimpleCell
                                    disabled
                                    before={<Icon28StatisticsOutline />}
                                    after={OtherProfileData.coff_active}>
                                        Рейтинг Престижности
                                    </SimpleCell>:
                                    <>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28FireOutline />}
                                    after={OtherProfileData?.age}>
                                        Алгоритм Прометея
                                    </SimpleCell>
                                    <SimpleCell
                                    disabled
                                    before={<Icon28FireOutline />}
                                    after={OtherProfileData?.mark_day}>
                                        Оценил за сегодня
                                    </SimpleCell>
                                    </>
                                    }
                                    </>}
                                </Group>
                            }
                        </>
                }
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
        </Panel>
    )
}