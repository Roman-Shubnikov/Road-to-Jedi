import React, { useState, useCallback } from 'react';
import { 
  Panel,
  PanelHeader,
  HorizontalScroll,
  Group,
  TabsItem,
  Tabs,
  } from '@vkontakte/vkui';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';

import { useDispatch, useSelector } from 'react-redux';
import { IS_MOBILE, PERMISSIONS, viewsStructure } from '../../../config';
import { 
  Icon24Square4Outline,
  Icon24ReportOutline,
  Icon24Cards2Outline,
  Icon24CommentOutline,
  Icon24DoneOutline,
  Icon24ArticleOutline,
  Icon24UsersOutline
 } from '@vkontakte/icons';
import { moderationActions } from '../../../store/main';

import { 
  Verification,
  Reports,
  Generator,
  Questions, 
  Control,
  Comments,
  Answers,

} from './components'


export const ModerationPanel = props => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.moderation)
  const setActivetab = useCallback((tab) => dispatch(moderationActions.setActiveTab(tab)), [dispatch]);
  const [snackbar, setSnackbar] = useState(null);
  const { account } = useSelector((state) => state.account)
  const permissions = account.permissions;
  const admin_permission = permissions >= PERMISSIONS.admin;
  const callbacks = { ...props.callbacks, setSnackbar}
  const labels = [
    { 
      label: <Icon24Square4Outline />,
      value: 'control',
      title: 'Главная'
    },
    { 
      label: <Icon24CommentOutline />,
      value: 'answers',
      title: 'Ответы'
    },
    { 
      label: <Icon24ArticleOutline />,
      value: 'db_questions',
      title: 'Вопросы'
    },
    { 
      label: <Icon24UsersOutline />,
      value: 'generator',
      title: 'Генератор'
    },
    { 
      label: <Icon24Cards2Outline />,
      value: 'comments',
      title: 'Комментарии'
    },
    { 
      label: <Icon24ReportOutline />,
      value: 'reports',
      title: 'Жалобы'
    },
    { 
      label: <Icon24DoneOutline />,
      value: 'verification',
      title: 'Верификация'
    }
  ]
  const getActualPage = (activeTab) => {
    let data;
    if (activeTab === 'answers') {
      data = <Answers
      callbacks={callbacks} />
    } else if (activeTab === 'db_questions') {
      data = <Questions
      callbacks={callbacks} />
    } else if (activeTab === 'comments') {
      data = <Comments
      callbacks={callbacks} />
    } else if (activeTab === 'control') {
      data = <Control
      callbacks={callbacks} />
    } else if (activeTab === 'generator') {
      data = <Generator
        callbacks={callbacks} />
    } else if (activeTab === 'verification') {
      data = <Verification
        callbacks={callbacks} />
    } else if (activeTab === 'reports') {
      data = <Reports
        callbacks={callbacks} />
    }
    return data
  }

  return (
    <Panel id={props.id}>
      <PanelHeader
        separator={!IS_MOBILE}
      >
        {viewsStructure.Moderation.name}
      </PanelHeader>
      <Group>
        <Tabs mode='accent'>
          <HorizontalScroll>
            {(admin_permission ? labels : labels.slice(0,2)).map((label) => 
            <TabsItem
              key={label.value}
              onClick={() => setActivetab(label.value)}
              selected={activeTab === label.value}
            >
              {label.title}
            </TabsItem>)}
          </HorizontalScroll>
        </Tabs>
      </Group>

      {getActualPage(activeTab)}
      {snackbar}
    </Panel>
  )

}