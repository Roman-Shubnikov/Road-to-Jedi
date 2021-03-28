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
    Header,
    HorizontalScroll,
    HorizontalCell,
    MiniInfoCell,
    // Gradient,
    // Title,
    // Button,
    // Text,
    RichCell,
    Progress,
    InfoRow,




    } from '@vkontakte/vkui';

import {
    // Icon16Fire,
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

} from '@vkontakte/icons';

import { 
    enumerate, recog_number, 
    // recog_number
} from '../../../Utils';
import { isEmptyObject } from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { AVATARS_URL, CONVERSATION_LINK } from '../../../config';
import { viewsActions } from '../../../store/main';
export default props => {
    const dispatch = useDispatch();
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
    const account = useSelector((state) => state.account.account)
    const { setActiveModal, goOtherProfile, goPanel, setNewStatus } = props.callbacks;
    const [fetching, setFetching] = useState(false);
    const levels = account.levels;
    const exp_to_next_lvl = levels.exp_to_lvl - levels.exp;


    // const total_answers = account.good_answers + account.bad_answers;

    const changeStatus = useCallback(() => {
        setNewStatus(account.publicStatus);
        setActiveModal('statuschange');

    }, [account, setActiveModal, setNewStatus])

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
                    <Group>
                        <Div
                        onClick={() => setActiveModal('fantoms')}>
                            <InfoRow  header={<div style={{display: 'flex', justifyContent: 'space-between'}}><div style={{display: 'flex', marginBottom: 5}}>
                                <Icon20Ghost style={{ marginTop: 0, marginRight: 3}} />
                                {levels.lvl} уровень · {recog_number(levels.exp)} фантомов</div><div>Осталось ещё {exp_to_next_lvl}</div></div>}>
                                <Progress value={levels.exp / levels.exp_to_lvl * 100} />
                            </InfoRow>
                        </Div>
                    </Group>
                    {/* <Group>
                        <Gradient style={{
                            // margin: '-7px -7px 0 -7px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: 32,
                        }}
                        mode='white'>
                            <div style={{ position: 'relative', margin: 10 }}>
                                <Avatar src={account.avatar.url} size={96} style={{ position: 'relative' }} />
                                {account.diamond && <Icon28DiamondOutline width={25} height={25} className='Diamond_profile_new' />}
                            </div>
                            <Title 
                            style={{ marginBottom: 8, marginTop: 20 }} 
                            level="2" 
                            weight="medium">
                                {account['nickname'] ? account['nickname'] : `Агент Поддержки #${account['id']}`}
                            </Title>
                            <Text style={{ marginBottom: 24, display: 'flex' }}>
                                {account.flash &&
                                    <Icon16Fire 
                                    style={{color: 'var(--prom_icon)'}}
                                    width={16} height={16} 
                                    onClick={() => setActiveModal('prom')} />}
                                {account.donut &&
                                    <Icon16StarCircleFillYellow 
                                    width={16} height={16}
                                    onClick={() => setActiveModal('donut')} />}

                                {account.verified &&
                                    <Icon16Verified 
                                    style={{color: 'var(--dynamic_blue)', marginLeft: 2}}
                                    width={16} height={16}
                                    onClick={() => setActiveModal('verif')} />}
                            </Text>
                            <Text style={{ marginBottom: 24, display: 'flex' }}>
                                {account.followers[0] + " " + enumerate(account.followers[0], 
                                ['подписчик', 'подписчика', 'подписчиков'])} · {recog_number(total_answers) + " " + enumerate(total_answers,
                                    ['Ответ', 'Ответа', 'Ответов'])}
                            </Text>
                            <Button 
                            onClick={() => {
                                goPanel('settings');
                            }}
                            size="m" 
                            mode="secondary">Настройки</Button>

                        </Gradient>
                        <Group mode='plain'>
                            <MiniInfoCell
                                before={<Icon20ArticleOutline />}
                                textWrap='full'
                                onClick={() => {
                                    changeStatus()
                                }}>
                                {account.publicStatus || "Играю в любимую игру"}
                            </MiniInfoCell>
                        </Group>
                        
                    </Group> */}
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