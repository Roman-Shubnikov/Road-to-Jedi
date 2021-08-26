import React, { useCallback, useEffect, useState } from 'react';

import { 
    Panel,
    PanelHeader,
    Button,
    Placeholder,
    Separator,
    PullToRefresh,
    Cell,
    Div,
    PanelHeaderBack,
    Tabs,
    TabsItem,
    Search,
    HorizontalScroll,
    Group,
    } from '@vkontakte/vkui';

import Icon28WarningTriangleOutline from '@vkontakte/icons/dist/28/warning_triangle_outline';
import { API_URL } from '../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from '../../../store/main';
import { getHumanyTime } from '../../../Utils';

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
export default props => {
    const { myQuestions } = useSelector((state) => state.account)
    const [activeTab, setActiveTab] = useState('positive');
    const [limit, setLimit] = useState(20);
    const dispatch = useDispatch();
    const { setPopout, showErrorAlert, goTiket } = props.callbacks;
    const [search, setSearch] = useState('');
    const [fetching, setFetching] = useState(false);
    const [searched, setSearched] = useState([]);
    const { goDisconnect } = props.navigation;

    const getMyQuestions = useCallback(() => {
        fetch(API_URL + "method=tickets.getByModeratorAnswers&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    dispatch(accountActions.setMyquestions(data.response))
                    setTimeout(() => {
                        setFetching(false);
                        setPopout(null);
                    }, 500)

                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(goDisconnect)
    }, [dispatch, goDisconnect, setPopout, showErrorAlert])
    
    const getFiltresQuestions = useCallback((questions) => {
        let filtredQuestions;
        if (!questions){return []}
        switch (activeTab) {
            case 'positive':
                filtredQuestions = questions.filter(({ mark }) => mark === 1);
                break;
            case 'negative':
                filtredQuestions = questions.filter(({ mark }) => mark === 0);
                break;
            case 'moderation':
                filtredQuestions = questions.filter(({ mark }) => mark === -1);
                break;
            default:
                filtredQuestions = questions.filter(({ mark }) => mark === 1);
        }
        const LowerSearch = search.toLowerCase();
        filtredQuestions = filtredQuestions.filter(
            ({ text }) => text.toLowerCase().indexOf(LowerSearch) > -1
            );
        return filtredQuestions;

    }, [activeTab, search])
    useEffect(() => {
        getMyQuestions()
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        setSearched(getFiltresQuestions(myQuestions))
    }, [myQuestions, getFiltresQuestions])

    return (
        <Panel id={props.id}>
            <PanelHeader
                separator={!platformname}
                left={<PanelHeaderBack onClick={() => window.history.back()} />}
            >
                Мои ответы
                </PanelHeader>
            <Group>
                <Search value={search}
                    onChange={(e) => {
                        setSearch(e.currentTarget.value)
                    }} />
                <Tabs>
                    <HorizontalScroll>
                        <TabsItem
                            onClick={() => setActiveTab('positive')}
                            selected={activeTab === 'positive'}
                        >
                            Положительные
                            </TabsItem>
                        <TabsItem
                            onClick={() => setActiveTab('negative')}
                            selected={activeTab === 'negative'}
                        >
                            Отрицательные
                            </TabsItem>
                        <TabsItem
                            onClick={() => setActiveTab('moderation')}
                            selected={activeTab === 'moderation'}
                        >
                            На модерации
                            </TabsItem>
                    </HorizontalScroll>
                </Tabs>
            </Group>
            <Group>
                <PullToRefresh onRefresh={() => { setFetching(true); getMyQuestions() }} isFetching={fetching}>
                    {searched.slice(0, limit).length > 0 ? <>
                        {searched.slice(0, limit).map((result, i) =>
                        <React.Fragment key={result.id}>
                            {(i === 0) || <Separator />}
                            <Cell
                                key={i}
                                onClick={() => goTiket(result['ticket_id'])}
                                description={getHumanyTime(result.time).datetime}
                                size="l"
                            >
                                {result.text}
                            </Cell>
                        </React.Fragment>
                    )}
                        {(searched.slice(0, limit) < searched) ?
                            <Div>
                                <Button
                                    mode='secondary'
                                    size='l'
                                    stretched
                                    onClick={() => setLimit(prev => prev + 20)}
                                >Показать ещё 10 ответов</Button>
                            </Div> : null}
                            </> :
                        <Placeholder
                            icon={<Icon28WarningTriangleOutline width={56} height={56} />}>
                            По вашему запросу ничего не найдено.
                        </Placeholder>
                    }
                </PullToRefresh>
            </Group>
        </Panel>
    )
}