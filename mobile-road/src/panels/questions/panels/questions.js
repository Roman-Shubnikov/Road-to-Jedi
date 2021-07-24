import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import { viewsActions, ticketActions } from '../../../store/main'
import {API_URL, PERMISSIONS} from '../../../config';
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
    
    
    } from '@vkontakte/vkui';

import {
    Icon56InboxOutline,
    Icon28WriteSquareOutline,
    Icon16StarCircleFillYellow,

} from '@vkontakte/icons';


import BannerAvatarPC from '../../../images/question_banner_pc.jpg'
import BannerAvatarMobile from '../../../images/question_banner_mobile.png'


const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

var loadingContent = false;

export default props => {
    const dispatch = useDispatch();
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
        
        // if (!account.donut) {
        //     bridge.send('VKWebAppGetAds')
        //         .then((BannerProps) => {
        //             setPromoBannerProps(BannerProps)
        //         })
        // }
        
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
    useEffect(() => {
        
        
    }, [account])


    return(
        <Panel id={props.id}>
            <PanelHeader
                left={<>
                    {(tickets && tickets.length > 0 && agent_permission) ?
                        <PanelHeaderButton onClick={() => getRandomTiket()}>
                            <Icon28WriteSquareOutline />
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
            {account.generator ?
                <Group>
                    <Div>
                        <Button onClick={() => goPanel('new_ticket')}
                            size="l"
                            mode="outline"
                            stretched>Новый вопрос</Button>
                    </Div>
                </Group>
                : null}
            <Group>
                <PullToRefresh onRefresh={() => {setFetching(true); getQuestions() }} isFetching={fetching}>
                    <List>
                        {tickets ? tickets.length > 0 ? tickets.map((result, i) =>
                            <React.Fragment key={i}>
                                {(i === 0) || <Separator />}
                                <SimpleCell
                                    multiline
                                    expandable
                                    onClick={() => { goTiket(result['id']) }}
                                    description={result['status'] === 0 ? "На рассмотрении" : result['status'] === 1 ? "Есть ответ" : "Закрыт"}
                                    before={<Avatar src={result['author']['photo_200']} size={48} />}
                                >
                                    <div style={{ display: "flex" }}>
                                        {result['title']}
                                        <div className='questionsIcons'>
                                            <div className='icon_donut_questions'>
                                                {result['donut'] ? <Icon16StarCircleFillYellow width={12} height={12} className="top_moderator_name_icon" /> : null}
                                            </div>
                                        </div>
                                    </div>
                                </SimpleCell>
                            </React.Fragment>
                        ) : <Placeholder
                            icon={<Icon56InboxOutline />}>
                            {agent_permission ? "Упс, кажется вопросы закончились" : "Вы ещё не создали ни одного вопроса"}
                                </Placeholder>
                            : <PanelSpinner />}
                    </List>


                    {ticketsCurrent ? ticketsCurrent.length === 20 ?
                        <PanelSpinner />
                        : tickets ?
                            (tickets.length === 0) ?
                                null :
                                <Footer>{tickets.length} {enumerate(tickets.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
                            : null :
                        null}
                </PullToRefresh>
            </Group>
            {/* { promoBannerProps && ShowAdsBanner &&
                <FixedLayout vertical='bottom'>
                <PromoBanner onClose={() => { setShowAdsBanner(false) }} bannerData={promoBannerProps} />
                </FixedLayout>} */}
        </Panel>
    )
}