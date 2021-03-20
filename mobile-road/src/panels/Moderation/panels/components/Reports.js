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
import Icon28TargetOutline                from '@vkontakte/icons/dist/28/target_outline';
import Icon20CommentOutline               from '@vkontakte/icons/dist/20/comment_outline';
import Icon20CommunityName                from '@vkontakte/icons/dist/20/community_name';
import { API_URL } from '../../../../config';
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
                {(i === 0) || <Separator />}
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
                  <Link href={'https://vk.com/jedi_road_app#agent_id=' + result.aid}
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
                  <Link href={'https://vk.com/jedi_road_app#agent_id=' + result.id_reporting}
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
              </React.Fragment>
            ) : <Placeholder
              icon={<Icon56InboxOutline />}>
              Жалоб нет
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