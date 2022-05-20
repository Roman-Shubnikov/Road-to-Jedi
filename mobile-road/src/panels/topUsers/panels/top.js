import React, { useCallback, useEffect, useState } from 'react';
import Skeleton from "react-loading-skeleton";
import { 
  Panel,
  PanelHeader,
  PullToRefresh,
  PanelHeaderContent,
  PanelHeaderContext,
  Cell,
  List,
  Group,
  TabsItem,
  Tabs,
  HorizontalScroll,
  Placeholder,
  SimpleCell,
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
import { topUsersActions } from '../../../store/main';
import { API_URL, IS_MOBILE, PERMISSIONS } from '../../../config';
import { inArray, isEmptyObject } from 'jquery';
import { enumerate } from '../../../Utils';
import { Podium } from '../../../components/Podium';

const Forms = {
  good_answers: ['хороший ответ', 'хороших ответа', 'хороших ответов'],
  marked_answers: ['оценённый ответ', 'оценённых ответа', 'оценённых ответов'],
  bad_answers: ['плохой ответ', 'плохих ответа', 'плохих ответов'],
  ghosts: ['фантом', 'фантома', 'фантомов'],

}
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

export default props => {
  const dispatch = useDispatch();
  const { topAgents, mode } = useSelector((state) => state.topUsers) 
  const { setPopout, showErrorAlert, goOtherProfile } = props.callbacks;
  const [contextOpened, setContextOpened] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const {
    account,
  } = useSelector((state) => state.account)
  const permissions = account.permissions;
  const moderator_permission = permissions >= PERMISSIONS.special;
  const { goDisconnect } = props.navigation;

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
      .catch(goDisconnect)
    }
  }, [dispatch, goDisconnect, showErrorAlert, setPopout, topAgents ]);


  const select = (e) => {
    const mode = Boolean(Number(e.currentTarget.dataset.mode));
    dispatch(topUsersActions.setMode(mode))
    requestAnimationFrame(() => setContextOpened(prev => !prev));
    setActiveTab('all')
    getTopUsers('all', mode, true)
  }
  const getCurrStub = () => {
    let time_think = "\n\nДумаем, в ближайшее время тут кто-то появится."
    switch(activeTab){
      case 'verif':
        return [<Icon36Done width={56} height={56} />, 'Топ верифицированных агентов пуст.'+time_think]
      case 'donut':
        return [<Icon56DonateOutline />, 'Топ агентов с отметкой VK Donut пуст.'+time_think]
      case 'flash':
        return [<Icon56FireOutline />, 'Топ агентов с отметкой огня Прометея пуст.'+time_think]
      case 'all':
        return [<Icon56Users3Outline />, 'Общий раздел пантеона пуст.'+time_think]
      default:
        return [<Icon56Users3Outline />, 'Этот раздел пантеона пуст.'+time_think]
    }
  }
  const getCurrDescriptionAgent = (result) => {
    if(inArray(activeTab, ['verif', 'donut', 'flash', 'rating', 'all']) !== -1){
      return((result.permissions >= PERMISSIONS.special) ? 
        <div className="top_moderator_desc">
          {result.good_answers + " " + enumerate(result.good_answers, Forms.marked_answers)}
        </div>
        :
        <div className="top_moderator_desc">
            {result.good_answers + " " + enumerate(result.good_answers, Forms.good_answers) + ", " 
            + result.bad_answers + " " + enumerate(result.bad_answers, Forms.bad_answers)}
        </div>)
    }
    if(inArray(activeTab, ['ghosts']) !== -1){
      return(
        <div className="top_moderator_desc">
          {result.levels.exp + " " + enumerate(result.levels.exp, Forms.ghosts)}
        </div>
      )
    }
  }
  useEffect(() => {
      getTopUsers(activeTab, mode)
       //eslint-disable-next-line
  }, [activeTab, mode])
  return (
    <Panel id={props.id}>
    <PanelHeader
    separator={!platformname}
    >
      {moderator_permission ? <PanelHeaderContent
        aside={<Icon16Dropdown style={{ transition: '0.3s',transform: `rotate(${contextOpened ? '180deg' : '0'})` }} />}
        onClick={() => setContextOpened(prev => !prev)}
      >
        Статистика
      </PanelHeaderContent> 
      :
        "Статистика" }
    
    </PanelHeader>
    <PanelHeaderContext opened={contextOpened} onClose={() => setContextOpened(prev => !prev)}>
      <List>
        <Cell
          before={<Icon28UserOutline />}
          after={!mode ? <Icon24Done fill="var(--accent)" /> : null}
          onClick={select}
          data-mode={0}
        >
          Пользователи
        </Cell>
        <Cell
          before={<Icon28EmployeeOutline />}
          after={mode ? <Icon24Done fill="var(--accent)" /> : null}
          onClick={select}
          data-mode={1}
        >
          Сотрудники
        </Cell>
      </List>
    </PanelHeaderContext>
    {((!IS_MOBILE && mode) || !mode) ? <Group>
        <Tabs>
          <HorizontalScroll getScrollToLeft={(i) => i - 50} getScrollToRight={(i) => i + 50}>
            <TabsItem
              onClick={() => setActiveTab('all')}
              selected={activeTab === 'all'}
              disabled={mode}
              style={{opacity: mode ? .3: 1}}
            >
              Общий
            </TabsItem>
            {!mode && <>
            <TabsItem
              onClick={() => setActiveTab('rating')}
              selected={activeTab === 'rating'}
            >
              По рейтингу
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
            </>}
          </HorizontalScroll>
        </Tabs>

      </Group>: null}
    
    <PullToRefresh onRefresh={() => {setFetching(true);getTopUsers(activeTab, mode, true)}} isFetching={fetching}>
      <Group>
        {topAgents[activeTab] ? !isEmptyObject(topAgents[activeTab]) ? 
        <>
        <Podium users={topAgents[activeTab]}
        goOtherProfile={goOtherProfile} />
        {topAgents[activeTab].slice(3).map((result, i) =>
          result.banned ? null :
          <React.Fragment key={result.id}>
            <UserTopC {...result}
            position={i + 4}
            description={
              getCurrDescriptionAgent(result)
            }
            onClick={() => {goOtherProfile(result.id, true)}} />

          </React.Fragment>
        )}
        </>
         : <Placeholder
            icon={getCurrStub()[0]}
            >
          {getCurrStub()[1]}
        </Placeholder> : 
        <>
        <Podium skeleton />
        {Array(13).fill().map((e,i)=> 
          <SimpleCell
          key={i}
          description={<Skeleton width={100} height={15} />}
          before={<Skeleton style={{marginRight: 12}} circle={true} width={48} height={48} />}>
              <Skeleton style={{marginBottom: 2}} width={120} height={18} />
          </SimpleCell>)}
        </>
        }
      </Group>
    </PullToRefresh>
</Panel>
)

}