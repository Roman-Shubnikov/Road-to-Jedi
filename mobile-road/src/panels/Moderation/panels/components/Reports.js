import React, { useCallback, useEffect, useState } from 'react';

import { 
    Group,
    Div,
    Placeholder,
    PullToRefresh,
    Button,
    Footer,
    List,
    PanelSpinner,
    MiniInfoCell,
    Link,
    Snackbar,
    Avatar


    } from '@vkontakte/vkui';

import {
  Icon24Spinner,
  Icon56InboxOutline,
  Icon16CheckCircle,
  Icon20CancelCircleFillRed,
  Icon20ArticleOutline,
  Icon20UserOutline,
  Icon20ServicesOutline,
  Icon28TargetOutline,
  Icon20CommentOutline,
  Icon20CommunityName,

} from '@vkontakte/icons'

import { API_URL, LINK_APP } from '../../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../../../store/main';

function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }

  const blueBackground = {
    backgroundColor: 'var(--accent)'
  };

const reasons = {
  1 : 'Оскорбление',
  2 : 'Порнография',
  3 : 'Введение в заблуждение',
  4 : 'Реклама',
  5 : 'Вредоносные ссылки',
  6 : 'Сообщение не по теме',
  7 : 'Издевательство',
  8 : 'Другое',
}
const types = [
  'Комментарий спец. агента',
  'Профиль агента',
  'Ответ агента',
  'Вопрос от генератора',
]
export default props => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(false);
  const { setSnackbar, getInfo } = props.callbacks;
  const { reports } = useSelector((state) => state.moderation.moderationData);
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);


  const reasonConverter = (reason_id) => {
    let out = '';
    try {
      out = reasons[reason_id];
    } catch (e) {
      out = 'Не знаю такой причины'
    }
    return out;
  }

  const typeReportConverter = (type_rep) => {
    let out = '';
    try {
      out = types[type_rep - 1];
    } catch (e) {
      out = 'Не знаю такой причины'
    }
    return out;
  }


  const approveDenyReport = (id_request, type) => {
    let method = (type === 'approve') ? "method=reports.approveReport&" : "method=reports.denyReport&";
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
          getInfo('reports');
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              {(type === 'approve') ? "Жалоба принята" : "Жалоба отклонена"}
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
    if (!reports.data){
      getInfo('reports');
    }
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <Group>
        <PullToRefresh onRefresh={() => { setFetching(true); getInfo('reports'); setTimeout(() => setFetching(false), 500) }} isFetching={fetching}>
          <List>
            {reports.data ? (reports.data.length > 0) ? reports.data.map((result, i) =>
              <React.Fragment key={result.id}>
                <Group mode='plain'>
                  <MiniInfoCell
                    textWrap='full'
                    before={<Icon20CommentOutline />}
                  >
                    {result.comment || "Без комментария"}

                  </MiniInfoCell>
                  {result.materials ? <MiniInfoCell
                    textWrap='full'
                    before={<Icon20ArticleOutline />}
                  >
                    {result.materials}

                  </MiniInfoCell> : null}

                  {result.vk_id ? <MiniInfoCell
                    mode='base'
                    before={<Icon20UserOutline />}>
                    <Link href={'https://vk.com/id' + result.vk_id}
                      target="_blank" rel="noopener noreferrer">1 Страница ВКонтакте</Link>
                  </MiniInfoCell> : null}
                  <MiniInfoCell
                    mode='base'
                    before={<Icon20ServicesOutline />}>
                    <Link href={LINK_APP+'#agent_id=' + result.aid}
                      target="_blank" rel="noopener noreferrer">1 Профиль в приложении</Link>
                  </MiniInfoCell>
                  {result.vk_id ? <MiniInfoCell
                    mode='base'
                    textWrap='full'
                    before={<Icon20UserOutline />}>
                    <Link href={'https://vk.com/id' + result.vk_id_reporting}
                      target="_blank" rel="noopener noreferrer">2 ВКонтакте</Link>
                  </MiniInfoCell> : null}
                  <MiniInfoCell
                    mode='base'
                    before={<Icon20ServicesOutline />}>
                    <Link href={LINK_APP+'#agent_id=' + result.id_reporting}
                      target="_blank" rel="noopener noreferrer">2 Профиль в приложении</Link>
                  </MiniInfoCell>
                  <MiniInfoCell
                    mode='base'
                    before={<Icon28TargetOutline height={20} width={20} />}>
                    {reasonConverter(result.name)}
                  </MiniInfoCell>
                  <MiniInfoCell
                    textWrap='full'
                    before={<Icon20CommunityName />}
                  >
                    {typeReportConverter(result.type)}

                  </MiniInfoCell>
                  <Div style={{ display: 'flex' }}>
                    <Button size="m"
                      onClick={() => {
                        approveDenyReport(result.id, 'approve')
                      }}>Принять</Button>
                    <Button size="m"
                      mode="secondary"
                      style={{ marginLeft: 8 }}
                      onClick={() => {
                        approveDenyReport(result.id, 'deny')
                      }}>Отклонить</Button>
                  </Div>
                </Group>
              </React.Fragment>
            ) : <Placeholder
              icon={<Icon56InboxOutline />}>
              Нет ни одной жалобы
                    </Placeholder> : <PanelSpinner />}
          </List>


          {reports.data_helper ? reports.data_helper.length === 20 ?
            <Div>
              <Button size="xl"
                level="secondary"
                before={fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                onClick={() => { setFetching(true); getInfo('reports', true); setTimeout(() => setFetching(false), 500) }}>Загрузить ещё</Button>
            </Div>
            : reports.data ?
              (reports.data.length === 0) ? null : <Footer>{reports.data.length} {enumerate(reports.data.length, [' жалоба', ' жалоб', ' жалобы'])} всего</Footer>
              : null :
            null}
        </PullToRefresh>
      </Group></>
  )
}