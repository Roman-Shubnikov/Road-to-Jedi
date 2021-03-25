import React, { useCallback, useEffect, useState } from 'react';
import { 
  Panel,
  PanelHeader,
  Separator,
  PullToRefresh,
  PanelSpinner,
  PanelHeaderContent,
  PanelHeaderContext,
  Cell,
  List,
  Group,
  TabsItem,
  Tabs,
  HorizontalScroll,
  Placeholder,

  } from '@vkontakte/vkui';


import {
  Icon16Dropdown,
  Icon24Done,
  Icon28UserOutline,
  Icon28EmployeeOutline,
  Icon36Done,
  Icon56DonateOutline,
  Icon56FireOutline,
  Icon56Users3Outline,

} from '@vkontakte/icons'
import UserTopC from '../../../components/userTop';
import { useDispatch, useSelector } from 'react-redux';
import { topUsersActions, viewsActions } from '../../../store/main';
import { API_URL } from '../../../config';
import { isEmptyObject } from 'jquery';

export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const { topAgents, mode } = useSelector((state) => state.topUsers) 
  const { setPopout, showErrorAlert, goOtherProfile } = props.callbacks;
  const [contextOpened, setContextOpened] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const {
    account,
  } = useSelector((state) => state.account)

  const getTopUsers = useCallback((type, staff=false, fetching=false) => {
    if(topAgents[type] === null || fetching){
      let MainData = {...topAgents};
      fetch(API_URL + "method=users.getTop&" + window.location.search.replace('?', ''),
      {method: 'post',
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify({
          'staff': staff,
          'type': type,
        })
      })
      .then(res => res.json())
      .then(data => {
        if(data.result) {
          MainData[type] = data.response;
          dispatch(topUsersActions.setTop(MainData))
          setPopout(null);
          setFetching(false);
        }else{
          showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        setActiveStory('disconnect')
  
      })
    }
  }, [dispatch, showErrorAlert, setActiveStory, setPopout, topAgents ]);


  const select = (e) => {
    const mode = Boolean(Number(e.currentTarget.dataset.mode));
    dispatch(topUsersActions.setMode(mode))
    requestAnimationFrame(() => setContextOpened(prev => !prev));
    setActiveTab('all')
    getTopUsers(activeTab, mode, fetching)
  }
  const getCurrStub = () => {
    switch(activeTab){
      case 'verif':
        return [<Icon36Done width={56} height={56} />, 'Пантеон верифицированных агентов пуст.\n\nДумаем, в ближайшее время тут кто-то появится.']
      case 'donut':
        return [<Icon56DonateOutline />, 'Пантеон агентов с отметкой VK Donut пуст.\n\nДумаем, в ближайшее время тут кто-то появится.']
      case 'flash':
        return [<Icon56FireOutline />, 'Пантеон агентов с отметкой огня Прометея пуст.\n\nДумаем, в ближайшее время тут кто-то появится.']
      case 'all':
        return [<Icon56Users3Outline />, 'Общий раздел пантеона пуст.']
      default:
        return [<Icon56Users3Outline />, 'Этот раздел пантеона пуст.']
    }
  }
  useEffect(() => {
      getTopUsers(activeTab, mode)
       //eslint-disable-next-line
  }, [activeTab, mode])
  return (
    <Panel id={props.id}>
    <PanelHeader
    >
      {account.special ? <PanelHeaderContent
        aside={<Icon16Dropdown style={{ transition: '0.3s',transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}
        onClick={() => setContextOpened(prev => !prev)}
      >
        Пантеон
      </PanelHeaderContent> 
      :
        "Пантеон" }
    
    </PanelHeader>
    <PanelHeaderContext opened={contextOpened} onClose={() => setContextOpened(prev => !prev)}>
      <List>
        <Cell
          before={<Icon28UserOutline />}
          asideContent={!mode ? <Icon24Done fill="var(--accent)" /> : null}
          onClick={select}
          data-mode={0}
        >
          Пользователи
        </Cell>
        <Cell
          before={<Icon28EmployeeOutline />}
          asideContent={mode ? <Icon24Done fill="var(--accent)" /> : null}
          onClick={select}
          data-mode={1}
        >
          Сотрудники
        </Cell>
      </List>
    </PanelHeaderContext>
    <Group>
        <Tabs>
          <HorizontalScroll>
            <TabsItem
              onClick={() => setActiveTab('all')}
              selected={activeTab === 'all'}
            >
              Общий
            </TabsItem>
            <TabsItem
              onClick={() => setActiveTab('donut')}
              selected={activeTab === 'donut'}
            >
              Доны
            </TabsItem>
            <TabsItem
              onClick={() => setActiveTab('verif')}
              selected={activeTab === 'verif'}
            >
              Верифицированные
            </TabsItem>
            <TabsItem
              onClick={() => setActiveTab('flash')}
              selected={activeTab === 'flash'}
            >
              Прометей
            </TabsItem>
          </HorizontalScroll>
        </Tabs>

      </Group>
    <Group>
    
    <><PullToRefresh onRefresh={() => {setFetching(true);getTopUsers(activeTab, mode, true)}} isFetching={fetching}>
      {topAgents[activeTab] ? !isEmptyObject(topAgents[activeTab]) ? topAgents[activeTab].map((result, i) => 
        result.banned ? null :
        <React.Fragment key={result.id}>
          {(i === 0) || <Separator/>}

        <UserTopC {...result}
        onClick={() => {goOtherProfile(result.id, true);}} />

     </React.Fragment>
      ) : <Placeholder
          icon={getCurrStub()[0]}
          >
        {getCurrStub()[1]}
      </Placeholder> : <PanelSpinner />}
    </PullToRefresh></>
    </Group>
</Panel>
)

}