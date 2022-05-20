import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige


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


export default props => {
  const { account } = useSelector((state) => state.account)
  const [notify, setNotify] = useState(account ? account.settings.notify : false)
  const { setPopout, showErrorAlert, goPanel } = props.callbacks;
  const { goDisconnect } = props.navigation;
  const { activeStory } = useSelector((state) => state.views)
  const notifyMenager = (value) => {
    fetch(API_URL + "method=settings.set&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'setting': 'notify',
          'value': Number(value),
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setNotify(value)
          setPopout(null)
        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(goDisconnect)
  }
  const changeNotifStatus = (notif) => {
    notif = notif.currentTarget.checked;
    setPopout(<ScreenSpinner />)
    if (notif) {
      setPopout(<Alert
        actionsLayout='horizontal'
        actions={[{
          title: 'Разрешить',
          autoclose: true,
          mode: 'default',
          action: () => {
            bridge.send("VKWebAppAllowMessagesFromGroup", { "group_id": 188280516 })
              .then(data => {
                setNotify(true)
                notifyMenager(true)
                setTimeout(() => {
                  props.reloadProfile()
                }, 1000)

              })
              .catch(() => { notifyMenager(false) })
          },
        }, {
          title: 'Нет, спасибо',
          autoclose: true,
          mode: 'cancel',
          action: () => { notifyMenager(false) },

        },]}
        onClose={() => setPopout(null)}
        header="Внимание!"
        text="Включая уведомления, Вы соглашаетесь что они могут приходить вам неограниченное кол-во раз, 
            в неогранниченный промежуток времени (по возможности и в соответствии с вашими действиями в приложении), но для этого нам нужен доступ к ним. 
            Если вы не согласны с данным условием, то не включайте их.
            Вы всегда можете их отключить. 
            Хотите получать уведомления?"
      />)
    } else {
      bridge.send("VKWebAppDenyNotifications")
        .then(data => {
          notifyMenager(false)
          setTimeout(() => {
            props.reloadProfile()
          }, 1000)
        }).catch(() => {
          notifyMenager(true)
        })

    }
  }

  useEffect(() => {
    if(account.donut && !account.donut){
      bridge.send("VKWebAppShowNativeAds", {ad_format:"reward"})
    }
  }, [account])
  return (
    <Panel id={props.id}>
      <PanelHeader
        left={
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

        <SimpleCell
          before={<Icon28Notifications />}
          disabled
          after={
            <Switch
              checked={notify}
              onChange={(e) => changeNotifStatus(e)} />
          }>Получать уведомления</SimpleCell>

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