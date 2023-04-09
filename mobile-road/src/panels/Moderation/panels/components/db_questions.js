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
    Snackbar,
    Avatar,
    RichCell,
    ButtonGroup,
    Spacing,
    Card


    } from '@vkontakte/vkui';

import { 
  Icon56InboxOutline,
  Icon16CheckCircle,
  Icon20CancelCircleFillRed,
} from '@vkontakte/icons';

import { useState } from 'react';
import { API_URL } from '../../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../../../store/main';
import { enumerate } from '../../../../Utils';

const blueBackground = {
  backgroundColor: 'var(--accent)'
};
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


export const Questions = props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
  const { moderationData } = useSelector((state) => state.moderation)
  const [fetching, setFetching] = useState(false);
  const questions = moderationData.questions;
  const { setSnackbar, getInfo, setModerationData } = props.callbacks;

  const addDelNewRandomTicket = (ticket_id, index, type) => {
    let method = (type === 'add') ? "method=admin.approveRandomClosedQuestion&" : "method=admin.delRandomClosedQuestion&"
    fetch(API_URL + method + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'ticket_id': ticket_id,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          let MainData = {...moderationData};
          MainData.questions.data = [...MainData.questions.data.slice(0, index), ...MainData.questions.data.slice(index + 1)]
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
    if (!questions.data){
      getInfo('questions');
    }
    
    // eslint-disable-next-line
  }, [])
  return (
    <>
      <Group>
        <><PullToRefresh onRefresh={() => { setFetching(true); getInfo('questions'); setTimeout(() => setFetching(false), 500) }} isFetching={fetching}>

          <List>
            {questions.data ? (questions.data.length > 0) ? questions.data.map((result, i) =>
              <React.Fragment key={result.id}>
                {(i === 0 && !platformname) && <Spacing size={16} />}
                <Div style={{paddingTop: 0}}>
                  <Card mode='outline'>
                    <RichCell
                    disabled
                    multiline
                    actions={<ButtonGroup>
                      <Button size="m" onClick={() => {
                          addDelNewRandomTicket(result.id, i, 'add')
                        }}>
                        Отправить агентам
                      </Button>
                      <Button mode='secondary' size="m" onClick={() => {
                          addDelNewRandomTicket(result.id, i, 'del')
                        }}>
                        Удалить
                      </Button>
                    </ButtonGroup>}
                    caption={result.text}>
                      {result.title}
                    </RichCell>
                  </Card>
                </Div>
                
                
              </React.Fragment>
            ) : <Placeholder
              icon={<Icon56InboxOutline />}>
              Нет ни одного вопроса
                      </Placeholder> : <PanelSpinner />}
          </List>

          {questions.data && questions.data.length > 0 && 
          <Footer>{questions.data.length} {enumerate(questions.data.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>}
        </PullToRefresh></>
      </Group>
    </>
  )
  
}