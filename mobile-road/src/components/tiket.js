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
    Link,
    Button,
    Spinner,
    FormItem,
    ButtonGroup,

    } from '@vkontakte/vkui';

import { 
  Icon28SlidersOutline,
  Icon16StarCircleFillYellow,
  Icon16CheckCircle,
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
  Icon28DoorArrowLeftOutline,
  Icon28DoorArrowRightOutline,
  Icon24Comment,
 } from '@vkontakte/icons';

import Message from './message'
import { useDispatch, useSelector } from 'react-redux';
import { ticketActions } from '../store/main';
import { getHumanyTime, getRandomInRange, LinkHandler, NicknameMenager } from '../Utils';
import { API_URL, LINKS_VK, LINK_APP, PERMISSIONS, PRESETS_MESSAGES } from '../config';
import { useNavigation } from '../hooks';

const blueBackground = {
  backgroundColor: 'var(--accent)'
};

export default props => {
  const dispatch = useDispatch();
  const { setReport, setActiveModal } = props.callbacks;
  const { activeStory } = useSelector((state) => state.views)
  const setComment = useCallback((comment) => dispatch(ticketActions.setComment(comment)), [dispatch])
  const MessageRef = useRef(null);
  const [add_comment, setAddComment] = useState(false);
  const [messageIdChanged, setMessageIdChanged] = useState(0);
  const [edit_comment, setEditComment] = useState(false);
  const [redaction, setRedaction] = useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [sendfield, setSendfield] = useState('');
  const [openAtachment, setOpenAtachment] = useState(false);
  // const [attachments, setAttachments] = useState([]);
  const { goDisconnect, setPopout, showErrorAlert, showAlert, goOtherProfile, goPanel } = useNavigation();

  const preTicketId = useSelector((state) => state.tickets.current_id)
  const TicketData = useSelector((state) => state.tickets.ticketInfo)
  const account = useSelector((state) => (state.account.account))
  const { info, messages, limitReach} = TicketData;
  const permissions = account.permissions;
  const moderator_permission = permissions >= PERMISSIONS.special;

  const copyClipboard = (text) => {
    bridge.send("VKWebAppCopyText", { text: text });
    navigator.clipboard.writeText(text)
  }
  const setContinueSnack = (text) => {
    setSnackbar(<Snackbar
      layout="vertical"
      before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
      onClose={() => setSnackbar(null)}>
      {text}
            </Snackbar>)
  }
  const getTicket = (id) => {
    fetch(API_URL + "method=ticket.getById&" + window.location.search.replace('?', ''),
      {
          method: 'post',
          headers: { "Content-type": "application/json; charset=UTF-8" },
          body: JSON.stringify({
              'ticket_id': id,
          })
      })
      .then(res => res.json())
      .then((data) => {
        if(data.result) {
          dispatch(ticketActions.setTicket(data.response))
        } else {
          showErrorAlert(data.error.message);
        }
      })
      .catch(goDisconnect)
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
        .catch(goDisconnect)
      }

      const Admin = (approved, id, chance_posit, author_id, text, comment, avatar = null, mark = -1) => {
        let special = moderator_permission;
        let shotItems = {
          cancel_item: <ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>,
          copy_message: <ActionSheetItem autoclose onClick={() => {
            copyClipboard(text)
            setContinueSnack("Текст скопирован")
            }}
            before={<Icon28CopyOutline/>}>
              Скопировать текст
            </ActionSheetItem>,
          edit_message: <ActionSheetItem autoclose 
              before={<Icon28WriteOutline />}
              onClick={() => {
                setRedaction(true);
                setMessageIdChanged(id);
                setSendfield(text)}}>
                Редактировать
            </ActionSheetItem>,
          report: <ActionSheetItem autoclose mode='destructive'
          before={<Icon28ReportOutline />}
            onClick={() => setReport(3, id)}>
            Пожаловаться
            </ActionSheetItem>,
          delete_message: <ActionSheetItem 
            autoclose 
            mode='destructive'
            before={<Icon28DeleteOutline />} 
            onClick={() => markMessage(0, id, "delete")}>
              Удалить сообщение
          </ActionSheetItem>
        }
        if (author_id > 0) {
          setPopout(
            <ActionSheet onClose={() => setPopout(null)}
              toggleRef={MessageRef.current}
              iosCloseItem={shotItems.cancel_item}>
              {author_id > 0 ?
                <ActionSheetItem 
                before={<Icon28UserSquareOutline />}
                autoclose onClick={() => { goOtherProfile(author_id); }}>
                  Профиль
                  </ActionSheetItem>
                : null}
              {special && mark === -1 ?
                <ActionSheetItem autoclose onClick={() => markMessage(1, id, "mark")}
                subtitle={<Text onClick={(e) => e.stopPropagation()} 
                style={{whiteSpace: "pre-wrap"}}>
                  Вероятность положительной оценки: {chance_posit / 10}%{"\n"}
                  <LinkHandler 
                  href={LINKS_VK.probability_article}>
                  Подробнее
                  </LinkHandler></Text>}
                before={<Icon28DoneOutline />}>
                  Оценить положительно
                  </ActionSheetItem>
                : null}
              {special && mark === -1 && !(comment === null || comment === undefined) ?
                <ActionSheetItem autoclose 
                before={<Icon28CancelOutline />}
                onClick={() => markMessage(0, id, "mark")}>
                  Оценить отрицательно
                  </ActionSheetItem>
                : null}
              {special && mark !== -1 ?
                <ActionSheetItem autoclose
                before={<Icon28DeleteOutline />} 
                onClick={() => markMessage(0, id, "unmark")}>
                  Удалить оценку
                  </ActionSheetItem>
                : null}
              {(special && !approved) ?
                <ActionSheetItem autoclose 
                before={<Icon28CheckCircleOutline />}
                onClick={() => markMessage(0, id, "approve")}>
                  Одобрить
                  </ActionSheetItem>
                : null}
              
              {special ?
                <>{comment === null && <ActionSheetItem autoclose 
                  before={<Icon28CommentOutline/>}
                  onClick={() => {setAddComment(true); setMessageIdChanged(id)}}>
                  Добавить комментарий
                </ActionSheetItem>}
                {comment && <ActionSheetItem autoclose 
                  before={<Icon28WriteOutline />}
                  onClick={() => { setSendfield(comment);setMessageIdChanged(id);setEditComment(true)}}>
                  Редактировать комментарий
                </ActionSheetItem>}
                {comment && <ActionSheetItem autoclose 
                  before={<Icon28CommentDisableOutline />} 
                  onClick={() => QuickMenagerMessages(id, 'delete_comment')}>
                    Удалить комментарий
                </ActionSheetItem>}
                </>
                : null}
              {(Number(author_id === account.id) && info['status'] === 0 && mark === -1 && !approved) ?
                shotItems.edit_message
                : null}
              {shotItems.copy_message}
              {(Number(author_id) === Number(account.id) && mark === -1) ? 
              shotItems.delete_message : null}
              {moderator_permission ? shotItems.report : null}
            </ActionSheet>
          )
        } else {
          if (moderator_permission) {
            setPopout(
              <ActionSheet onClose={() => setPopout(null)}
                toggleRef={MessageRef.current}
                iosCloseItem={shotItems.cancel_item}>
                {(Number(author_id === account.id) && info.status === 0) ?
                  shotItems.edit_message
                  : null}
                {shotItems.copy_message}
                {shotItems.delete_message}
              </ActionSheet>
            )
          } else {
            if (author_id === account.id || author_id === -account.vk_id) {
              setPopout(
                <ActionSheet onClose={() => setPopout(null)}
                  toggleRef={MessageRef.current}
                  iosCloseItem={shotItems.cancel_item}>
                  {info['status'] === 0 ?
                    shotItems.edit_message
                    : null}
                  {shotItems.copy_message}
                  {shotItems.delete_message}
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
  const QuickMenagerMessages = (id, typeSend, customField=null) => {
    let method,typetick;
    const types = {
      ticket: "ticket_id",
      message: "message_id"
    }
    let complete_callback = () => undefined;
    let customjson = null;
    switch (typeSend) {
      case "send":
        method = 'method=ticket.sendMessage&';
        typetick = types.ticket;
        complete_callback = () => {if(!moderator_permission && !info.author.id === account.vk_id) goPanel(activeStory, 'answer_added', true, true)}
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
      case "rate_ticket":
        method = 'method=ticket.rate&';
        typetick = types.ticket
        customjson = {
          'ticket_id': id,
          'rate': customField
        }
        break;
      default:
        throw new Error("Такого значения не существует")
    }
    let json = customjson !== null ? customjson : (typetick === types.ticket) ? {
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
          complete_callback()
        }else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(goDisconnect)
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
            } else {
              showErrorAlert(data.error.message)
            }
          })
          .catch(goDisconnect)
      }
  const copy = (id) => {
    setPopout(
      <ActionSheet onClose={() => setPopout(null)}
        toggleRef={MessageRef.current}
        iosCloseItem={<ActionSheetItem autoclose mode="cancel">Отменить</ActionSheetItem>}>
        {moderator_permission &&
            ((info['status'] === 0 || info['status'] === 1) ?
              <ActionSheetItem autoclose 
              before={<Icon28DoorArrowRightOutline />}
              onClick={() => openCloseTicket(false)}>
                Закрыть вопрос
            </ActionSheetItem>
              :
              <ActionSheetItem autoclose 
              before={<Icon28DoorArrowLeftOutline />}
              onClick={() => openCloseTicket(true)}>
                Открыть вопрос
            </ActionSheetItem>)
        }
        <ActionSheetItem autoclose 
        before={<Icon28CopyOutline />}
        onClick={() => {
          copyClipboard(LINK_APP + "#ticket_id=" + id)
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
  const markMessageHandler = (mark) => {
    let message = '';
    let mark_text = mark.mark === 1 ? 'положительно':'отрицательно';
    message = 'Этот ответ оценен ' + mark_text;

    if('mark_author_id' in mark && 'mark_author_nickname' in mark){
      let author = mark.mark_author_nickname ? mark.mark_author_nickname : `#${mark.mark_author_id}`;
      message = <Text>Этот ответ оценен {mark_text} специальным агентом <Link onClick={() => {setPopout(null);goOtherProfile(mark.mark_author_id)}}>{author}</Link></Text>
    }
    return message
  }
  const getPresetMessage = () => {
    let ind = getRandomInRange(0, PRESETS_MESSAGES.length-1);
    let message = PRESETS_MESSAGES[ind];
    message = message.replace('%name_user%', info.author.first_name);
    message = message.replace('%agent_uni_name%', account.nickname ? account.nickname : '#' + account.id);
    message = message.replace('%agent_uni_name_full%', 
    NicknameMenager({
      perms: 0,
      nickname: account.nickname,
      agent_id: account.id}));

    message = message.replace('%agent_id%', '#' + account.id);
    message = message.replace('%text%', sendfield);
    setSendfield(message)
  }
  useEffect(() => {
    const getTicket = (id) => {
      fetch(API_URL + "method=ticket.getById&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'ticket_id': id,
            })
        })
        .then(res => res.json())
        .then((data) => {
          if(data.result) {
            dispatch(ticketActions.setTicket(data.response))
          } else {
            showErrorAlert(data.error.message);
          }
        })
        .catch(goDisconnect)
    }
    getTicket(preTicketId ? preTicketId : info.id)
    return () => {
      dispatch(ticketActions.setTicket({}))
    }
     // eslint-disable-next-line 
  }, [preTicketId, dispatch])

  // const loadFiles = (files) => {
  //   let globalFiles = {...attachments}
  //   let file_id = Object.keys(globalFiles).length > 0 ? 
  //   Math.max(...Object.keys(globalFiles).map(v => parseInt(v))) + 1 : 0;


  //   let xhr = new XMLHttpRequest();
  //   let fd = new FormData();
  //   xhr.open('POST', API_URL + 'method=files.uploadFile&' + window.location.search.replace('?', ''))
  //   xhr.onreadystatechange = () => {
  //     if (xhr.readyState == 4 && xhr.status == 200) {
  //         // Handle response.
  //         console.log(xhr.response); // handle response.
  //     }
  //   };

  //   for(let i=0; i<files.length; i++) {
  //     globalFiles = Object.assign(globalFiles, {[file_id]: files[i]})
  //     file_id++;
  //     setAttachments(globalFiles)
  //     fd.append(file_id, files[i]);
  //   }
  //   xhr.send(fd);
  //   console.log('adadfsadsf')

  // }

  return(
    <Panel id={props.id}>
      <PanelHeader
        left={<><PanelHeaderBack onClick={() => window.history.back()} />
        <PanelHeaderButton aria-label='Опции' onClick={() => copy(info.id)}><Icon28SlidersOutline/>
        </PanelHeaderButton></>}
      >
        {/* <PanelHeaderContent
        status='На рассмотрении'
        before={info && <Avatar size={36} src={info.author.photo_200} alt='ava' />}>
          <div ref={MessageRef}>
            Вопрос #{info ? info.id : "...."} {info && info.donut ? <Icon16StarCircleFillYellow width={16} height={16} style={{ display: 'inline-block' }} /> : null}
          </div>
        </PanelHeaderContent> */}
        <div ref={MessageRef}>
            Вопрос #{info ? info.id : ""} {info && info.donut ? <Icon16StarCircleFillYellow width={16} height={16} style={{ display: 'inline-block' }} /> : null}
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
                    clickable={moderator_permission}
                    title={getAuthorName(result)}
                    is_mine={result.author.is_moderator}
                    is_special={moderator_permission}
                    avatar={getAvatar(result)}
                    time={getHumanyTime(result.time).time}
                    onClick={() => {
                      Admin(result.approved, result.id, result.chance_posit,
                        result['author'].first_name ? -result['author']['id'] : result['author']['id'], result['text'],
                        result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null,
                        getAvatar(result),
                        ('mark' in result) ? result.mark.mark : -1)
                    }}
                    is_mark={('mark' in result) ? result.mark.mark : -1}
                    commentClick={() => { setComment({ objComment: result.moderator_comment !== undefined ? result.moderator_comment : null, 
                      message_id: result.id, 
                      mark: ('mark' in result) ? result.mark.mark : -1 }); 
                      setActiveModal("comment") }}
                    comment={result.moderator_comment !== undefined}
                    approved={!!result.approved}
                    markAlert={() => showAlert('Информация', markMessageHandler(result.mark))}
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
            (account.generator && info.real_author && !moderator_permission) ?
              <FixedLayout filled vertical='bottom' style={{ zIndex: 20 }}>
                <Group>
                  <Div>
                    <FormStatus header='Внимание!' mode='default'>
                      Вы являетесь генератором. Вам запрещено отвечать на свои вопросы
                      </FormStatus>
                  </Div>
                </Group>

              </FixedLayout>
              :
              <FixedLayout filled vertical='bottom' style={{ zIndex: 2 }}>
                {openAtachment && (
                    <div style={{display: 'flex'}}>
                    <FormItem top="Прикрепить контент">
                      <ButtonGroup>
                        {/* <File 
                        onChange={e => loadFiles(e.currentTarget.files)}
                        before={<Icon24Camera />} 
                        controlSize="m">
                          Открыть галерею
                        </File> */}
                        <Button size='m'
                        mode='secondary'
                        before={<Icon24Comment />}
                        onClick={() => {
                          getPresetMessage();
                        }}>
                          Приветствие
                        </Button>
                      </ButtonGroup>
                      
                    </FormItem>
                    {/* <Card>
                      <img  />
                    </Card> */}
                  </div>
                  )}

                <Separator wide />
                <WriteBar
                  before={<WriteBarIcon 
                    onClick={() => setOpenAtachment(p => !p)}
                    mode="attach" />}
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

          : 
          (info.status === 1 && account.vk_id === info.author.id) ? 
          <FixedLayout filled vertical='bottom' style={{ zIndex: 20 }}>
            <Div>
              <Button mode='primary'
                stretched
                size='m'
                style={{marginBottom: 8}}
                onClick={() => {
                  QuickMenagerMessages(info.id, 'rate_ticket', 2)
                }}>
                    Это решает мою проблему
                </Button>
                <Button mode='secondary'
                stretched
                size='m'
                onClick={() => {
                  QuickMenagerMessages(info.id, 'rate_ticket', 0)
                }}>
                    Это не решает мою проблему
              </Button>
            </Div>
              
          </FixedLayout>
          : null}
        {snackbar}
      </> : 
      <Group>
        <Div style={{marginTop: '47%', marginBottom: 100}}>
          <Spinner size='large' />
        </Div>
      </Group>}
    </Panel>
  )
}