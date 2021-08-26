import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige


import { 
    Panel,
    PanelHeader,
    Group,
    Alert,
    Counter,
    SimpleCell,
    PanelHeaderBack,
    Switch,
    ScreenSpinner, 
    } from '@vkontakte/vkui';

    
import {
  Icon28DoneOutline,
  Icon28CoinsOutline,
  Icon28PaletteOutline,
  Icon28InfoOutline,
  Icon28Notifications,
  Icon28GestureOutline,

} from '@vkontakte/icons'

import { useSelector } from 'react-redux';
import { API_URL, PERMISSIONS } from '../../../config';


export default props => {
  const { account } = useSelector((state) => state.account)
  const [notify, setNotify] = useState(account ? account.settings.notify : false)
  const [publicProfile, setPublic] = useState(account ? account.settings.public : false)
  const { setPopout, showErrorAlert, goPanel } = props.callbacks;
  const permissions = account.permissions;
  const agent_permission = permissions >= PERMISSIONS.agent;
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
  const publicProfileTry = (showAlert = true) => {
    if (showAlert) {
      setPopout(
        <Alert
          actionsLayout="horizontal"
          actions={[{
            title: 'Отмена',
            autoclose: true,
            mode: 'cancel'
          }, {
            title: 'Хочу',
            autoclose: true,
            action: () => publicProfileTry(false),
            mode: 'destructive',
          }]}
          onClose={() => setPopout(null)}
          header="Вы действительно хотите открыть свой профиль"
          text="После публикации профиля, все смогут видеть вашу настоящую страницу ВК. Вы действительно хотите опубликовать его?"
        />)
    } else {
      fetch(API_URL + "method=settings.set&" + window.location.search.replace('?', ''),
        {
          method: 'post',
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify({
            'setting': 'public',
            'value': Number(!publicProfile),
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.result) {
            setPublic(prev => !prev)
            setTimeout(() => {
              props.reloadProfile()
            }, 1000)
          } else {
            showErrorAlert(data.error.message)
          }
        }).catch(goDisconnect)
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
      {/* <Group>
        <SimpleCell
          disabled
          indicator={account.age}
          before={<Icon28TargetOutline />}>Ваш возраст</SimpleCell>
      </Group> */}

      <Group>
        <SimpleCell
          before={<Icon28PaletteOutline />}
          expandable
          onClick={() => goPanel(activeStory, 'schemechange', true)}>Смена темы</SimpleCell>

        {agent_permission && <SimpleCell
          indicator={account.verified ? 'Присвоена' : null}
          disabled={account.verified}
          expandable={!account.verified}
          onClick={!account.verified ? () => goPanel(activeStory, 'verf', true) : undefined}
          before={<Icon28DoneOutline />}>Верификация</SimpleCell>}

        <SimpleCell
          before={<Icon28Notifications />}
          disabled
          after={
            <Switch
              checked={notify}
              onChange={(e) => changeNotifStatus(e)} />
          }>Получать уведомления</SimpleCell>

        {agent_permission && <SimpleCell
          before={<Icon28GestureOutline />}
          disabled
          after={
            <Switch
              checked={publicProfile}
              onChange={() => publicProfileTry(publicProfile === false)} />
          }
        >
          Публичный профиль
                  </SimpleCell>}
      </Group>
      <Group>
        {agent_permission && <SimpleCell
          disabled
          indicator={<Counter>{account.balance}</Counter>}
          before={<Icon28CoinsOutline />}>Баланс</SimpleCell>}
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