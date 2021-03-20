import React, { useCallback, useEffect } from 'react';

import { 
    Panel,
    PanelHeader,
    Placeholder,
    Group,
    RichCell,
    Avatar,
    PanelSpinner,
    Separator,
    UsersStack,
    Header,

    } from '@vkontakte/vkui';

import {
    Icon56Stars3Outline,
    Icon16StarCircleFillYellow,
    Icon16Verified,
    Icon16Fire,
    Icon24LifebuoyOutline,
    Icon36Users3Outline,
    Icon28UserStarBadgeOutline,
    Icon28BrainOutline,


} from '@vkontakte/icons';

import Tiles from '../../../components/menutiles';
import { useDispatch, useSelector } from 'react-redux';
import { API_URL } from '../../../config';
import { accountActions, viewsActions } from '../../../store/main';
import { enumerate, recog_number } from '../../../Utils';

export default props => {
  const dispatch = useDispatch();
  const { account, recomendations } = useSelector((state) => state.account)
  const { setPopout, showErrorAlert, goPanel, goOtherProfile } = props.callbacks;
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
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
      .catch(err => {
        setActiveStory('disconnect');

      })
  }, [dispatch, setActiveStory, setPopout, showErrorAlert])
  useEffect(() => {
    getRecomendations();
    // eslint-disable-next-line
  }, [])

  return (
    <Panel id={props.id}>
      <PanelHeader
      >
        Обзор
                </PanelHeader>
      <Group>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <a
            href='https://vk.me/special_help'
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}>
            <Tiles
              icon={<Icon24LifebuoyOutline width={36} height={36} style={{ color: '#4BB34B' }} />}>
              Поддержка
                      </Tiles>
          </a>
          <a
            href='https://vk.com/jedi_road'
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: 'inherit' }}>
            <Tiles
              icon={<Icon36Users3Outline width={36} height={36} style={{ color: '#63B9BA' }} />}>
              Сообщество
                      </Tiles>
          </a>
          <Tiles
            onClick={() => goPanel(account.donut ? 'premium' : 'donuts')}
            icon={<Icon28UserStarBadgeOutline width={36} height={36} style={{ color: '#792EC0' }} />}>
            Premium
                    </Tiles>


        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 10 }}>
          {account['generator'] && <><Tiles
            onClick={() => goPanel('new_ticket')}
            icon={<Icon28BrainOutline width={36} height={36} style={{ color: '#FFA000' }} />}>
            Генератор
                      </Tiles>
            <div style={{ visibility: 'hidden' }}>
              <Tiles
                icon={<Icon24LifebuoyOutline width={36} height={36} style={{ color: '#4BB34B' }} />}>
                Поддержка
                      </Tiles>
            </div>
            <div style={{ visibility: 'hidden' }}>
              <Tiles
                icon={<Icon24LifebuoyOutline width={36} height={36} style={{ color: '#4BB34B' }} />}>
                Поддержка
                      </Tiles>
            </div>
          </>}

        </div>

      </Group>
      <Group header={<Header>Рекомендации</Header>}>
        {recomendations ? (recomendations.length > 0) ? recomendations.map((result, i) =>
          <React.Fragment key={result.id}>
            {(i === 0) || <Separator />}
            <RichCell
              before={<Avatar size={56} src={result.avatar.url} />}
              bottom={result.followers[2] &&
                <UsersStack
                  photos={
                    result.followers[2].map((user, i) =>
                      "https://xelene.ru/road/php/images/avatars/" + user.avatar_name)
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
          <PanelSpinner />}
      </Group>
    </Panel>
  )
}