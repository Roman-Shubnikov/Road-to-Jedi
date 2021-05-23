import React, { useState } from 'react';
import { 
  Panel,
  PanelHeader,
  Tabs,
  TabsItem,
  HorizontalScroll,
  Group,
  } from '@vkontakte/vkui';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';
import Generator from './components/generator'
import Answers from './components/answers';
import Verification from './components/verification';
import Reports from './components/Reports';
import { useSelector } from 'react-redux';
import { PERMISSIONS } from '../../../config';

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
export default props => {
  const [activeTab, setActivetab] = useState('answers');
  const [snackbar, setSnackbar] = useState(null);
  const {
    account,
  } = useSelector((state) => state.account)
  const permissions = account.permissions;
  const admin_permission = permissions >= PERMISSIONS.admin;
  const callbacks = { ...props.callbacks, setSnackbar}

  const getActualPage = (activeTab) => {
    let data;
    if (activeTab === 'answers') {
      data = <Answers
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
        Модерация
                </PanelHeader>
      <Group>
        <Tabs>
          <HorizontalScroll>
            <TabsItem
              onClick={() => setActivetab('answers')}
              selected={activeTab === 'answers'}
            >
              Ответы
                        </TabsItem>
            <TabsItem
              onClick={() => setActivetab('generator')}
              selected={activeTab === 'generator'}
            >
              Вопросы
                        </TabsItem>
            {admin_permission ? <TabsItem
              onClick={() => setActivetab('reports')}
              selected={activeTab === 'reports'}
            >
              Жалобы
                        </TabsItem> : null}
            {admin_permission ? <TabsItem
              onClick={() => setActivetab('verification')}
              selected={activeTab === 'verification'}
            >
              Верификация
                        </TabsItem> : null}
          </HorizontalScroll>
        </Tabs>

      </Group>

      {getActualPage(activeTab)}
      {snackbar}
    </Panel>
  )

}