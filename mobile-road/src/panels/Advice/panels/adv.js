import React, { useCallback, useEffect } from 'react';
import Skeleton from "react-loading-skeleton";
import { 
    Panel,
    PanelHeader,
    Placeholder,
    Group,
    RichCell,
    Avatar,
    Separator,
    UsersStack,
    Header,
    SimpleCell,

    } from '@vkontakte/vkui';

import {
    Icon56Stars3Outline,
    Icon16StarCircleFillYellow,
    Icon16Verified,
    Icon16Fire,
    Icon28Users3Outline,
    Icon28DonateOutline,
    Icon28TicketOutline,

} from '@vkontakte/icons';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL, AVATARS_URL, LINKS_VK, MESSAGE_NO_VK, PERMISSIONS } from '../../../config';
import { accountActions } from '../../../store/main';
import { enumerate, recog_number } from '../../../Utils';

export default props => {
  const dispatch = useDispatch();
  const { account, recomendations } = useSelector((state) => state.account)
  const { setPopout, showErrorAlert, goPanel, goOtherProfile } = props.callbacks;
  const { activeStory } = useSelector((state) => state.views)
  const permissions = account.permissions;
  const moderator_permission = permissions >= PERMISSIONS.special;
  const agent_permission = permissions >= PERMISSIONS.agent;
  const { goDisconnect } = props.navigation;
  const getRecomendations = useCallback(() => {
    fetch(API_URL + "method=recommendations.get&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          dispatch(accountActions.setRecomendations(data.response))
          setPopout(null);
        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(goDisconnect)
  }, [dispatch, setPopout, showErrorAlert, goDisconnect])
  useEffect(() => {
    if(agent_permission){
      getRecomendations();
    }
    
    // eslint-disable-next-line
  }, [])

  return (
    <Panel id={props.id}>
      <PanelHeader
      >
        Обзор
                </PanelHeader>
      <Group>
        <SimpleCell
        expandable
        href={LINKS_VK.communuty_jedi}
        target="_blank"
        rel="noopener noreferrer"
        before={<Icon28Users3Outline />}>
          Сообщество
        </SimpleCell>
        {agent_permission && <SimpleCell 
        expandable
        onClick={() => goPanel(activeStory, account.donut ? 'premium' : 'donuts', true)}
        before={<Icon28DonateOutline style={{ color: '#4BB34B' }} />}>
          Эксклюзивные настройки
        </SimpleCell>}
        {!account.generator && 
        <SimpleCell
        expandable
        onClick={() => {
            goPanel(activeStory, 'testingagents', true);
        }}
        before={<Icon28TicketOutline style={{color: '#F05C44'}} />}>Пройти тест на создателя вопросов</SimpleCell>}

      </Group>
      {agent_permission && <Group header={<Header>Рекомендации</Header>}>
        {recomendations ? (recomendations.length > 0) ? recomendations.map((result, i) =>
          <React.Fragment key={result.id}>
            {(i === 0) || <Separator />}
            <RichCell
              before={<Avatar size={56} src={result.avatar.url} />}
              bottom={result.followers[2] &&
                <UsersStack
                  photos={
                    result.followers[2].map((user, i) =>
                      AVATARS_URL + user.avatar_name)
                  }>
                  {result.followers[0] !== 0 ?
                    recog_number(result.followers[0]) + " " + enumerate(result.followers[0], ['подписчик', 'подписчика', 'подписчиков'])
                    : 'нет подписчиков'}
                </UsersStack>
              }
              onClick={() => goOtherProfile(result.id, true)}>
              <div style={{ display: 'flex', }}>
                {result.nickname ? result.nickname : `Агент Поддержки #${result.id}`}
                <div className="top_moderator_name_icon">
                  {result.flash ?
                    <Icon16Fire width={12} height={12} className="top_moderator_name_icon" /> : null}
                </div>
                <div className="top_moderator_name_icon">
                  {result.donut ?
                    <Icon16StarCircleFillYellow width={12} height={12} className="top_moderator_name_icon" /> : null}
                </div>
                <div className="top_moderator_name_icon_ver">
                  {result.verified ?
                    <Icon16Verified className="top_moderator_name_icon_ver" /> : null}
                </div>
              </div>
            </RichCell>
          </React.Fragment>
        )
          :
          <Placeholder
            icon={<Icon56Stars3Outline />}>
            Рекомендации пусты. Как только тут кто-то появится — обязательно подпишитесь на агента.
                  </Placeholder>
          :
          Array(3).fill().map((e,i)=>
          <RichCell
          key={i}
          bottom={<Skeleton width={70} height={18} />}
          before={<Skeleton style={{marginRight: 12}} circle={true} width={56} height={56} />}>
            <Skeleton style={{marginBottom: 4}} width={120} height={18} />
          </RichCell>)}
          {!moderator_permission ? MESSAGE_NO_VK : null}
      </Group>}
    </Panel>
  )
}