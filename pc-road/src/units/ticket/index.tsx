import React, {RefObject, useContext, useEffect, useRef, useState} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import bridge from '@vkontakte/vk-bridge';
import {
    Avatar,
    Button,
    ButtonGroup, CellButton,
    Div,
    FixedLayout,
    Group,
    IconButton,
    Panel,
    PanelSpinner, Placeholder,
    Separator,
    SimpleCell,
    WriteBar
} from "@vkontakte/vkui";
import {OptionElement, TicketOptions} from "./ticketOptions";
import {
    Icon24MoreHorizontal,
    Icon28ArrowLeftOutline,
    Icon20CopyOutline,
    Icon20DoorArrowRightOutline,
} from "@vkontakte/icons";

import {LINK_APP, PERMISSIONS, TICKET_STATUS_TEXTS, TICKET_STATUSES, TIME_TO_EDIT_MESSAGE} from "../../config";
import styles from './ticketOptions.module.css'
import {SocketContext} from "../../context/soket";
import {useDispatch, useSelector} from "react-redux";
import {ticketActions, ticketSelector} from "../../store/main";
import {ITicket} from "../../types";
import {Message} from "../../components/Message";
import {useNavigation, useUser} from "../../hooks";
import {getHumanyTime, getTime} from "../../Utils/Helpers";
import {IconBombViolet} from "../../icons";
import {Dropdown} from "@vkontakte/vkui/unstable";
import {CustomScrollView} from "@vkontakte/vkui/dist/components/CustomScrollView/CustomScrollView";

type ITicketComponent = {
    id: string,
}
type IMessage = {
    id: number,
    ticket_id: number,
    author_id: number,
    mark: -1|0|1,
    mark_author_id?: number,
    marked_at: number,
    comment: string,
    comment_author_id?: number,
    commented_at: number,
    text: string,
    can_fix_to: number,
    edited_at: number,
    created_at: number,
}
const INPUT_STATES = {
    EDIT: 1,
    MESSAGING: 2,
    WRITING_COMMENT: 3,
}
export const Ticket = (props: ITicketComponent) => {
    const { id } = props;
    const { account } = useUser();
    const { setBigLoader, setSuccessfulSnack } = useNavigation();
    const messageContainerRef = useRef<HTMLDivElement>();
    const inputRef = useRef<HTMLTextAreaElement>();
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const [inputText, setInputText] = useState('');
    const [currentMessage, setCurrentMessage] = useState<number|null>(null);
    const [inputState, setInputState] = useState(INPUT_STATES.MESSAGING);
    const [messages, setMessages] = useState<null|{count: number, messages: IMessage[], users: any[]}>(null);
    const { current_id, ticketInfo }: {current_id: number, ticketInfo: {ticket: ITicket|null, users: any[]}} = useSelector(ticketSelector);
    const { ticket=null } = ticketInfo;
    const socket = useContext(SocketContext);
    const ticketInfoRef = useRef<HTMLElement>();

    const isSpecial = account.permissions >= PERMISSIONS.special;

    const getPlaceholderInputState = () => {
        switch (inputState) {
            case INPUT_STATES.MESSAGING:
                return 'Сообщение...';
            case INPUT_STATES.EDIT:
                return 'Редактировать...';
            case INPUT_STATES.WRITING_COMMENT:
                return 'Комментарий...';
        }
    }
    const getActionButtons = () => {
        return (
            <>
                {isSpecial && inputState === INPUT_STATES.WRITING_COMMENT && <>
                    <Button size='m'>
                        Без оформления
                    </Button>
                    <Button size='m'>
                        Орфография
                    </Button>
                    <Button size='m'>
                        Нецелесообразный ответ
                    </Button>
                </>}
                <Button
                    disabled={inputText.length < 1}
                    loading={fetching}
                    onClick={() => {
                        switch (inputState) {
                            case INPUT_STATES.MESSAGING:
                                sendMessage();
                                break;
                            case INPUT_STATES.EDIT:
                                editMessage();
                                break;
                            case INPUT_STATES.WRITING_COMMENT:
                                writeComment();
                                break;
                        }
                        setInputText('')
                    }}
                    size='m'>
                    Отправить
                </Button>
            </>
        )
    }
    const writeComment = () => {
        if(!ticket) return;
        setBigLoader();
        setFetching(true);
        socket.emit('TICKETS_WRITE_COMMENT',
            {
                messageId: currentMessage,
                comment: inputText,
            })
        setFetching(false);
        setInputState(INPUT_STATES.MESSAGING)
    }

    const closeTicket = () => {
        if(!ticket) return;
        setBigLoader();
        setSuccessfulSnack('Тикет закрыт');
        socket.emit('TICKETS_CLOSE',
            {
                ticket_id: ticket.id,
            })
    }
    const sendMessage = () => {
        if(!ticket) return;
        setBigLoader();
        setFetching(true);
        socket.emit('TICKETS_SEND_MESSAGE',
            {
                text: inputText,
                ticket_id: ticket.id,
            })
        setFetching(false);
    }
    const copyClipboard = async (text: string) => {
        await bridge.send("VKWebAppCopyText", { text: text });
        try {
            await navigator.clipboard.writeText(text)
        } catch {}
        setSuccessfulSnack('Текст скопирован')
    }
    const markMessage = (messageId: number, mark: number) => {
        setBigLoader();
        socket.emit('TICKETS_MARK_MESSAGE', {
            messageId,
            mark
        })
    }
    const editMessage = () => {
        if(!currentMessage) return;
        setBigLoader();
        socket.emit('TICKETS_EDIT_MESSAGE', {
            messageId: currentMessage,
            text: inputText,
        })
        setInputState(INPUT_STATES.MESSAGING);
        setInputText('');
    }
    const getFixedLayout = () => {
        if(!ticket) return;
        const placeholder = <Placeholder
        style={{backgroundColor: 'var(--secondary_background)'}}>
            Давайте подождём пока собеседник ответит
        </Placeholder>
        switch (ticket.status) {
            case TICKET_STATUSES.ANSWERED:
                if(!isSpecial && inputState === INPUT_STATES.MESSAGING) {
                    return placeholder;
                }
                break;
            case TICKET_STATUSES.WAIT_EDIT:
                if(isSpecial && inputState === INPUT_STATES.MESSAGING) {
                    return placeholder
                }
                break;
        }
        return (
            <>
                <WriteBar
                    getRef={inputRef as React.RefObject<HTMLTextAreaElement>}
                    onChange={e => setInputText(e.currentTarget.value)}
                    value={inputText}
                    className={styles.input}
                    placeholder={getPlaceholderInputState()} />
                <Separator className='sep-wide' />
                <Div style={{backgroundColor: 'var(--secondary_background)'}}>
                    <ButtonGroup stretched style={{justifyContent: 'right'}}>
                        {getActionButtons()}
                    </ButtonGroup>
                </Div>
            </>
        )
    }
    useEffect(() => {
        let scrollTimer = setTimeout(() => {
            if(!messageContainerRef.current) return;
            const {scrollTop, scrollHeight} = messageContainerRef.current;
            messageContainerRef.current.scrollBy({top: scrollHeight - scrollTop, behavior: 'smooth'})
        }, 500);
        return () => {
            clearTimeout(scrollTimer);
        }
    }, [messages])
    useEffect(() => {
        if(!current_id) return;
        socket.on('TICKETS_BY_ID', (data) => {
            dispatch(ticketActions.setTicket(data));
            console.log(data, 'assa');
            setBigLoader(false);
        });
        socket.on('TICKETS_MESSAGES_BY_TICKET_ID', (data) => {
            console.log(data, 'assa');
            setMessages(data);
            setBigLoader(false);

        })
        socket.on('TICKETS_MESSAGES_UPDATED', () => {
            socket.emit('TICKETS_GET_MESSAGES_BY_TICKET_ID', {ticket_id: current_id, offset: 0});
            socket.emit('TICKET_GET_BY_ID', {id: current_id});
            setBigLoader(false);
        })
        socket.emit('TICKET_GET_BY_ID', {id: current_id});
        socket.emit('TICKETS_GET_MESSAGES_BY_TICKET_ID', {ticket_id: current_id, offset: 0});
        return () => {
            socket.off('TICKETS_BY_ID');
            socket.off('TICKETS_MESSAGES_BY_TICKET_ID');
            socket.off('TICKETS_MESSAGES_UPDATED');
        };
    }, [dispatch, socket, current_id, setBigLoader])


    useEffect(() => {
        const onScroll = () => {
            ticketInfoRef?.current?.click();
        }
        if(messageContainerRef.current && ticketInfoRef.current) {

            messageContainerRef.current.addEventListener('scroll', onScroll);
        }
        return () => {
            if (messageContainerRef.current) {
                messageContainerRef.current.removeEventListener('scroll', onScroll)
            }
        }
    })

    return (
        <Panel id={id}>
            <Group>
                <SimpleCell
                    after={<Dropdown
                        content={<Div style={{padding: '5px 0'}}>
                            {isSpecial && <OptionElement
                                before={<Icon20DoorArrowRightOutline />}
                                onClick={closeTicket}>
                                Закрыть тикет
                            </OptionElement>}
                            <OptionElement
                                before={<Icon20CopyOutline />}
                                onClick={() => copyClipboard(LINK_APP + '#ticket=' + ticketInfo?.ticket?.id)}>
                                Скопировать ссылку
                            </OptionElement>
                        </Div>}>
                            <CellButton>
                                Действия
                            </CellButton>
                        </Dropdown> }
                    getRootRef={ticketInfoRef as React.RefObject<HTMLElement>}
                    style={{paddingLeft: 0}}
                    before={<IconButton onClick={() => window.history.back()} style={{marginRight: 5}}>
                        <Icon28ArrowLeftOutline style={{color: 'var(--header_text_secondary)'}} />
                    </IconButton>}
                    disabled
                    description={ticket?.status != null ?
                        <span style={{color: TICKET_STATUS_TEXTS[ticket.status][1]}}>
                            {TICKET_STATUS_TEXTS[ticket.status][0]}
                        </span> : 'На рассмотрении'}
                >
                    {ticket?.title && ticket.title + ' #' + ticket.id}
                </SimpleCell>
            </Group>
            <Group>
                <CustomScrollView className={styles.messagesBox} boxRef={messageContainerRef as React.RefObject<HTMLDivElement>}>
                    {messages ?
                        <TransitionGroup>
                        {messages.messages.map((v, i) => {
                            let user = messages.users.find(user => user.id === v.author_id);
                            let special = messages.users.find(user => user.id === v.comment_author_id);
                            if(!user) return undefined;
                            const options = (
                                <TicketOptions
                                    canEdit={(v.author_id === account.id || (isSpecial && v.author_id < 0))
                                    && v.mark === -1}
                                    adminButtons={isSpecial}
                                    onClickCopyText={() => copyClipboard(v.text)}
                                    onClickMark={(mark) => markMessage(v.id, mark)}
                                    onClickProfile={() => {}}
                                    onClickWriteComment={() => {
                                        setCurrentMessage(v.id);
                                        setInputText(prev => v.comment ?? prev);
                                        setInputState(INPUT_STATES.WRITING_COMMENT);
                                    }}
                                    onClickEdit={() => {
                                        setCurrentMessage(v.id);
                                        setInputText(v.text);
                                        setInputState(INPUT_STATES.EDIT);
                                    }}>
                                    <IconButton aria-label='Меню' className='gray'>
                                        <Icon24MoreHorizontal/>
                                    </IconButton>
                                </TicketOptions>
                            )
                            let specialLabel;
                            if([0,1].includes(v.mark)) {
                                const isGoodAnswer = v.mark === 1;
                                if(isSpecial) {
                                    specialLabel = <span className={isGoodAnswer ?
                                        'good_answer' : 'bad_answer'}>
                                        Оценка от Специального агента #{v.mark_author_id}
                                    </span>;
                                } else {
                                    specialLabel =
                                        <span className={isGoodAnswer ?
                                            'good_answer' : 'bad_answer'}>
                                            {isGoodAnswer ?
                                                'Положительный ответ':'Отрицательный ответ'}
                                        </span>;
                                }
                            }
                            return (
                                <CSSTransition
                                    classNames='message'
                                    key={v.id}
                                    timeout={{
                                        enter: 200,
                                        exit: 500
                                    }}
                                >
                                    <>
                                        <Message
                                            editTime={v.edited_at}
                                            specialLabel={specialLabel}
                                            separator={messages.messages.length !== i + 1 && !v.comment}
                                            avatar_url={user.avatar}
                                            author_name={`${user.first_name} ${user.last_name}`}
                                            time={v.created_at}
                                            after={options}>
                                            {v.text}
                                        </Message>
                                        {v.comment && <Message
                                            specialLabel={v.can_fix_to && v.can_fix_to > getTime() ? `Исправить ответ можно до ${getHumanyTime(v.can_fix_to).datetime}` : null}
                                            separator={messages.messages.length !== i + 1}
                                            before={<Avatar
                                            src={special.avatar}
                                            alt='ava'
                                            style={{position: 'relative'}}
                                            shadow={false}>
                                                <IconBombViolet style={{position: 'absolute', bottom: -4, right: -1}} size={20} />
                                            </Avatar>}
                                            author_name={`${special.first_name} ${special.last_name}`}
                                            time={v.commented_at}>
                                            {v.comment}
                                        </Message>}
                                    </>
                                </CSSTransition>

                            )
                        })}
                    </TransitionGroup>
                        : <PanelSpinner size='large' height={495} />}

                </CustomScrollView>
            </Group>

            <FixedLayout 
                vertical='bottom'
                filled 
                className={styles.fixedLayout}>
                {getFixedLayout()}
            </FixedLayout>
        </Panel>
    )
}