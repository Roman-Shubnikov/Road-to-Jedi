import React, { useCallback, useState } from 'react';

import { 
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell,
    HorizontalCell,
    HorizontalScroll,
    Avatar,
    Button,
    Div,
    Header,
    Snackbar,
    Switch,
    ScreenSpinner,
    Separator,
    Subhead,

 } from '@vkontakte/vkui';

import {
    Icon48DonateOutline,
    Icon16CheckCircle,
    Icon20CancelCircleFillRed,

} from '@vkontakte/icons';

// import Don from '../images/donut.svg';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, AVATARS_URL } from '../../../config';
import { viewsActions } from '../../../store/main';
const donutAvatars = [
  "1001.png",
  "1002.png",
  "1003.png",
  "1004.png",
  "1005.png",
  "1006.png",
  "1007.png",
  "1008.png",
  "1009.png",
  "1010.png",
  "1011.png",
  "1012.png",

]
const blueBackground = {
    backgroundColor: 'var(--accent)'
  };

export default props => {
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState(null);
  const { account } = useSelector((state) => state.account)
  const [selectedAvatar, selectAvatar] = useState(0);
  const [hideDonut, setHidedonut] = useState(() => (account.settings.hide_donut))
  const [colorchangeDonut, setColorchangeDonut] = useState(() => (account.settings.change_color_donut))
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const { setPopout, showErrorAlert } = props.callbacks;

  const saveSettings = (setting, value) => {
    setPopout(<ScreenSpinner />)
    fetch(API_URL + "method=settings.set&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'setting': setting,
          'value': value,
        })
      })
      .then(data => data.json())
      .then(data => {
        if (data.result) {
          setPopout(null)
          setTimeout(() => {
            props.reloadProfile();
          }, 4000)
        } else {
          showErrorAlert(data.error.message);
        }
      })
      .catch(err => {
        setActiveStory('disconnect');
      })
  }

  const hide_donut = (check) => {
    check = check.currentTarget.checked;
    setHidedonut(check);
    saveSettings('hide_donut', Number(!check))
  }
  const needChangeColor = (check) => {
    check = check.currentTarget.checked;
    setColorchangeDonut(check);
    saveSettings('change_color_donut', Number(check))
  }

  const changeAvatar = () => {
    fetch(API_URL + "method=shop.changeDonutAvatars&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        // signal: controllertime.signal,
        body: JSON.stringify({
          'avatar_id': Number(selectedAvatar),
        })
      })
      .then(data => data.json())
      .then(data => {
        selectAvatar(0);
        if (data.result) {
          setSnackbar(<Snackbar
            layout="vertical"
            onClose={() => setSnackbar(null)}
            before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
          >
            Аватар успешно сменен
                </Snackbar>)

          setTimeout(() => {
            props.reloadProfile();
          }, 4000)
        } else {
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Icon20CancelCircleFillRed width={24} height={24} />}
            >
              {data.error.message}
            </Snackbar>);
        }
      })
      .catch(err => {
        setActiveStory('disconnect');
      })
  }
  return (
    <Panel id={props.id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}>
        Premium
                </PanelHeader>
      <Group>
        {/* <Placeholder
          icon={<img src={Don} alt='jedi' />}>
        </Placeholder> */}
        <SimpleCell
          disabled
          after={
            <Switch
              checked={hideDonut}
              onChange={(e) => hide_donut(e)} />
          }
        >
          Отметка VK Donut
                    </SimpleCell>
        <Div>
          <Subhead weight='regular' className='SimpleCell__description'>
            После активации данной функции, в Вашем профиле, около имени, появится эксклюзивная отметка
                      </Subhead>
        </Div>
        <Separator />
        <SimpleCell
          disabled
          after={
            <Switch
              checked={colorchangeDonut}
              onChange={(e) => needChangeColor(e)} />
          }
        >
          Цвет ника
                    </SimpleCell>
        <Div>
          <Subhead weight='regular' className='SimpleCell__description'>
            После активации данной функции в общем Пантеоне, Ваш ник будет отображаться цветом доната
                      </Subhead>
        </Div>
        <SimpleCell disabled indicator={account.donuts}>Пончики</SimpleCell>
      </Group>
      {/* <Group>
        {account.donut_chat_link && <SimpleCell
          expandable
          href={account.donut_chat_link}
          target="_blank" rel="noopener noreferrer"
          before={<Icon48DonateOutline width={28} height={28} />}>
          Чат для донов
                    </SimpleCell>}
        <SimpleCell
          href={LINKS_VK.donut_article}
          target="_blank" rel="noopener noreferrer"
          before={<Icon28UserStarBadgeOutline />}>
          Уникальный контент VK Donut
                    </SimpleCell>

      </Group> */}
      <Group header={<Header>Эксклюзивные аватарки</Header>}>
        {/* <Placeholder
        icon={<Icon56ErrorTriangleOutline />}>
          Раздел временно недоступен
        </Placeholder> */}


        <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
          <div style={{ display: 'flex' }}>
            {donutAvatars.map((ava, i) =>
              <HorizontalCell key={i} size='m'
                className={((i + 1) === selectedAvatar) ? 'select_avatar' : ''}
                onClick={(e) => (account.avatar.id === i + 1 + 1000) ? setSnackbar(
                  <Snackbar
                    layout="vertical"
                    onClose={() => setSnackbar(null)}
                    before={<Icon20CancelCircleFillRed width={24} height={24} />}
                  >
                    Вы уже имеете данный аватар
                    </Snackbar>) : (selectedAvatar === (i + 1)) ? selectAvatar(0) : selectAvatar(i + 1)}>
                <Avatar id={i} size={88} src={AVATARS_URL + ava} />

              </HorizontalCell>)}
          </div>
        </HorizontalScroll>
        <Div>
          <Button onClick={changeAvatar}
            before={<Icon48DonateOutline width={28} height={28} />}
            size="l"
            stretched
            mode="secondary"
            disabled={selectedAvatar === 0}>Сменить за 50 пончиков</Button>
        </Div>
      </Group>
      {snackbar}
    </Panel>
  )
}