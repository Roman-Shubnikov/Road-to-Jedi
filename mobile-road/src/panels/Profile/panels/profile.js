import React, { useState } from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Group,
    Avatar,
    Counter,
    SimpleCell,
    PullToRefresh,
    RichCell,
    usePlatform,
    VKCOM,
    FormItem,
    FormLayout,
    Button,
    ScreenSpinner,
    Textarea,
    MiniInfoCell,
    Div,

    } from '@vkontakte/vkui';

import {
    Icon16Verified,
    Icon28PollSquareOutline,
    Icon28MarketOutline,
    Icon28Notifications,
    Icon28ShareExternalOutline,
    Icon16StarCircleFillYellow,
    Icon12Fire,
    Icon28SettingsOutline,
    Icon28MessagesOutline,
    Icon20ArticleOutline,
    Icon28HelpOutline,

} from '@vkontakte/icons';
import { isEmptyObject } from 'jquery';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, CONVERSATION_LINK, MESSAGE_NO_VK, PERMISSIONS, PUBLIC_STATUS_LIMIT } from '../../../config';
import InfoArrows from '../../../components/InfoArrows';
import { accountActions } from '../../../store/main';
import { sendGoal } from '../../../metrika';
import { ProfileTags } from '../../../components/ProfileTags';
import { NicknameMenager } from '../../../Utils';
export default props => {
    const dispatch = useDispatch();
    const platform = usePlatform();
    const account = useSelector((state) => state.account.account)
    const { setActiveModal, goPanel, showErrorAlert, setPopout } = props.callbacks;
    const { activeStory } = useSelector((state) => state.views)
    const { goDisconnect } = props.navigation;
    const [fetching, setFetching] = useState(false);
    const [editingStatus, setEdititingStatus] = useState(false);
    const [originalStatus, setOriginalStatus] = useState('');
    const [publicStatus, setPublicStatus] = useState('');
    const permissions = account.permissions;
    const moderator_permission = permissions >= PERMISSIONS.special;
    const agent_permission = permissions === PERMISSIONS.agent;
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
                    left={<><PanelHeaderButton onClick={() => {
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
                            caption={'#' + account['id']}
                            before={<Avatar size={72} src={account['avatar']['url']} alt='ava' />}
                        >
                            <div style={{ display: "flex" }}>
                                <NicknameMenager 
                                nickname={account.nickname}
                                agent_id={account.id}
                                perms={permissions} />
                                <ProfileTags
                                flash={account.flash}
                                donut={account.donut}
                                verified={account.verified} />
                            </div>
                        </RichCell>
                    </Group>}
                    <Group>
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
                        {agent_permission && 
                        <Div style={{paddingBottom: 0}}>
                            <InfoArrows 
                            good_answers={account['good_answers']}
                            bad_answers={account['bad_answers']}
                            total_answers={total_answers} />
                        </Div>}
                        
                    </Group>

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
                        
                        <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel(activeStory, 'market', true);
                                sendGoal('marketClick')
                            }}
                            before={<Icon28MarketOutline />}>
                                Магазин
                        </SimpleCell>

                        <SimpleCell
                            expandable
                            onClick={() => {
                                goPanel(activeStory, 'settings', true);
                            }}
                            before={<Icon28SettingsOutline />}>Настройки</SimpleCell>

                        <SimpleCell
                        before={<Icon28HelpOutline />}
                        onClick={() => {
                            goPanel(activeStory, 'faqMain', true);
                        }}>
                            Поддержка
                        </SimpleCell>
                        
                    </Group>
                    {!moderator_permission && <Group>
                        {MESSAGE_NO_VK}
                    </Group>}
                </PullToRefresh>
            </> : null}
        </Panel>
    )
}