import React, { useState } from 'react';

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
    RichCell,
    Progress,
    InfoRow,
    usePlatform,
    VKCOM,
    FormItem,
    FormLayout,
    Button,
    ScreenSpinner,
    Textarea,
    MiniInfoCell,

    } from '@vkontakte/vkui';

import {
    Icon16Verified,
    Icon28PollSquareOutline,
    Icon28MarketOutline,
    Icon28Notifications,
    Icon28ShareExternalOutline,
    Icon16StarCircleFillYellow,
    Icon28DiamondOutline,
    Icon12Fire,
    Icon28SettingsOutline,
    Icon20Ghost,
    Icon28MessagesOutline,
    Icon20ArticleOutline,


} from '@vkontakte/icons';
import { 
    enumerate, recog_number, 
} from '../../../Utils';
import { isEmptyObject } from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, AVATARS_URL, CONVERSATION_LINK, MESSAGE_NO_VK, PERMISSIONS, PUBLIC_STATUS_LIMIT } from '../../../config';
import InfoArrows from '../../../components/InfoArrows';
import { accountActions } from '../../../store/main';
import { sendGoal } from '../../../metrika';
export default props => {
    const dispatch = useDispatch();
    const platform = usePlatform();
    const account = useSelector((state) => state.account.account)
    const { setActiveModal, goOtherProfile, goPanel, showErrorAlert, setPopout } = props.callbacks;
    const { activeStory } = useSelector((state) => state.views)
    const { goDisconnect } = props.navigation;
    const [fetching, setFetching] = useState(false);
    const [editingStatus, setEdititingStatus] = useState(false);
    const [originalStatus, setOriginalStatus] = useState('');
    const [publicStatus, setPublicStatus] = useState('');
    const levels = account.levels;
    const exp_to_next_lvl = levels.exp_to_lvl - levels.exp;
    const permissions = account.permissions;
    const moderator_permission = permissions >= PERMISSIONS.special;
    const agent_permission = permissions >= PERMISSIONS.agent;
    const total_answers = account['good_answers'] + account['bad_answers'];
    const { setIsMyMark } = props.marks_manage
    

    const statusMenager = () => {
        if(!editingStatus){
          setEdititingStatus(true);
            setOriginalStatus(account.publicStatus||'');
            setPublicStatus(account.publicStatus||'');
        } else{
          setPopout(<ScreenSpinner/>);
          setEdititingStatus(false)
          
          fetch(API_URL + 'method=account.changeStatus&' + window.location.search.replace('?', ''), {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'status': publicStatus.trim(),
            })
        })
          .then(res => res.json())
          .then(data => {
              if (data.result) {
                dispatch(accountActions.setPublicStatus(publicStatus))
                setPopout(null)
              } else {
                  showErrorAlert(data.error.message)
              }
          })
          .catch(goDisconnect)
    
        }
      }

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
                                goPanel(activeStory, 'notify', true)
                            }}>
                            <Icon28Notifications />
                        </PanelHeaderButton></>}>Профиль</PanelHeader>
                <PullToRefresh onRefresh={() => { setFetching(true); props.reloadProfile(); setTimeout(() => { setFetching(false) }, 1000) }} isFetching={fetching}>
                {platform!==VKCOM && <Group>
                        <RichCell
                            disabled
                            before={account.diamond ?
                                <div style={{ position: 'relative', margin: 10 }}><Avatar src={account['avatar']['url']} size={72} style={{ position: 'relative' }} />
                                    <Icon28DiamondOutline width={25} height={25} className='Diamond_profile' />
                                </div> : <Avatar size={72} src={account['avatar']['url']} />}
                        >
                            <div style={{ display: "flex" }}>
                                {account['nickname'] ? account['nickname'] : `Агент Поддержки #${account['id']}`}
                                {account['flash'] ?
                                    <div className="profile_icon">
                                        <Icon12Fire width={12} height={12} onClick={() => {setActiveModal('prom');setIsMyMark(true)}} />
                                    </div>
                                    : null}
                                {account['donut'] ?
                                    <div className="profile_icon">
                                        <Icon16StarCircleFillYellow width={12} height={12} onClick={() => {setActiveModal('donut');setIsMyMark(true)}} />
                                    </div>
                                    : null}
                                {account['verified'] ?
                                    <div className="profile_icon_ver">
                                        <Icon16Verified onClick={() => {setActiveModal('verif');setIsMyMark(true)}} />
                                    </div>
                                    : null}
                            </div>
                        </RichCell>
                    </Group>}
                    {agent_permission && <Group>
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
                        <MiniInfoCell
                        before={<Icon20ArticleOutline/>}
                        textWrap='full'
                        onClick={() => {
                            statusMenager();
                        }}>
                            {account.publicStatus || "Играю в любимую игру"}
                        </MiniInfoCell>
                        }
                        
                    </Group>}
                    
                    {agent_permission && <Group header={<Header mode="secondary">Основная информация</Header>}>
                        <InfoArrows 
                        good_answers={account['good_answers']}
                        bad_answers={account['bad_answers']}
                        total_answers={total_answers} />
                        <Div
                        onClick={() => setActiveModal('fantoms')}>
                            <InfoRow header={<div style={{display: 'flex', justifyContent: 'space-between'}}><div style={{display: 'flex', marginBottom: 5}}>
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
                            before={<Icon28MessagesOutline />}>
                            Чат
                            </SimpleCell>
                        {agent_permission && (moderator_permission || <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel(activeStory, 'qu', true);
                            }}
                            before={<Icon28PollSquareOutline />}>Мои ответы</SimpleCell>)}
                        
                        {agent_permission && <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel(activeStory, 'market', true);
                                sendGoal('marketClick')
                            }}
                            before={<Icon28MarketOutline />}>Маркет</SimpleCell>}

                        <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel(activeStory, 'settings', true);
                            }}
                            before={<Icon28SettingsOutline />}>Настройки</SimpleCell>


                        
                    </Group>
                    {!moderator_permission && <Group>
                        {MESSAGE_NO_VK}
                    </Group>}
                </PullToRefresh>
            </> : null}
        </Panel>
    )
}