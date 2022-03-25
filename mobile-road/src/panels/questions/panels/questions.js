import React, { useCallback, useEffect, useState } from 'react';
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import { viewsActions, ticketActions } from '../../../store/main'
import {API_URL, PERMISSIONS, viewsStructure} from '../../../config';
import { enumerate } from '../../../Utils';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Avatar,
    Button,
    Placeholder,
    Separator,
    PullToRefresh,
    PanelSpinner,
    Div,
    Banner,
    Footer,
    Group,
    List,
    SimpleCell,
    FixedLayout,
    Spacing,
    Card,
    UsersStack,
    Tappable,
    
    } from '@vkontakte/vkui';

import {
    Icon56InboxOutline,
    Icon28SwitchOutline,
    Icon24AddOutline,
    Icon20ClockOutline,
    Icon20DonateCircleFillYellow,

} from '@vkontakte/icons';
import BannerAvatarPC from '../../../images/question_banner_pc.jpg';
import BannerAvatarMobile from '../../../images/question_banner_mobile.png';


const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

var loadingContent = false;

export default props => {
    const dispatch = useDispatch();
    const { activeStory } = useSelector((state) => state.views)
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
    const [ShowBanner, setShowBanner] = useState(true);
    const [fetching, setFetching] = useState(false);
    const account = useSelector((state) => state.account.account)
    const { tickets, ticketsCurrent, offset } = useSelector((state) => state.tickets)
    const setTickets = useCallback((tickets, ticketsCurrent) => dispatch(ticketActions.setTickets({ tickets, ticketsCurrent })), [dispatch])
    const permissions = account.permissions;
    const agent_permission = permissions >= PERMISSIONS.agent;

    const {setPopout, showErrorAlert, goTiket, goPanel} = props.callbacks;
    const getQuestions = useCallback((need_offset = false) => {
        if (!need_offset) {
            dispatch(ticketActions.setOffset(20))
        }
        let offsetData = need_offset ? offset : 0;
        let method = agent_permission ? 'tickets.get&' : 'tickets.getMy&';
        fetch(API_URL + 'method=' + method + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                // signal: controllertime.signal,
                body: JSON.stringify({
                    'count': 20,
                    'unanswered': 1,
                    'offset': offsetData,
                })
            })
            .then(res => res.json())
            .then(data => {
                setTimeout(() => {
                    setFetching(false)
                    loadingContent = false
                }, 500);
                if (data.result) {
                    var sliyan = [];
                    if (tickets !== null) {
                        let ticketsR = tickets.slice();
                        if (!need_offset) {
                            sliyan = data.response;
                        } else {
                            sliyan = data.response ? ticketsR.concat(data.response) : tickets;
                        }
                    } else {
                        sliyan = data.response

                    }
                    setTickets(sliyan, data.response)
                    if (need_offset) {
                        dispatch(ticketActions.setOffset(offset + 20))
                    }
                    loadingContent = false
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                setActiveStory('disconnect');

            })
        
    }, [dispatch, offset, setActiveStory, setTickets, showErrorAlert, tickets, agent_permission])
    const getRandomTiket = () => {
        fetch(API_URL + "method=ticket.getRandom&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    goTiket(data.response.id)
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                setActiveStory('disconnect');

            })
    }
    useEffect(() => {
        setPopout(null)
        if(ticketsCurrent === null){
            getQuestions(true);
        }
        // eslint-disable-next-line
    }, [setPopout, ticketsCurrent])
    useEffect(() => {
        $(window).on('scroll.detectautoload1', () => {
            
            if ($(window).scrollTop() + $(window).height() + 400 >= $(document).height() && !loadingContent && ticketsCurrent && ticketsCurrent.length === 20) {
                loadingContent = true
                getQuestions(true)
            }
        })
        return () => {
            $(window).off('scroll.detectautoload1')
        }
        // eslint-disable-next-line
    }, [offset, ticketsCurrent, account])


    return(
        <Panel id={props.id}>
            <PanelHeader
                left={<>
                    {(tickets && tickets.length > 0 && agent_permission) ?
                        <PanelHeaderButton onClick={() => getRandomTiket()}>
                            <Icon28SwitchOutline />
                        </PanelHeaderButton> : null}
                </>}
            >
                Вопросы
                </PanelHeader>

            {(ShowBanner && account.is_first_start && agent_permission) ?
                <Group>
                    <Banner
                        mode="image"
                        size="m"
                        onDismiss={() => {
                            setShowBanner(false);
                        }}
                        header="С чего начать?"
                        subheader='С прочтения статьи'
                        background={
                            <div
                                style={{
                                    backgroundColor: '#5b9be6',
                                    backgroundImage: platformname ? 'url(' + BannerAvatarMobile + ")" : 'url(' + BannerAvatarPC + ")",
                                    backgroundPosition: 'right bottom',
                                    backgroundSize: '100%',

                                    backgroundRepeat: 'no-repeat',
                                }}
                            />
                        }
                        asideMode="dismiss"
                        actions={
                            <Button mode="overlay_primary" href="https://vk.com/@jedi_road-checking-responses" target="_blank" rel="noopener noreferrer" size="l">Читать</Button>
                        }
                    />
                </Group>

                : null}
            <Group>
                <PullToRefresh onRefresh={() => {setFetching(true); getQuestions() }} isFetching={fetching}>
                    <List>
                        {tickets ? tickets.length > 0 ? tickets.map((result, i) =>
                            <React.Fragment key={i}>
                                {(i === 0) || <Spacing size={10} />}
                                <Div style={{paddingBottom: 0, paddingTop: 0}}>
                                    <Tappable
                                    disabled={result['donut'] && !account['donut']}
                                    onClick={() => { goTiket(result['id']) }}>
                                        <Card mode='outline'
                                        style={{position: 'relative'}}
                                        >
                                            <div style={{paddingTop: 7}}>
                                                <SimpleCell disabled expandable
                                                description={result['donut'] ? <div style={{display: 'flex', alignItems: 'center'}}>
                                                    {<Icon20DonateCircleFillYellow style={{marginRight: 6}} />}
                                                    Эксклюзивный вопрос
                                                </div> : <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <Icon20ClockOutline style={{marginRight: 6}} />На рассмотрении</div>}>
                                                    {result['title']} <span style={{color: 'var(--description_color)'}}>#{result['id']}</span>
                                                </SimpleCell>
                                                <Spacing separator />
                                                <Div style={{paddingBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                                    <UsersStack photos={[result['author']['photo_200']]}>
                                                        {result['author']['first_name'].slice(0, 12)} {result['author']['last_name'].slice(0, 12)}
                                                    </UsersStack>
                                                    {result['donut'] && !account['donut'] && <Button
                                                    size='m'
                                                    mode='secondary'
                                                    onClick={() => goPanel(viewsStructure.Profile.navName, 'market', true)}>
                                                        Поддержать и ответить
                                                    </Button>}
                                                </Div>
                                            </div>
                                            
                                        </Card>
                                    </Tappable>
                                    
                                </Div>
                                
                            </React.Fragment>
                        ) : <Placeholder
                            icon={<Icon56InboxOutline />}>
                            {agent_permission ? "Упс, кажется вопросы закончились" : "Вы ещё не создали ни одного вопроса"}
                                </Placeholder>
                            : 
                            Array(13).fill().map((e,i)=> 
                                <SimpleCell
                                key={i}
                                description={<Skeleton width={100} height={15} />}
                                before={<Skeleton style={{marginRight: 12}} circle={true} width={48} height={48} />}>
                                    <Skeleton style={{marginBottom: 2}} width={120} height={18} />
                                </SimpleCell>)
                            }
                    </List>


                    {ticketsCurrent && ticketsCurrent.length === 20 ?
                        <PanelSpinner />
                        : 
                        tickets && tickets.length !== 0 ?
                                <Footer>{tickets.length} {enumerate(tickets.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
                        : null}
                </PullToRefresh>
            </Group>
            {account.generator && <FixedLayout vertical="bottom" filled>
                <Div>
                    <Button onClick={() => {goPanel(activeStory, 'new_ticket', true)}}
                    before={<Icon24AddOutline />}
                    size="l"
                    mode='primary'
                    stretched>
                        Новый вопрос
                    </Button>
                </Div>
            </FixedLayout>}
        </Panel>
    )
}