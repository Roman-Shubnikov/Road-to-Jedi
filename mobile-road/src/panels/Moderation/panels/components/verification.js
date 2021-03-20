import React, { useCallback, useEffect, useState } from 'react';

import { 
    Group,
    Div,
    SimpleCell,
    Placeholder,
    PullToRefresh,
    Button,
    Footer,
    List,
    PanelSpinner,
    MiniInfoCell,
    Separator,
    Link,
    Snackbar,
    Avatar


    } from '@vkontakte/vkui';
import Icon24Spinner                      from '@vkontakte/icons/dist/24/spinner';
import Icon56InboxOutline                 from '@vkontakte/icons/dist/56/inbox_outline';
import Icon16CheckCircle                  from '@vkontakte/icons/dist/16/check_circle';
import Icon20CancelCircleFillRed          from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon20ArticleOutline               from '@vkontakte/icons/dist/20/article_outline';
import Icon20UserOutline                  from '@vkontakte/icons/dist/20/user_outline';
import Icon20ServicesOutline              from '@vkontakte/icons/dist/20/services_outline';
import { API_URL } from '../../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../../../store/main';
import { enumerate } from '../../../../Utils';

const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
  const { moderationData } = useSelector((state) => state.moderation)
  const [fetching, setFetching] = useState(false);
  const { verification } = useSelector((state) => state.moderation.moderationData);
  const { setSnackbar, getInfo, setModerationData } = props.callbacks;

  const approveDenyVerification = (id_request, index, type) => {
    let method = (type === 'approve') ? "method=admin.approveVerificationRequest&" : "method=admin.denyVerificationRequest&";
    fetch(API_URL + method + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'id_request': id_request,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          let MainData = { ...moderationData };
          MainData.verification.data = [...MainData.verification.data.slice(0, index), ...MainData.verification.data.slice(index + 1)]
          setModerationData(MainData)
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              {(type === 'approve') ? "Профиль верифицирован" : "В верификации отказано"}
                  </Snackbar>
          )
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
        setActiveStory('disconnect')
      })
  }
  useEffect(() => {
    if (!verification.data){
      getInfo('verification');
    }
    
    // eslint-disable-next-line
  }, [])
  return (
    <>
      <Group>
        <PullToRefresh onRefresh={() => { setFetching(true); getInfo('verification'); setTimeout(() => setFetching(false), 500) }} isFetching={fetching}>
          <List>
            {verification.data ? (verification.data.length > 0) ? verification.data.map((result, i) =>
              <React.Fragment key={result.id}>
                {(i === 0) || <Separator />}
                <SimpleCell disabled multiline>{result.title}</SimpleCell>
                <MiniInfoCell
                  textWrap='full'
                  before={<Icon20ArticleOutline />}
                >
                  {result.description}

                </MiniInfoCell>
                {result.vk_id ? <MiniInfoCell
                  mode='base'
                  before={<Icon20UserOutline />}>
                  <Link href={'https://vk.com/id' + result.vk_id}
                    target="_blank" rel="noopener noreferrer">Страница ВКонтакте</Link>
                </MiniInfoCell> : null}
                <MiniInfoCell
                  mode='base'
                  before={<Icon20ServicesOutline />}>
                  <Link href={'https://vk.com/jedi_road_app#agent_id=' + result.aid}
                    target="_blank" rel="noopener noreferrer">Профиль в приложении</Link>
                </MiniInfoCell>
                <Div style={{ display: 'flex' }}>
                  <Button size="m"
                    stretched
                    onClick={() => {
                      approveDenyVerification(result.id, i, 'approve')
                    }}>Принять</Button>
                  <Button size="m"
                    stretched
                    mode="secondary"
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      approveDenyVerification(result.id, i, 'deny')
                    }}>Отклонить</Button>
                </Div>
              </React.Fragment>
            ) : <Placeholder
              icon={<Icon56InboxOutline />}>
              Заявок нет
                    </Placeholder> : <PanelSpinner />}
          </List>


          {verification.data_helper ? verification.data_helper.length === 20 ?
            <Div>
              <Button size="l"
                stretched
                level="secondary"
                before={fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                onClick={() => { setFetching(true); getInfo('verification', true); setTimeout(() => setFetching(false), 500) }}>Загрузить ещё</Button>
            </Div>
            : verification.data ?
              (verification.data.length === 0) ? null : <Footer>{verification.data.length} {enumerate(verification.data.length, [' заявка', ' заявки', ' заявок'])} всего</Footer>
              : null :
            null}
        </PullToRefresh>
      </Group></>

  )
}