import React, { useEffect, useState } from 'react';



import { 
    Panel,
    PanelHeader,
    Group,
    Alert,
    SimpleCell,
    PanelHeaderBack,
    Switch,
    ScreenSpinner, 
    } from '@vkontakte/vkui';

    
import {
  Icon28CheckCircleOutline,
  Icon28InfoOutline,
  Icon28Notifications,

} from '@vkontakte/icons'

import { useSelector } from 'react-redux';
import { API_URL } from '../../../config';


export const SettingsPanel = props => {
  const { account } = useSelector((state) => state.account)
  const { goPanel } = props.callbacks;
  const { activeStory } = useSelector((state) => state.views)
  

  // useEffect(() => {
  //   if(account.donut && !account.donut){
  //     bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
  //   }
  // }, [account])
  return (
    <Panel id={props.id}>
      <PanelHeader
        before={
          <PanelHeaderBack onClick={() => window.history.back()} />
        }>
        Настройки
      </PanelHeader>

      <Group>

        {<SimpleCell
          indicator={account.verified ? 'Присвоена' : null}
          disabled={account.verified}
          expandable={!account.verified}
          onClick={!account.verified ? () => goPanel(activeStory, 'verf', true) : undefined}
          before={<Icon28CheckCircleOutline />}>Верификация</SimpleCell>}



      </Group>
      <Group>
        <SimpleCell
          expandable
          onClick={() => {
            goPanel(activeStory, "info", true);
          }}
          before={<Icon28InfoOutline />}>О приложении</SimpleCell>
      </Group>
    </Panel>
  )
}
// this.props.this.setSnack(
//   <Snackbar
//   layout="vertical"
//   onClose={() => this.props.this.setSnack(null)}
//   before={<Icon20CancelCircleFillRed width={24} height={24} />}
// >
//   Данный раздел ещё не готов для просмотра. Он стесняется :)
// </Snackbar>)