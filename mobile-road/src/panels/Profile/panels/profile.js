import React, { useCallback, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    Avatar,
    Counter,
    SimpleCell,
    Div,
    PullToRefresh,
    Header,
    HorizontalScroll,
    HorizontalCell,
    MiniInfoCell,
    RichCell,
    Progress,
    InfoRow,
    PanelSpinner,
    Placeholder,

    } from '@vkontakte/vkui';

import {
    Icon16Verified,
    Icon28PollSquareOutline,
    Icon28MarketOutline,
    Icon28Notifications,
    Icon28ShareExternalOutline,
    Icon16StarCircleFillYellow,
    Icon28Messages,
    Icon28DiamondOutline,
    Icon20ArticleOutline,
    Icon12Fire,
    Icon28SettingsOutline,
    Icon20Ghost,
    Icon56HistoryOutline,
    Icon28TicketOutline,

} from '@vkontakte/icons';
import { 
    enumerate, recog_number, 
} from '../../../Utils';
import { isEmptyObject } from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, AVATARS_URL, CONVERSATION_LINK, MESSAGE_NO_VK, PERMISSIONS } from '../../../config';
import { viewsActions } from '../../../store/main';
export default props => {
    const dispatch = useDispatch();
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
    const account = useSelector((state) => state.account.account)
    const { setActiveModal, goOtherProfile, goPanel, setNewStatus, showErrorAlert } = props.callbacks;
    const [fetching, setFetching] = useState(false);
    const [fetchdata, setFetchdata] = useState(null);
    const [moderationQuestions, setQuestions] = useState(null)
    const levels = account.levels;
    const exp_to_next_lvl = levels.exp_to_lvl - levels.exp;
    const permissions = account.permissions;
    const moderator_permission = permissions >= PERMISSIONS.special;
    const agent_permission = permissions >= PERMISSIONS.agent;
    

    const changeStatus = useCallback(() => {
        setNewStatus(account.publicStatus);
        setActiveModal('statuschange');

    }, [account, setActiveModal, setNewStatus])

    useEffect(() => {
        if(!agent_permission){
            bridge.send("VKWebAppGetUserInfo")
            .then(data => {
                setFetchdata(data);
            })
            .catch(err => console.log(err))
            fetch(API_URL + 'method=tickets.getMyModeration&' + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setQuestions(data.response)
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                setActiveStory('disconnect');

            })
        }
        
    }, [agent_permission])

    return (
        <Panel id={props.id}>
            {!isEmptyObject(account) ? <>
                <PanelHeader
                    left={agent_permission && <><PanelHeaderButton onClick={() => {
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
                {agent_permission ? <Group>
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
                        
                        
                    </Group> :
                    fetchdata &&
                    <Group>
                        <RichCell
                        disabled
                        before={<Avatar size={72} src={fetchdata.photo_100} />}
                        >
                            {fetchdata.first_name + " " + fetchdata.last_name}
                        </RichCell>
                    </Group>}

                    {agent_permission && <Group>
                        <Div
                        onClick={() => setActiveModal('fantoms')}>
                            <InfoRow  header={<div style={{display: 'flex', justifyContent: 'space-between'}}><div style={{display: 'flex', marginBottom: 5}}>
                                <Icon20Ghost style={{ marginTop: 0, marginRight: 3}} />
                                {levels.lvl} уровень · {recog_number(levels.exp)} фантомов</div><div>Осталось ещё {exp_to_next_lvl}</div></div>}>
                                <Progress value={levels.exp / levels.exp_to_lvl * 100} />
                            </InfoRow>
                        </Div>
                    </Group>}
                    {agent_permission && account.followers[0] ?
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
                        {agent_permission && ((moderator_permission || account.generator) || <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel('qu');
                            }}
                            before={<Icon28PollSquareOutline />}>Мои ответы</SimpleCell>)}
                        {!agent_permission && <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel('testingagents');
                            }}
                            before={<Icon28TicketOutline />}>Пройти тест на агента поддержки</SimpleCell>}
                        {agent_permission && <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel('market');
                            }}
                            before={<Icon28MarketOutline />}>Маркет</SimpleCell>}

                        <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel('settings');
                            }}
                            before={<Icon28SettingsOutline />}>Настройки</SimpleCell>


                        
                    </Group>
                    {!agent_permission && <Group header={<Header>Ваши вопросы в модерации</Header>}>
                        {moderationQuestions ? isEmptyObject(moderationQuestions) ? 
                        <Placeholder icon={<Icon56HistoryOutline/>}>
                            Сейчас у вас нет вопросов на модерации
                        </Placeholder> :
                        moderationQuestions.map((question, ind) =>
                        <SimpleCell
                        disabled
                        key={ind}
                        description={question.description}>
                            {question.title}
                        </SimpleCell> 
                        )
                        : <PanelSpinner />}
                    </Group>}
                    {!moderator_permission && <Group>
                        {MESSAGE_NO_VK}
                    </Group>}
                </PullToRefresh>
                {props.snackbar}
            </> : null}
        </Panel>
    )
}