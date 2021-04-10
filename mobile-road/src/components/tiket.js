import React, { useCallback, useEffect, useRef, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import $ from 'jquery';
import { 
    Panel,
    PanelHeader,
    FixedLayout,
    Div,
    ScreenSpinner,
    ActionSheet,
    ActionSheetItem,
    PanelHeaderBack,
    Separator,
    WriteBarIcon,
    WriteBar,
    FormStatus,
    Snackbar,
    Avatar,
    Group,
    PanelSpinner,
    PanelHeaderButton,
    Text,
    } from '@vkontakte/vkui';

import { 
  Icon28SlidersOutline,
  Icon16StarCircleFillYellow,
  Icon16CheckCircle,
  Icon16ReplyOutline,
  Icon28UserSquareOutline,
  Icon28ReportOutline,
  Icon28CopyOutline,
  Icon28CommentOutline,
  Icon28DoneOutline,
  Icon28CancelOutline,
  Icon28CheckCircleOutline,
  Icon28DeleteOutline,
  Icon28WriteOutline,
  Icon28CommentDisableOutline,

  

 } from '@vkontakte/icons';

// import Moderator_img from '../images/10007.png'

import Message from './message'
import { useDispatch, useSelector } from 'react-redux';
import { accountActions, FetchFatalError, ForceErrorBackend, ticketActions, viewsActions } from '../store/main';
import { getHumanyTime, LinkHandler } from '../Utils';
import { API_URL } from '../config';
// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const queryString = require('query-string');
const parsedHash = queryString.parse(window.location.search.replace('?', ''));

const blueBackground = {
  backgroundColor: 'var(--accent)'
};
export default props => {
  const dispatch = useDispatch();
  const { setPopout, showErrorAlert, setReport, setActiveModal, showAlert, goOtherProfile } = props.callbacks;
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
  const getTicket = useCallback((id) => {
    try {
      dispatch(ticketActions.getTicket(id))
    } catch (error) {
      if (error instanceof FetchFatalError) setActiveStory('disconnect');
      if (error instanceof ForceErrorBackend) showErrorAlert(error.message);
    }
    // eslint-disable-next-line
  }, [dispatch])
  const setComment = useCallback((comment) => dispatch(ticketActions.setComment(comment)), [dispatch])
  const MessageRef = useRef(null);
  const [add_comment, setAddComment] = useState(false);
  const [messageIdChanged, setMessageIdChanged] = useState(0);
  const [edit_comment, setEditComment] = useState(false);
  const [redaction, setRedaction] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [sendfield, setSendfield] = useState('');
  

  
  const TicketData = useSelector((state) => state.tickets.ticketInfo)
  const account = useSelector((state) => (state.account.account))
  const { info, messages, limitReach} = TicketData;

  const setContinueSnack = (text) => {
    setSnackbar(<Snackbar
      layout="vertical"
      before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
      onClose={() => setSnackbar(null)}>
      {text}
            </Snackbar>)
  }
  const getAvatar = (result) => {
    if (result.author.is_moderator){
      return result.author.avatar.url
    } else {
      return result.author.photo_200
    }
  }
  const getAuthorName = (result) => {
    if (result.author.is_moderator){
      if (result.nickname) {
        return result.nickname
      } else {
        return `Агент Поддержки #${result.author.id}`
      }
    } else {
      return result.author.first_name + " " + result.author.last_name
    }
    
  }
  const markMessage = (mark, message_id, typeSend) => {
    let method;
    switch (typeSend) {
      case "mark":
        method = "method=ticket.markMessage&";
        break;
      case "unmark":
        method = "method=ticket.unmarkMessage&";
        break;
      case "approve":
        method = "method=ticket.approveReply&";
        break;
      case "delete":
        method = "method=ticket.deleteMessage&";
        break;
      default:
        method = "method=ticket.markMessage&";
    }

    fetch(API_URL + method + window.location.search.replace('?', ''),
      {method: 'post',
      headers: {"Content-type": "application/json; charset=UTF-8"},
      body: JSON.stringify({
        'message_id': message_id,
        'mark': mark,
      })
        })
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            getTicket(info.id)
          }else {
            showErrorAlert(data.error.message)
          }
        })
        .catch(err => {
          setActiveStory('disconnect')

        })
      }
  const Admin = (approved, id, chance_posit, author_id, text, comment, avatar = null, mark = -1) => {
    let special = account.special;
    if (author_id > 0) {
      setPopout(
        <ActionSheet onClose={() => setPopout(null)}
          toggleRef={MessageRef.current}
          iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
          {author_id > 0 ?
            <ActionSheetItem 
            before={<Icon28UserSquareOutline />}
            autoclose onClick={() => { goOtherProfile(author_id); }}>
              Профиль
              </ActionSheetItem>
            : null}
          {special && mark === -1 && author_id > 0 ?
            <ActionSheetItem autoclose onClick={() => markMessage(1, id, "mark")}
            subtitle={<Text onClick={(e) => e.stopPropagation()} style={{whiteSpace: "pre-wrap"}}>Вероятность положительной оценки: {chance_posit / 10}%{"\n"}<LinkHandler href='https://vk.com/@team.jedi-glossarik-dlya-specialnyh-agentov?anchor=veroyatnost-otsenivania-otvetov-eto-chto-takoe'>
              Подробнее
              </LinkHandler></Text>}
            before={<Icon28DoneOutline />}>
              Оценить положительно
              </ActionSheetItem>
            : null}
          {special && mark === -1 && author_id > 0 && !(comment === null || comment === undefined) ?
            <ActionSheetItem autoclose 
            before={<Icon28CancelOutline />}
            onClick={() => markMessage(0, id, "mark")}>
              Оценить отрицательно
              </ActionSheetItem>
            : null}
          {special && mark !== -1 && author_id > 0 ?
            <ActionSheetItem autoclose
            before={<Icon28DeleteOutline />} 
            onClick={() => markMessage(0, id, "unmark")}>
              Удалить оценку
              </ActionSheetItem>
            : null}
          {(special && author_id > 0 && !approved) ?
            <ActionSheetItem autoclose 
            before={<Icon28CheckCircleOutline />}
            onClick={() => markMessage(0, id, "approve")}>
              Одобрить
              </ActionSheetItem>
            : null}
          {(special && (comment === null || comment === undefined)) ?
            <ActionSheetItem autoclose 
            before={<Icon28CommentOutline/>}
            onClick={() => {setAddComment(true); setMessageIdChanged(id)}}>
              Добавить комментарий
              </ActionSheetItem>
            : null}
          {(special && !(comment === null || comment === undefined)) ?
            <ActionSheetItem autoclose 
            before={<Icon28WriteOutline />}
            onClick={() => { setSendfield(comment);setMessageIdChanged(id);setEditComment(true)}}>
              Редактировать комментарий
              </ActionSheetItem>
            : null}
          {(special && !(comment === null || comment === undefined)) ?
            <ActionSheetItem autoclose 
            before={<Icon28CommentDisableOutline />} 
            onClick={() => QuickMenagerMessages(id, 'delete_coment')}>
              Удалить комментарий
              </ActionSheetItem>
            : null}
          {(Number(author_id === account.id) && info['status'] === 0 && mark === -1 && !approved) ?
            <ActionSheetItem autoclose 
            onClick={() => { setRedaction(true); setMessageIdChanged(id); setSendfield(text)}}>
              Редактировать
             </ActionSheetItem>
            : null}
          <ActionSheetItem autoclose onClick={() => {
            bridge.send("VKWebAppCopyText", { text: text });
            setContinueSnack("Текст скопирован")
          }}
          before={<Icon28CopyOutline/>}>
            Скопировать текст
                </ActionSheetItem>
          {(Number(author_id) === Number(account.id) && mark !== -1) ?
            <ActionSheetItem 
            autoclose 
            mode='destructive'
            before={<Icon28DeleteOutline />} 
            onClick={() => markMessage(0, id, "delete")}>
              Удалить сообщение
                </ActionSheetItem>
            : null}
          {account.special ?
            <ActionSheetItem autoclose mode='destructive'
            before={<Icon28ReportOutline />}
              onClick={() => setReport(3, id)}>
              Пожаловаться
              </ActionSheetItem>
            : null}
        </ActionSheet>
      )
    } else {
      if (account.special) {
        setPopout(
          <ActionSheet onClose={() => setPopout(null)}
            toggleRef={MessageRef.current}
            iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
            <ActionSheetItem autoclose onClick={() => { dispatch(accountActions.getOtherProfile(author_id)); setActiveModal('ban_user'); }}>
              Забанить пользователя
                </ActionSheetItem>
            {(Number(author_id === account.id) && info.status === 0) ?
              <ActionSheetItem autoclose 
              before={<Icon28WriteOutline />}
              onClick={() => {setRedaction(true);setMessageIdChanged(id);setSendfield(text)}}>
                Редактировать
               </ActionSheetItem>
              : null}
            <ActionSheetItem autoclose onClick={() => {
              bridge.send("VKWebAppCopyText", { text: text });
              setContinueSnack("Текст скопирован")
            }}
            before={<Icon28CopyOutline/>}>
              Скопировать текст
            </ActionSheetItem>
            <ActionSheetItem autoclose mode='destructive' onClick={() => markMessage(0, id, "delete")}>
              Удалить сообщение
            </ActionSheetItem>
          </ActionSheet>
        )
      } else {
        if (Number(author_id === account.id)) {
          setPopout(
            <ActionSheet onClose={() => setPopout(null)}
              toggleRef={MessageRef.current}
              iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
              {(Number(author_id === account.id) && info['status'] === 0) ?
                <ActionSheetItem autoclose 
                before={<Icon28WriteOutline />}
                onClick={() => { setRedaction(true); setMessageIdChanged(id); setSendfield(text) }}>
                  Редактировать
                 </ActionSheetItem>
                : null}
              <ActionSheetItem autoclose onClick={() => {
                bridge.send("VKWebAppCopyText", { text: text });
                setContinueSnack("Текст скопирован")
              }}
              before={<Icon28CopyOutline/>}>
                Скопировать текст
                </ActionSheetItem>
            </ActionSheet>
          )
        }
      }
    }
  }
  const detectPlaceholder = () => {
    let placeholder = 'Сообщение';
    if(add_comment){
      placeholder = 'Комментарий'
    }
    return placeholder;
  }
  const detectFunction = () => {
    if(redaction){
      QuickMenagerMessages(messageIdChanged, "redaction")
    }else if(add_comment){
      QuickMenagerMessages(messageIdChanged, 'comment')
    }else if(edit_comment){
      QuickMenagerMessages(messageIdChanged, 'redaction_comment')
    }else{
      QuickMenagerMessages(info.id, 'send')
    }
    setSendfield('');
    setRedaction(false);
    setAddComment(false);
    setEditComment(false);
  }
  const QuickMenagerMessages = (id, typeSend) => {
    let method,typetick;
    const types = {
      ticket: "ticket_id",
      message: "message_id"
    }
    switch (typeSend) {
      case "send":
        method = 'method=ticket.sendMessage&';
        typetick = types.ticket;
        break;
      case "redaction":
        method = 'method=ticket.editMessage&';
        typetick = types.message
        break;
      case "comment":
        method = 'method=ticket.commentMessage&';
        typetick = types.message
        break;
      case "redaction_comment":
        method = 'method=ticket.editComment&';
        typetick = types.message
        break;
      case "delete_comment":
        method = 'method=ticket.deleteComment&';
        typetick = types.message
        break;
      default:
        throw new Error("Такого значения не существует")
    }
    let json = (typetick === types.ticket) ? {
      'ticket_id': id,
      'text': sendfield.trim(),
    } : {
        'message_id': id,
        'text': sendfield.trim(),
    }
    setPopout(<ScreenSpinner/>)
    fetch(API_URL + method + window.location.search.replace('?', ''),
      {method: 'post',
      headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(json)
        })
      .then(res => res.json())
      .then(data => {
        if(data.result) {
          setPopout(null)
          getTicket(info.id)
        }else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        setActiveStory('disconnect')
      })
  }
  const openCloseTicket = (open) => {
    let method = open ? "method=ticket.open&" : "method=ticket.close&";
    setPopout(<ScreenSpinner/>)
    fetch(API_URL + method + window.location.search.replace('?', ''),
        {method: 'post',
          headers: {"Content-type": "application/json; charset=UTF-8"},
          body: JSON.stringify({
            'ticket_id': info.id,
          })
            })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              setPopout(null)
              getTicket(info.id)
              setContinueSnack(`Тикет ${open ? "открыт" : "закрыт"}`)
            }else {
              showErrorAlert(data.error.message)
            }
          })
          .catch(err => {
            setActiveStory('disconnect')

          })
      }
  const copy = (id) => {
    setPopout(
      <ActionSheet onClose={() => setPopout(null)}
        toggleRef={MessageRef.current}
        iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
        {Number(info['author']['id']) === Number(parsedHash.vk_user_id) ?
          info['status'] === 0 || info['status'] === 1 ?
            <ActionSheetItem autoclose onClick={() => openCloseTicket(false)}>
              Закрыть вопрос
            </ActionSheetItem>
            :
            <ActionSheetItem autoclose onClick={() => openCloseTicket(true)}>
              Открыть вопрос
            </ActionSheetItem>
          :
          account.special === true ?
            info['status'] === 0 || info['status'] === 1 ?
              <ActionSheetItem autoclose onClick={() => openCloseTicket(false)}>
                Закрыть вопрос
            </ActionSheetItem>
              :
              <ActionSheetItem autoclose onClick={() => openCloseTicket(true)}>
                Открыть вопрос
            </ActionSheetItem>
            : null
        }
        <ActionSheetItem autoclose onClick={() => {
          bridge.send("VKWebAppCopyText", { text: "https://vk.com/app7409818#ticket_id=" + id });
          setSnackbar(<Snackbar
            layout="vertical"
            before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            onClose={() => setSnackbar(null)}>
            Ссылка скопирована
                </Snackbar>)
        }}>
          Скопировать ссылку
            </ActionSheetItem>
      </ActionSheet>)
  }
  useEffect(() => {
    getTicket(props.ticket_id)
    return () => {
      dispatch(ticketActions.setTicket( {} ))
    }
  }, [props.ticket_id, getTicket, dispatch])
  return(
    <Panel id={props.id}>
      <PanelHeader
        left={<><PanelHeaderBack onClick={() => window.history.back()} /><PanelHeaderButton onClick={() => copy(info.id)}><Icon28SlidersOutline/></PanelHeaderButton></>}
      >
        <div ref={MessageRef}>
          Вопрос #{info ? info.id : "...."} {info && info.donut ? <Icon16StarCircleFillYellow width={16} height={16} style={{ display: 'inline-block' }} /> : null}
        </div>
      </PanelHeader>
      {info ? <>
        <div style={{ height: $(window).height() - 200}}>
          <Group>
            <div style={{ height: $(window).height() - 100, overflowY: 'auto' }}>
              <div className="title_tiket">{getHumanyTime(info.time).date}</div>
              <div className="title_tiket" style={{ marginTop: "10px", width: "95%", marginLeft: "10px" }}>Пользователь обратился с вопросом  «{info.title}»</div>
              {messages ? messages.map((result, i) =>
                <React.Fragment key={result.id}>
                  <Message
                    clickable={!account.special ? false : true}
                    title={getAuthorName(result)}
                    title_icon={result.moderator_comment !== undefined ? <Icon16ReplyOutline width={10} height={10} style={{ display: "inline-block" }} /> : false}
                    is_mine={result.author.is_moderator}
                    is_special={account.special}
                    avatar={getAvatar(result)}
                    time={getHumanyTime(result.time).time}
                    onClick={(e) => {
                      Admin(result.approved, result.id, result.chance_posit,
                        result['author'].first_name ? -result['author']['id'] : result['author']['id'], result['text'],
                        result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null,
                        getAvatar(result),
                        result['mark'])
                    }}
                    is_mark={result.mark}
                    sendRayt_false={() => markMessage(0, result.id, "mark")}
                    sendRayt_true={() => markMessage(1, result.id, "mark")}
                    commentclick={() => { setComment({ objComment: result.moderator_comment !== undefined ? result.moderator_comment : null, message_id: result.id }); setActiveModal("comment") }}
                    comment={result.moderator_comment !== undefined}
                    approved={result.approved ? true : false}
                    CanselApp={() => showAlert('Информация', 'Этот ответ оценен отрицательно')}
                    DoneApp={() => showAlert('Информация', 'Этот ответ оценен положительно')}
                  >
                    {result.text}
                  </Message>
                </React.Fragment>) : <PanelSpinner />}
              {!((info['status'] === 1) || (info['status'] === 2)) ? <div style={{ marginBottom: '20vh' }}></div> : <div style={{ marginBottom: '10vh' }}></div>}
            </div>


          </Group>
      </div>
        
        {/* INPUT */}
        {info.status === 0 || (redaction || add_comment) ?
          (limitReach && !(redaction || add_comment)) ?
            <FixedLayout filled vertical='bottom' style={{ zIndex: 20 }}>
              <Group>
                <Div>
                  <FormStatus header='Внимание!' mode='default'>
                    Вы исчерпали лимит сообщений в этот тикет.
                      </FormStatus>
                </Div>
              </Group>
            </FixedLayout> :
            account.generator ?
              <FixedLayout filled vertical='bottom' style={{ zIndex: 20 }}>
                <Group>
                  <Div>
                    <FormStatus header='Внимание!' mode='default'>
                      Вы являетесь генератором. Вам запрещено отвечать на вопросы
                      </FormStatus>
                  </Div>
                </Group>

              </FixedLayout>
              :
              <FixedLayout filled vertical='bottom' style={{ zIndex: 2 }}>
                <Separator wide />
                <WriteBar
                  after={
                    <>
                      <WriteBarIcon mode={(redaction || edit_comment) ? 'done' : "send"}
                        disabled={!(sendfield.trim().length >= 5)}
                        onClick={() => { detectFunction() }}
                      />
                    </>
                  }
                  value={sendfield}
                  maxLength="4040"
                  name="tiket_send_message"
                  onChange={e => setSendfield(e.currentTarget.value)}
                  placeholder={detectPlaceholder()}
                />

              </FixedLayout>

          : null}
        {snackbar}
      </> : <Group><PanelSpinner /></Group>}
    </Panel>
  )
}