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
    usePlatform,
    VKCOM,
    FormItem,
    FormLayout,
    Button,
    ScreenSpinner,
    Textarea,
    MiniInfoCell,
    Div,
    Spacing,
    Title,
    Text,
    Gradient,

    } from '@vkontakte/vkui';

import {
    Icon28UserCardOutline,
    Icon28PenStackOutline,
    Icon28Notifications,
    Icon28StorefrontOutline,
    Icon28SettingsOutline,
    Icon28MessagesOutline,
    Icon28LifebuoyOutline,
    Icon28DonateOutline,
    Icon20ArticleOutline,

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
                separator={platform===VKCOM}
                    left={<><PanelHeaderButton onClick={() => {
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
                {platform!==VKCOM &&
                <Group>
                    <Gradient
                            style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            textAlign: "center",
                            padding: 8,
                            }}
                        >
                            <Avatar size={95} src={account['avatar']['url']} alt='ava' />
                            <Title
                            style={{ marginBottom: 4, marginTop: 10 }}
                            level="2"
                            weight="2"
                            >
                            <NicknameMenager 
                                need_num={false}
                                nickname={account.nickname}
                                agent_id={account.id}
                                perms={permissions} />
                            </Title>
                            <Text style={{ marginBottom: 24, color: "var(--text_secondary)", display: "flex" }}>
                                #{account.id}
                                <ProfileTags
                                size='m'
                                flash={account.flash}
                                donut={account.donut}
                                verified={account.verified} />
                            </Text>
                            <Spacing separator style={{width: '90%'}} />
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
                        onClick={() => {
                            statusMenager();
                        }} 
                        style={{ marginTop: 16, marginBottom: 8, color: "var(--text_secondary)", display: "flex", wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                                {account.publicStatus || "Играю в любимую игру"}
                        </Text>
                        }
                            
                        </Gradient>
                        <Spacing size={20} />
                        <Div style={{paddingBottom: 0, paddingTop: 0}}>
                            <InfoArrows 
                            special={moderator_permission}
                            good_answers={account['good_answers']}
                            bad_answers={account['bad_answers']}
                            total_answers={total_answers} />
                        </Div>
                        <Spacing />
                    </Group>}
                    {platform===VKCOM && <Group>
                        <Div>
                            <InfoArrows 
                            special={moderator_permission}
                            good_answers={account['good_answers']}
                            bad_answers={account['bad_answers']}
                            total_answers={total_answers} />
                        </Div>
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
                        <Spacing separator />
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

                        <SimpleCell
                        expandable
                        onClick={() => {
                            goPanel(activeStory, 'settings', true);
                        }}
                        before={<Icon28SettingsOutline />}>
                            Настройки
                        </SimpleCell>

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