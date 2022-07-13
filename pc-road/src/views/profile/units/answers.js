import React, { useCallback, useEffect, useState } from 'react';

import { 
    Placeholder,
    Separator,
    Tabs,
    TabsItem,
    Group,
    List,
    PanelSpinner,
    SimpleCell,
    Link,
    IconButton,
    Calendar,
    } from '@vkontakte/vkui';

import {
    Icon56ArchiveOutline,
    Icon56CheckCircleOutline,
    Icon56ErrorTriangleOutline,
    Icon56RecentOutline,
    Icon24CalendarOutline,

} from '@vkontakte/icons';
import { useDispatch, useSelector } from 'react-redux';
import { accountActions } from '../../../store/main';
import { getHumanyTime } from '../../../Utils';
import { useApi, useNavigation } from '../../../hooks';
import { Dropdown } from '@vkontakte/vkui/dist/unstable';


export const Answers = props => {
    const { fetchApi } = useApi();
    const { goTiket } = useNavigation();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState('moderation');
    const [searched, setSearched] = useState(null);
    const { myQuestions } = useSelector((state) => state.account)

    const getMyQuestions = useCallback(() => {
        fetchApi("tickets.getByModeratorAnswers")
        .then(data => {
            dispatch(accountActions.setMyquestions(data))
        })
        .catch(e => {})
    }, [fetchApi, dispatch])

    const tabClick = (tab) => {
        return {
            onClick: () => setActiveTab(tab),
            selected: activeTab === tab,
        }
    }
    const getFiltresQuestions = useCallback((questions) => {
        let filtredQuestions;
        if (!questions) return [];
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
        return filtredQuestions;

    }, [activeTab])

    const getIconsAnswers = (mark) => {
        switch(mark) {
            case 1:
                return <Icon56CheckCircleOutline width={41} height={41} style={{ color: 'var(--clock_support_green)'}} />;
            case 0:
                return <Icon56ErrorTriangleOutline width={41} height={41} style={{ color: 'var(--warn)'}} />;
            case -1:
                return <Icon56RecentOutline width={41} height={41} style={{ color: 'var(--warn)'}} />;
            default:
                return <Icon56RecentOutline width={41} height={41} />;
        }
    }

    useEffect(() => {
        setSearched(getFiltresQuestions(myQuestions))
    }, [myQuestions, getFiltresQuestions])

    useEffect(() => {
        getMyQuestions()
    }, [getMyQuestions])

    
    if(!searched) return (
        <Group>
            <PanelSpinner />
        </Group>
    )
    return (
        <Group>
            <Tabs>
                <TabsItem
                {...tabClick('moderation')}>
                    На модерации
                </TabsItem>
                <TabsItem
                {...tabClick('positive')}>
                    Положительные
                </TabsItem>
                <TabsItem
                {...tabClick('negative')}>
                    Отрицательные
                </TabsItem>
                <Dropdown
                content={<Calendar />}>
                    <IconButton className='gray' style={{marginLeft: 'auto'}}>
                        <Icon24CalendarOutline />
                    </IconButton>
                </Dropdown>
                
            </Tabs>
            <Separator className="sep-wide" />
            <List>
            {searched.length > 0 ? 
            searched.map((result, i) =>
                <React.Fragment key={result.id}>
                    {(i === 0) || <Separator />}
                    <SimpleCell
                    key={i}
                    onClick={() => goTiket(result['ticket_id'])}
                    description={'ответ добавлен ' + getHumanyTime(result.time).datetime}
                    before={getIconsAnswers(result.mark)}
                    >
                        Вы ответили на вопрос <Link disabled>№{result.id}</Link>
                    </SimpleCell>
                </React.Fragment>
                ) :
                <Placeholder
                    header='Отвечайте на вопросы'
                    icon={<Icon56ArchiveOutline />}>
                    Здесь будут отображаться ваши ответы после модерации. Через определенное время ответы уходят в архив
                </Placeholder>
                }
            </List>
        </Group>
    )
}