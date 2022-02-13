import React, { useState } from 'react';

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
import { useSelector } from 'react-redux';
import { API_URL, AVATARS_URL } from '../../../config';

export const RequestsMain = props => {
  const { account } = useSelector((state) => state.account)
  const [selectedAvatar, selectAvatar] = useState(0);
  const { goDisconnect } = props.navigation;

  return (
    <Panel id={props.id}>
      <PanelHeader
        left={<PanelHeaderBack onClick={() => window.history.back()} />}>
        Заявки
      </PanelHeader>
      <Group>

      </Group>
    </Panel>
  )
}