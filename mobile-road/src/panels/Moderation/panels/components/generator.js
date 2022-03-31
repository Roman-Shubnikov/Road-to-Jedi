import React, { useCallback, useEffect } from 'react';

import { 
    Group,
    Div,
    Placeholder,
    PullToRefresh,
    Button,
    Footer,
    List,
    PanelSpinner,
    Separator,
    Snackbar,
    Avatar,
    MiniInfoCell


    } from '@vkontakte/vkui';

import { 
  Icon24Spinner,
  Icon56InboxOutline,
  Icon16CheckCircle,
  Icon20CancelCircleFillRed,
  Icon20ArticlesOutline,
  Icon20BookmarkOutline,
} from '@vkontakte/icons';

import { useState } from 'react';
import { API_URL } from '../../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../../../store/main';
import { enumerate } from '../../../../Utils';
import { GreenCard } from '../../../../components/GreenCard';

  const blueBackground = {
    backgroundColor: 'var(--accent)'
  };

export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
  const { moderationData } = useSelector((state) => state.moderation)
  const [fetching, setFetching] = useState(false);
  const { generator } = useSelector((state) => state.moderation.moderationData);
  const {
    account
  } = useSelector((state) => state.account);
  const { setSnackbar, getInfo, setReport, setModerationData } = props.callbacks;

  const addDelNewTicket = (id_ticket, index, type) => {
    let method = (type === 'add') ? "method=special.approveModerationTicket&" : "method=special.delModerationTicket&"
    fetch(API_URL + method + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'id_ans': id_ticket,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          let MainData = {...moderationData};
          MainData.generator.data = [...MainData.generator.data.slice(0, index), ...MainData.generator.data.slice(index + 1)]
          setModerationData(MainData)
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              {(type === 'add') ? "Вопрос одобрен" : "Вопрос удалён"}
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
    if (!generator.data){
      getInfo('generator');
    }
    
    // eslint-disable-next-line
  }, [])
  return (
    <>
      <Group>
        
        <><PullToRefresh onRefresh={() => { setFetching(true); getInfo('generator'); setTimeout(() => setFetching(false), 500) }} isFetching={fetching}>

          <List>
            {generator.data ? (generator.data.length > 0) ? generator.data.map((result, i) =>
              <React.Fragment key={result.id}>
                {(i === 0) || <Separator />}
                <MiniInfoCell
                  before={<Icon20BookmarkOutline />}
                  textWrap='full'>
                  {result.title}
                </MiniInfoCell>
                <MiniInfoCell
                  before={<Icon20ArticlesOutline />}
                  textWrap='full'>
                  {result.description}
                </MiniInfoCell>
                <Div style={{ display: 'flex', paddingBottom: 0 }}>
                  <Button size="m"
                    stretched
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      addDelNewTicket(result.id, i, 'add')
                    }}>Принять</Button>
                  <Button size="m"
                    stretched
                    mode="secondary"
                    onClick={() => {
                      addDelNewTicket(result.id, i, 'del')
                    }}>Отклонить</Button>
                </Div>
                <Div style={{ paddingTop: 8 }}>
                  <Button size="m"
                    mode='destructive'
                    stretched
                    onClick={() => {
                      setReport(4, result.id) // Вопрос генератора
                    }}>Пожаловаться</Button>
                </Div>
              </React.Fragment>
            ) : <Placeholder
              icon={<Icon56InboxOutline />}>
              Нет ни одного сгенерированного вопроса
                      </Placeholder> : <PanelSpinner />}
          </List>


          {generator.data_helper ? generator.data_helper.length === 20 ?
            <Div>
              <Button size="l"
                stretched
                level="secondary"
                before={fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                onClick={() => { setFetching(true); getInfo('generator', true); setTimeout(() => setFetching(false), 500) }}>Загрузить ещё</Button>
            </Div>
            : generator.data ?
              (generator.data.length === 0) ? null : <Footer>{generator.data.length} {enumerate(generator.data.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
              : null :
            null}
        </PullToRefresh></>
      </Group>
    </>
  )
  
}