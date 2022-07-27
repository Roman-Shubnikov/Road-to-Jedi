"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const vk_bridge_1 = __importDefault(require("@vkontakte/vk-bridge")); // VK Brige
const jquery_1 = __importDefault(require("jquery"));
const vkui_1 = require("@vkontakte/vkui");
const icons_1 = require("@vkontakte/icons");
const Message_1 = require("./Message");
const react_redux_1 = require("react-redux");
const main_1 = require("../store/main");
const Utils_1 = require("../Utils");
const config_1 = require("../config");
const hooks_1 = require("../hooks");
const blueBackground = {
    backgroundColor: 'var(--accent)'
};
// Переделать это дерьмо
exports.default = props => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { setReport, setActiveModal } = props.callbacks;
    const { activeStory } = (0, react_redux_1.useSelector)((state) => state.views);
    const setComment = (0, react_1.useCallback)((comment) => dispatch(main_1.ticketActions.setComment(comment)), [dispatch]);
    const MessageRef = (0, react_1.useRef)(null);
    const [add_comment, setAddComment] = (0, react_1.useState)(false);
    const [messageIdChanged, setMessageIdChanged] = (0, react_1.useState)(0);
    const [edit_comment, setEditComment] = (0, react_1.useState)(false);
    const [redaction, setRedaction] = (0, react_1.useState)(false);
    const [snackbar, setSnackbar] = (0, react_1.useState)(false);
    const [sendfield, setSendfield] = (0, react_1.useState)('');
    const [openAtachment, setOpenAtachment] = (0, react_1.useState)(false);
    // const [attachments, setAttachments] = useState([]);
    const { goDisconnect, setPopout, showErrorAlert, showAlert, goOtherProfile, goPanel } = (0, hooks_1.useNavigation)();
    const preTicketId = (0, react_redux_1.useSelector)((state) => state.tickets.current_id);
    const TicketData = (0, react_redux_1.useSelector)((state) => state.tickets.ticketInfo);
    const account = (0, react_redux_1.useSelector)((state) => (state.account.account));
    const { info, messages, limitReach } = TicketData;
    const permissions = account.permissions;
    const moderator_permission = permissions >= config_1.PERMISSIONS.special;
    const copyClipboard = (text) => {
        vk_bridge_1.default.send("VKWebAppCopyText", { text: text });
        navigator.clipboard.writeText(text);
    };
    const setContinueSnack = (text) => {
        setSnackbar(<vkui_1.Snackbar layout="vertical" before={<vkui_1.Avatar size={24} style={blueBackground}><icons_1.Icon16CheckCircle fill="#fff" width={14} height={14}/></vkui_1.Avatar>} onClose={() => setSnackbar(null)}>
      {text}
            </vkui_1.Snackbar>);
    };
    const getTicket = (id) => {
        fetch(config_1.API_URL + "method=ticket.getById&" + window.location.search.replace('?', ''), {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'ticket_id': id,
            })
        })
            .then(res => res.json())
            .then((data) => {
            if (data.result) {
                dispatch(main_1.ticketActions.setTicket(data.response));
            }
            else {
                showErrorAlert(data.error.message);
            }
        })
            .catch(goDisconnect);
    };
    const getAvatar = (result) => {
        if (result.author.is_moderator) {
            return result.author.avatar.url;
        }
        else {
            return result.author.photo_200;
        }
    };
    const getAuthorName = (result) => {
        if (result.author.is_moderator) {
            if (result.nickname) {
                return result.nickname;
            }
            else {
                return `Агент Поддержки #${result.author.id}`;
            }
        }
        else {
            return result.author.first_name + " " + result.author.last_name;
        }
    };
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
        fetch(config_1.API_URL + method + window.location.search.replace('?', ''), { method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'message_id': message_id,
                'mark': mark,
            })
        })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                getTicket(info.id);
            }
            else {
                showErrorAlert(data.error.message);
            }
        })
            .catch(goDisconnect);
    };
    const Admin = (approved, id, chance_posit, author_id, text, comment, avatar = null, mark = -1) => {
        let special = moderator_permission;
        let shotItems = {
            cancel_item: <vkui_1.ActionSheetItem autoclose mode="cancel">Отменить</vkui_1.ActionSheetItem>,
            copy_message: <vkui_1.ActionSheetItem autoclose onClick={() => {
                    copyClipboard(text);
                    setContinueSnack("Текст скопирован");
                }} before={<icons_1.Icon28CopyOutline />}>
              Скопировать текст
            </vkui_1.ActionSheetItem>,
            edit_message: <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28WriteOutline />} onClick={() => {
                    setRedaction(true);
                    setMessageIdChanged(id);
                    setSendfield(text);
                }}>
                Редактировать
            </vkui_1.ActionSheetItem>,
            report: <vkui_1.ActionSheetItem autoclose mode='destructive' before={<icons_1.Icon28ReportOutline />} onClick={() => setReport(3, id)}>
            Пожаловаться
            </vkui_1.ActionSheetItem>,
            delete_message: <vkui_1.ActionSheetItem autoclose mode='destructive' before={<icons_1.Icon28DeleteOutline />} onClick={() => markMessage(0, id, "delete")}>
              Удалить сообщение
          </vkui_1.ActionSheetItem>
        };
        if (author_id > 0) {
            setPopout(<vkui_1.ActionSheet onClose={() => setPopout(null)} toggleRef={MessageRef.current} iosCloseItem={shotItems.cancel_item}>
              {author_id > 0 ?
                    <vkui_1.ActionSheetItem before={<icons_1.Icon28UserSquareOutline />} autoclose onClick={() => { goOtherProfile(author_id); }}>
                  Профиль
                  </vkui_1.ActionSheetItem>
                    : null}
              {special && mark === -1 ?
                    <vkui_1.ActionSheetItem autoclose onClick={() => markMessage(1, id, "mark")} subtitle={<vkui_1.Text onClick={(e) => e.stopPropagation()} style={{ whiteSpace: "pre-wrap" }}>
                  Вероятность положительной оценки: {chance_posit / 10}%{"\n"}
                  <Utils_1.LinkHandler href={config_1.LINKS_VK.probability_article}>
                  Подробнее
                  </Utils_1.LinkHandler></vkui_1.Text>} before={<icons_1.Icon28DoneOutline />}>
                  Оценить положительно
                  </vkui_1.ActionSheetItem>
                    : null}
              {special && mark === -1 && !(comment === null || comment === undefined) ?
                    <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28CancelOutline />} onClick={() => markMessage(0, id, "mark")}>
                  Оценить отрицательно
                  </vkui_1.ActionSheetItem>
                    : null}
              {special && mark !== -1 ?
                    <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28DeleteOutline />} onClick={() => markMessage(0, id, "unmark")}>
                  Удалить оценку
                  </vkui_1.ActionSheetItem>
                    : null}
              {(special && !approved) ?
                    <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28CheckCircleOutline />} onClick={() => markMessage(0, id, "approve")}>
                  Одобрить
                  </vkui_1.ActionSheetItem>
                    : null}
              
              {special ?
                    <>{comment === null && <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28CommentOutline />} onClick={() => { setAddComment(true); setMessageIdChanged(id); }}>
                  Добавить комментарий
                </vkui_1.ActionSheetItem>}
                {comment && <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28WriteOutline />} onClick={() => { setSendfield(comment); setMessageIdChanged(id); setEditComment(true); }}>
                  Редактировать комментарий
                </vkui_1.ActionSheetItem>}
                {comment && <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28CommentDisableOutline />} onClick={() => QuickMenagerMessages(id, 'delete_comment')}>
                    Удалить комментарий
                </vkui_1.ActionSheetItem>}
                </>
                    : null}
              {(Number(author_id === account.id) && info['status'] === 0 && mark === -1 && !approved) ?
                    shotItems.edit_message
                    : null}
              {shotItems.copy_message}
              {(Number(author_id) === Number(account.id) && mark === -1) ?
                    shotItems.delete_message : null}
              {moderator_permission ? shotItems.report : null}
            </vkui_1.ActionSheet>);
        }
        else {
            if (moderator_permission) {
                setPopout(<vkui_1.ActionSheet onClose={() => setPopout(null)} toggleRef={MessageRef.current} iosCloseItem={shotItems.cancel_item}>
                {(Number(author_id === account.id) && info.status === 0) ?
                        shotItems.edit_message
                        : null}
                {shotItems.copy_message}
                {shotItems.delete_message}
              </vkui_1.ActionSheet>);
            }
            else {
                if (author_id === account.id || author_id === -account.vk_id) {
                    setPopout(<vkui_1.ActionSheet onClose={() => setPopout(null)} toggleRef={MessageRef.current} iosCloseItem={shotItems.cancel_item}>
                  {info['status'] === 0 ?
                            shotItems.edit_message
                            : null}
                  {shotItems.copy_message}
                  {shotItems.delete_message}
                </vkui_1.ActionSheet>);
                }
            }
        }
    };
    const detectPlaceholder = () => {
        let placeholder = 'Сообщение';
        if (add_comment) {
            placeholder = 'Комментарий';
        }
        return placeholder;
    };
    const detectFunction = () => {
        if (redaction) {
            QuickMenagerMessages(messageIdChanged, "redaction");
        }
        else if (add_comment) {
            QuickMenagerMessages(messageIdChanged, 'comment');
        }
        else if (edit_comment) {
            QuickMenagerMessages(messageIdChanged, 'redaction_comment');
        }
        else {
            QuickMenagerMessages(info.id, 'send');
        }
        setSendfield('');
        setRedaction(false);
        setAddComment(false);
        setEditComment(false);
    };
    const QuickMenagerMessages = (id, typeSend, customField = null) => {
        let method, typetick;
        const types = {
            ticket: "ticket_id",
            message: "message_id"
        };
        let complete_callback = () => undefined;
        let customjson = null;
        switch (typeSend) {
            case "send":
                method = 'method=ticket.sendMessage&';
                typetick = types.ticket;
                complete_callback = () => { if (!moderator_permission && !info.author.id === account.vk_id)
                    goPanel(activeStory, 'answer_added', true, true); };
                break;
            case "redaction":
                method = 'method=ticket.editMessage&';
                typetick = types.message;
                break;
            case "comment":
                method = 'method=ticket.commentMessage&';
                typetick = types.message;
                break;
            case "redaction_comment":
                method = 'method=ticket.editComment&';
                typetick = types.message;
                break;
            case "delete_comment":
                method = 'method=ticket.deleteComment&';
                typetick = types.message;
                break;
            case "rate_ticket":
                method = 'method=ticket.rate&';
                typetick = types.ticket;
                customjson = {
                    'ticket_id': id,
                    'rate': customField
                };
                break;
            default:
                throw new Error("Такого значения не существует");
        }
        let json = customjson !== null ? customjson : (typetick === types.ticket) ? {
            'ticket_id': id,
            'text': sendfield.trim(),
        } : {
            'message_id': id,
            'text': sendfield.trim(),
        };
        setPopout(<vkui_1.ScreenSpinner />);
        fetch(config_1.API_URL + method + window.location.search.replace('?', ''), { method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify(json)
        })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setPopout(null);
                getTicket(info.id);
                complete_callback();
            }
            else {
                showErrorAlert(data.error.message);
            }
        })
            .catch(goDisconnect);
    };
    const openCloseTicket = (open) => {
        let method = open ? "method=ticket.open&" : "method=ticket.close&";
        setPopout(<vkui_1.ScreenSpinner />);
        fetch(config_1.API_URL + method + window.location.search.replace('?', ''), { method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'ticket_id': info.id,
            })
        })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setPopout(null);
                getTicket(info.id);
                setContinueSnack(`Тикет ${open ? "открыт" : "закрыт"}`);
            }
            else {
                showErrorAlert(data.error.message);
            }
        })
            .catch(goDisconnect);
    };
    const copy = (id) => {
        setPopout(<vkui_1.ActionSheet onClose={() => setPopout(null)} toggleRef={MessageRef.current} iosCloseItem={<vkui_1.ActionSheetItem autoclose mode="cancel">Отменить</vkui_1.ActionSheetItem>}>
        {moderator_permission &&
                ((info['status'] === 0 || info['status'] === 1) ?
                    <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28DoorArrowRightOutline />} onClick={() => openCloseTicket(false)}>
                Закрыть вопрос
            </vkui_1.ActionSheetItem>
                    :
                        <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28DoorArrowLeftOutline />} onClick={() => openCloseTicket(true)}>
                Открыть вопрос
            </vkui_1.ActionSheetItem>)}
        <vkui_1.ActionSheetItem autoclose before={<icons_1.Icon28CopyOutline />} onClick={() => {
                copyClipboard(config_1.LINK_APP + "#ticket_id=" + id);
                setSnackbar(<vkui_1.Snackbar layout="vertical" before={<vkui_1.Avatar size={24} style={blueBackground}><icons_1.Icon16CheckCircle fill="#fff" width={14} height={14}/></vkui_1.Avatar>} onClose={() => setSnackbar(null)}>
            Ссылка скопирована
                </vkui_1.Snackbar>);
            }}>
          Скопировать ссылку
            </vkui_1.ActionSheetItem>
      </vkui_1.ActionSheet>);
    };
    const markMessageHandler = (mark) => {
        let message = '';
        let mark_text = mark.mark === 1 ? 'положительно' : 'отрицательно';
        message = 'Этот ответ оценен ' + mark_text;
        if ('mark_author_id' in mark && 'mark_author_nickname' in mark) {
            let author = mark.mark_author_nickname ? mark.mark_author_nickname : `#${mark.mark_author_id}`;
            message = <vkui_1.Text>Этот ответ оценен {mark_text} специальным агентом <vkui_1.Link onClick={() => { setPopout(null); goOtherProfile(mark.mark_author_id); }}>{author}</vkui_1.Link></vkui_1.Text>;
        }
        return message;
    };
    const getPresetMessage = () => {
        let ind = (0, Utils_1.getRandomInRange)(0, config_1.PRESETS_MESSAGES.length - 1);
        let message = config_1.PRESETS_MESSAGES[ind];
        message = message.replace('%name_user%', info.author.first_name);
        message = message.replace('%agent_uni_name%', account.nickname ? account.nickname : '#' + account.id);
        message = message.replace('%agent_uni_name_full%', (0, Utils_1.NicknameMenager)({
            perms: 0,
            nickname: account.nickname,
            agent_id: account.id
        }));
        message = message.replace('%agent_id%', '#' + account.id);
        message = message.replace('%text%', sendfield);
        setSendfield(message);
    };
    (0, react_1.useEffect)(() => {
        const getTicket = (id) => {
            fetch(config_1.API_URL + "method=ticket.getById&" + window.location.search.replace('?', ''), {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'ticket_id': id,
                })
            })
                .then(res => res.json())
                .then((data) => {
                if (data.result) {
                    dispatch(main_1.ticketActions.setTicket(data.response));
                }
                else {
                    showErrorAlert(data.error.message);
                }
            })
                .catch(goDisconnect);
        };
        getTicket(preTicketId ? preTicketId : info.id);
        return () => {
            dispatch(main_1.ticketActions.setTicket({}));
        };
        // eslint-disable-next-line 
    }, [preTicketId, dispatch]);
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
    return (<vkui_1.Panel id={props.id}>
      <vkui_1.PanelHeader left={<><vkui_1.PanelHeaderBack onClick={() => window.history.back()}/>
        <vkui_1.PanelHeaderButton aria-label='Опции' onClick={() => copy(info.id)}><icons_1.Icon28SlidersOutline />
        </vkui_1.PanelHeaderButton></>}>
        {/* <PanelHeaderContent
        status='На рассмотрении'
        before={info && <Avatar size={36} src={info.author.photo_200} alt='ava' />}>
          <div ref={MessageRef}>
            Вопрос #{info ? info.id : "...."} {info && info.donut ? <Icon16StarCircleFillYellow width={16} height={16} style={{ display: 'inline-block' }} /> : null}
          </div>
        </PanelHeaderContent> */}
        <div ref={MessageRef}>
            Вопрос #{info ? info.id : ""} {info && info.donut ? <icons_1.Icon16StarCircleFillYellow width={16} height={16} style={{ display: 'inline-block' }}/> : null}
        </div>
      </vkui_1.PanelHeader>
      {info ? <>
        <div style={{ height: (0, jquery_1.default)(window).height() - 200 }}>
          <vkui_1.Group>
            <div style={{ height: (0, jquery_1.default)(window).height() - 100, overflowY: 'auto' }}>
              <div className="title_tiket">{(0, Utils_1.getHumanyTime)(info.time).date}</div>
              <div className="title_tiket" style={{ marginTop: "10px", width: "95%", marginLeft: "10px" }}>Пользователь обратился с вопросом  «{info.title}»</div>
              {messages ? messages.map((result, i) => <react_1.default.Fragment key={result.id}>
                  <Message_1.Message clickable={moderator_permission} title={getAuthorName(result)} is_mine={result.author.is_moderator} is_special={moderator_permission} avatar={getAvatar(result)} time={(0, Utils_1.getHumanyTime)(result.time).time} onClick={() => {
                    Admin(result.approved, result.id, result.chance_posit, result['author'].first_name ? -result['author']['id'] : result['author']['id'], result['text'], result.moderator_comment !== undefined ? result['moderator_comment']['text'] : null, getAvatar(result), ('mark' in result) ? result.mark.mark : -1);
                }} is_mark={('mark' in result) ? result.mark.mark : -1} commentClick={() => {
                    setComment({ objComment: result.moderator_comment !== undefined ? result.moderator_comment : null,
                        message_id: result.id,
                        mark: ('mark' in result) ? result.mark.mark : -1 });
                    setActiveModal("comment");
                }} comment={result.moderator_comment !== undefined} approved={!!result.approved} markAlert={() => showAlert('Информация', markMessageHandler(result.mark))}>
                    {result.text}
                  </Message_1.Message>
                </react_1.default.Fragment>) : <vkui_1.PanelSpinner />}
              {!((info['status'] === 1) || (info['status'] === 2)) ? <div style={{ marginBottom: '20vh' }}></div> : <div style={{ marginBottom: '10vh' }}></div>}
            </div>


          </vkui_1.Group>
      </div>
        
        {/* INPUT */}
        {info.status === 0 || (redaction || add_comment) ?
                (limitReach && !(redaction || add_comment)) ?
                    <vkui_1.FixedLayout filled vertical='bottom' style={{ zIndex: 20 }}>
              <vkui_1.Group>
                <vkui_1.Div>
                  <vkui_1.FormStatus header='Внимание!' mode='default'>
                    Вы исчерпали лимит сообщений в этот тикет.
                      </vkui_1.FormStatus>
                </vkui_1.Div>
              </vkui_1.Group>
            </vkui_1.FixedLayout> :
                    (account.generator && info.real_author && !moderator_permission) ?
                        <vkui_1.FixedLayout filled vertical='bottom' style={{ zIndex: 20 }}>
                <vkui_1.Group>
                  <vkui_1.Div>
                    <vkui_1.FormStatus header='Внимание!' mode='default'>
                      Вы являетесь генератором. Вам запрещено отвечать на свои вопросы
                      </vkui_1.FormStatus>
                  </vkui_1.Div>
                </vkui_1.Group>

              </vkui_1.FixedLayout>
                        :
                            <vkui_1.FixedLayout filled vertical='bottom' style={{ zIndex: 2 }}>
                {openAtachment && (<div style={{ display: 'flex' }}>
                    <vkui_1.FormItem top="Прикрепить контент">
                      <vkui_1.ButtonGroup>
                        {/* <File
                                    onChange={e => loadFiles(e.currentTarget.files)}
                                    before={<Icon24Camera />}
                                    controlSize="m">
                                      Открыть галерею
                                    </File> */}
                        <vkui_1.Button size='m' mode='secondary' before={<icons_1.Icon24Comment />} onClick={() => {
                                        getPresetMessage();
                                    }}>
                          Приветствие
                        </vkui_1.Button>
                      </vkui_1.ButtonGroup>
                      
                    </vkui_1.FormItem>
                    {/* <Card>
                                      <img  />
                                    </Card> */}
                  </div>)}

                <vkui_1.Separator wide/>
                <vkui_1.WriteBar before={<vkui_1.WriteBarIcon onClick={() => setOpenAtachment(p => !p)} mode="attach"/>} after={<>
                      <vkui_1.WriteBarIcon mode={(redaction || edit_comment) ? 'done' : "send"} disabled={!(sendfield.trim().length >= 5)} onClick={() => { detectFunction(); }}/>
                    </>} value={sendfield} maxLength="4040" name="tiket_send_message" onChange={e => setSendfield(e.currentTarget.value)} placeholder={detectPlaceholder()}/>

              </vkui_1.FixedLayout>
                :
                    (info.status === 1 && account.vk_id === info.author.id) ?
                        <vkui_1.FixedLayout filled vertical='bottom' style={{ zIndex: 20 }}>
            <vkui_1.Div>
              <vkui_1.Button mode='primary' stretched size='m' style={{ marginBottom: 8 }} onClick={() => {
                                QuickMenagerMessages(info.id, 'rate_ticket', 2);
                            }}>
                    Это решает мою проблему
                </vkui_1.Button>
                <vkui_1.Button mode='secondary' stretched size='m' onClick={() => {
                                QuickMenagerMessages(info.id, 'rate_ticket', 0);
                            }}>
                    Это не решает мою проблему
              </vkui_1.Button>
            </vkui_1.Div>
              
          </vkui_1.FixedLayout>
                        : null}
        {snackbar}
      </> :
            <vkui_1.Group>
        <vkui_1.Div style={{ marginTop: '47%', marginBottom: 100 }}>
          <vkui_1.Spinner size='large'/>
        </vkui_1.Div>
      </vkui_1.Group>}
    </vkui_1.Panel>);
};
