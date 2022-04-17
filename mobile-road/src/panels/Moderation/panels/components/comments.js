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
    Snackbar,
    Avatar,
    MiniInfoCell,
    Spinner,
    SimpleCell,
    Spacing,
    Search,
    Card,


    } from '@vkontakte/vkui';

import { 
  Icon56InboxOutline,
  Icon20MessageOutline,
  Icon20CheckCommentOutline,
  Icon20ClockOutline,
  Icon20ErrorCircleOutline,
  Icon20CheckCircleOutline,
  Icon20MasksOutline,
  Icon20UserReplyOutline,
  Icon16CheckCircle,
  Icon20CancelCircleFillRed,

} from '@vkontakte/icons';
import { API_URL, blueBackground, IS_MOBILE } from '../../../../config';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../../../store/main';
import { enumerate, LinkHandler } from '../../../../Utils';
  
export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
  const { moderationData } = useSelector((state) => state.moderation)
  const [fetching, setFetching] = useState(false);
  const [search, setSearch] = useState('');
  const { comments } = useSelector((state) => state.moderation.moderationData);

  const { setSnackbar, getInfo, setModerationData } = props.callbacks;
  
  const getWaitingElement = (mark) => {
    if(mark === -1) {
      return <MiniInfoCell
      before={<Icon20ClockOutline />}>
        Ответ ожидает оценки
      </MiniInfoCell>
    } else if (mark === 1) {
      return <MiniInfoCell
      before={<Icon20CheckCircleOutline />}>
        Ответ оценен положительно
      </MiniInfoCell>
    } else if (mark === 0) {
      return <MiniInfoCell
      before={<Icon20ErrorCircleOutline />}>
        Ответ оценен отрицательно
      </MiniInfoCell>
    }
  }
  const editComment  = (message_id, index, type) => {
    fetch(API_URL + "method=ticket.unmarkMessage&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'message_id': message_id,
        })
      })
      fetch(API_URL + "method=ticket.deleteComment&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'message_id': message_id,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          let MainData = {...moderationData};
          MainData.comments.data = [...MainData.comments.data.slice(0, index), ...MainData.comments.data.slice(index + 1)]
          setModerationData(MainData)
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              Оценка и комментарий сброшены
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
    if (!comments.data){
      getInfo('comments', false, search);
    }
    
    // eslint-disable-next-line
  }, [])
  useEffect(() => {
    getInfo('comments', false, search);
    
    // eslint-disable-next-line
  }, [search])
  return (
    <>
      <Group>
        <Search value={search}
            onChange={(e) => {
                setSearch(e.currentTarget.value)
            }} />
        <PullToRefresh onRefresh={() => { setFetching(true); getInfo('comments', false, search); setTimeout(() => setFetching(false), 500) }} isFetching={fetching}>
          <List>
            {comments.data ? (comments.data.length > 0) ? comments.data.map((result, i) =>
              <React.Fragment key={result.id}>
                {(i === 0 && !IS_MOBILE) && <Spacing size={16} />}
                <Div style={{paddingTop: 0}}>
                  <Card mode='outline'>
                    <Div>
                      <Card>
                        <SimpleCell
                        multiline
                        before={<Avatar src={result.avatar.avatar_name} />}
                        disabled>
                          <span style={{color: '#818C99'}}>
                            <span style={{color: 'var(--accent)'}}>
                              Специальный агент #{result.comment_author_id}
                            </span> оставил комментарий в вопросе <span style={{color: 'var(--accent)'}}>#{result.ticket_id}</span>
                          </span>
                        </SimpleCell>
                      </Card>
                      
                    </Div>
                    <MiniInfoCell
                    textWrap="full"
                    className='moderation_cards-texts'
                    before={<Icon20MessageOutline />}
                    >
                      {result.text}
                    </MiniInfoCell>
                    <Spacing />
                    <MiniInfoCell
                    className='moderation_cards-texts'
                    textWrap="full"
                    before={<Icon20CheckCommentOutline />}
                    >
                      {result.comment}
                    </MiniInfoCell>
                    <Spacing separator />
                    <MiniInfoCell
                    before={<Icon20UserReplyOutline />}>
                      <LinkHandler href={'https://vk.com/id' + result.agent_vk}>
                        Агент Поддержки
                      </LinkHandler> 
                    </MiniInfoCell>
                    <MiniInfoCell
                    before={<Icon20MasksOutline />}>
                      <LinkHandler href={'https://vk.com/id' + result.special_vk}>
                        Специальный агент
                      </LinkHandler>
                    </MiniInfoCell>
                    {getWaitingElement(result.mark)}
                    <Div>
                        <Button
                        size='m'
                        onClick={() => editComment(result.id, i)}>
                          Обнулить комментарий и оценку
                        </Button>
                      
                    </Div>
                  </Card>
                </Div>
              </React.Fragment>
            ) : 
            <Placeholder
              icon={<Icon56InboxOutline />}>
              Нет ни одного комментария
                      </Placeholder>
                       : <PanelSpinner />}
          </List>


          {comments.data_helper ? comments.data_helper.length === 20 ?
            <Div>
              <Button size="l"
                stretched
                level="secondary"
                before={fetching && <Spinner />}
                onClick={() => { setFetching(true); getInfo('comments', true, search); setTimeout(() => setFetching(false), 500) }}>Загрузить ещё</Button>
            </Div>
            : comments.data ?
              (comments.data.length === 0) ? null : <Footer>{comments.data.length} {enumerate(comments.data.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
              : null :
            null}
        </PullToRefresh>
      </Group>
    </>
  )
  
}