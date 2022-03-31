import React, { useState } from 'react';
import { 
  Panel,
  PanelHeader,
  HorizontalScroll,
  Group,
  SegmentedControl,
  Div,
  } from '@vkontakte/vkui';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';
import Control from './components/control';
import Comments from './components/comments';
import DBQuestions from './components/db_questions';
import Generator from './components/generator'
import Answers from './components/answers';
import Verification from './components/verification';
import Reports from './components/Reports';
import { useSelector } from 'react-redux';
import { PERMISSIONS, viewsStructure } from '../../../config';
import { 
  Icon24Square4Outline,
  Icon24ReportOutline,
  Icon24Cards2Outline,
  Icon24CommentOutline,
  Icon24DoneOutline,
  Icon24ArticleOutline,
  Icon24UsersOutline
 } from '@vkontakte/icons';

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
export default props => {
  const [activeTab, setActivetab] = useState('control');
  const [snackbar, setSnackbar] = useState(null);
  const {
    account,
  } = useSelector((state) => state.account)
  const permissions = account.permissions;
  const admin_permission = permissions >= PERMISSIONS.admin;
  const callbacks = { ...props.callbacks, setSnackbar}
  const labels = [
    { 
      label: <Icon24Square4Outline />,
      value: 'control',
    },
    { 
      label: <Icon24CommentOutline />,
      value: 'answers',
    },
    { 
      label: <Icon24ArticleOutline />,
      value: 'db_questions',
    },
    { 
      label: <Icon24UsersOutline />,
      value: 'comments',
    },
    { 
      label: <Icon24Cards2Outline />,
      value: 'generator',
    },
    { 
      label: <Icon24ReportOutline />,
      value: 'reports',
    },
    { 
      label: <Icon24DoneOutline />,
      value: 'verification',
    }
  ]
  const getActualPage = (activeTab) => {
    let data;
    if (activeTab === 'answers') {
      data = <Answers
      callbacks={callbacks} />
    } else if (activeTab === 'db_questions') {
      data = <DBQuestions
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
        separator={!platformname}
      >
        {viewsStructure.Moderation.name}
      </PanelHeader>
      <Group>
        <Div style={{paddingBottom: 0, paddingTop: 0}}>
          <HorizontalScroll>
            <SegmentedControl 
            value={activeTab}
            onChange={e => setActivetab(e)}
            options={admin_permission ? labels : labels.slice(0,2)}/>
          </HorizontalScroll>
        </Div>
      </Group>

      {getActualPage(activeTab)}
      {snackbar}
    </Panel>
  )

}