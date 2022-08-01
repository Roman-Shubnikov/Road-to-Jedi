import React, {useContext, useEffect, useRef, useState} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import bridge from '@vkontakte/vk-bridge';
import {
    Button,
    ButtonGroup,
    Div,
    FixedLayout,
    Group,
    IconButton,
    Panel,
    PanelSpinner,
    Separator,
    SimpleCell,
    WriteBar
} from "@vkontakte/vkui";
import {TicketOptions} from "./ticketOptions";
import {
    Icon24MoreHorizontal,
    Icon28ArrowLeftOutline
} from "@vkontakte/icons";
import {PERMISSIONS, TICKET_STATUS_TEXTS} from "../../config";
import styles from './ticketOptions.module.css'
import {SocketContext} from "../../context/soket";
import {useDispatch, useSelector} from "react-redux";
import {ticketActions, ticketSelector} from "../../store/main";
import {ITicket} from "../../types";
import {Message} from "../../components/Message";
import {useNavigation, useUser} from "../../hooks";


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
export const Ticket = (props: ITicketComponent) => {
    const { id } = props;
    const { account } = useUser();
    const { setBigLoader, setSuccessfulSnack } = useNavigation();
    const messageContainerRef = useRef<HTMLDivElement>();
    const inputRef = useRef<HTMLTextAreaElement>();
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<null|{count: number, messages: IMessage[], users: any[]}>(null);
    const { current_id, ticketInfo }: {current_id: number, ticketInfo: {ticket: ITicket|null, users: any[]}} = useSelector(ticketSelector);
    const { ticket=null } = ticketInfo;
    const socket = useContext(SocketContext);

    const sendMessage = () => {
        if(!ticket) return;
        setBigLoader();
        setFetching(true);
        socket.emit('TICKETS_SEND_MESSAGE',
            {
                text: message,
                ticket_id: ticket.id,
            })
        setMessage('')
        setTimeout(() => {
            setBigLoader(false);
            setFetching(false);
        }, 1)
    }
    const copyClipboard = async (text: string) => {
        await bridge.send("VKWebAppCopyText", { text: text });
        await navigator.clipboard.writeText(text)
    }
    const markMessage = (message_id: number, mark: number) => {
        setBigLoader();
        socket.emit('TICKETS_MARK_MESSAGE', {
            message_id,
            mark
        })
        setTimeout(() => {
            setBigLoader(false);
            // setSuccessfulSnack('')
        }, 1)
    }
    const removeMessage = (id:number) => {
        if(!messages) return;
        let messagesObject = {...messages};
        let messages_copy = [...messagesObject.messages];
        let index = messages_copy.findIndex(v => v.id === id);
        console.log(messages_copy, messages_copy.splice(index, 1));
        console.log(id, index, messages_copy)
        messagesObject.messages = messages_copy;
        console.log(messagesObject, messages_copy);
        setMessages(messagesObject);
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
        });
        socket.on('TICKETS_MESSAGES_BY_TICKET_ID', (data) => {
            console.log(data, 'assa');
            setMessages(data);

        })
        socket.on('TICKETS_MESSAGES_UPDATED', () => {
            socket.emit('TICKETS_GET_MESSAGES_BY_TICKET_ID', {ticket_id: current_id, offset: 0});
        })
        socket.emit('TICKET_GET_BY_ID', {id: current_id});
        socket.emit('TICKETS_GET_MESSAGES_BY_TICKET_ID', {ticket_id: current_id, offset: 0});
        return () => {
            socket.off('TICKETS_BY_ID');
            socket.off('TICKETS_MESSAGES_BY_TICKET_ID');
            socket.off('TICKETS_MESSAGES_UPDATED');
        };
    }, [dispatch, socket, current_id])


    return (
        <Panel id={id}>
            <Group>
                <SimpleCell
                    style={{paddingLeft: 0}}
                    before={<IconButton onClick={() => window.history.back()} style={{marginRight: 5}}>
                        <Icon28ArrowLeftOutline style={{color: 'var(--header_text_secondary)'}} />
                    </IconButton>}
                    disabled
                    description={ticket?.status != null ?
                        <span style={{color: TICKET_STATUS_TEXTS[ticket.status][1]}}>
                            {TICKET_STATUS_TEXTS[0][0]}
                        </span> : 'На рассмотрении'}
                >
                    {ticket?.title && ticket.title + ' #' + ticket.id}
                </SimpleCell>
            </Group>
            <Group>
                <div style={{maxHeight: 495, minHeight: 495, overflowY: 'auto'}} ref={messageContainerRef as React.RefObject<HTMLDivElement>}>
                    {messages ?
                        <TransitionGroup>
                        {messages.messages.map((v, i) => {
                            let user = messages.users.find(user => user.id === v.author_id);
                            if(!user) return undefined;
                            const options = (
                                <TicketOptions
                                    adminButtons={account.permissions > PERMISSIONS.special}
                                    onClickCopyText={() => copyClipboard(v.text)}
                                    onClickMark={(mark) => markMessage(v.id, mark)}
                                    onClickProfile={() => {}}
                                    onClickWriteComment={() => {}}
                                    onClickRemove={() => removeMessage(v.id)}>
                                    <IconButton aria-label='Меню' className='gray'>
                                        <Icon24MoreHorizontal/>
                                    </IconButton>
                                </TicketOptions>
                            )
                            let specialLabel;
                            if(account.permissions >= PERMISSIONS.special) {
                                if([0,1].includes(v.mark)) {
                                    specialLabel = <span className={v.mark === 1 ? 'good_answer':'bad_answer'}>
                                        Оценка от Специального агента #{v.mark_author_id}
                                    </span>;
                                }

                            } else {
                                switch (v.mark) {
                                    case 1:
                                        specialLabel = <span className='good_answer'>Положительный ответ</span>;
                                        break;
                                    case 0:
                                        specialLabel = <span className='bad_answer'>Отрицательный ответ</span>;
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
                                    <Message
                                        specialLabel={specialLabel}
                                        separator={messages.messages.length !== i + 1}
                                        avatar_url={user.avatar}
                                        author_name={`${user.first_name} ${user.last_name}`}
                                        time={v.created_at}
                                        after={options}>
                                        {v.text}
                                    </Message>
                                </CSSTransition>

                            )
                        })}
                    </TransitionGroup>
                        : <PanelSpinner size='large' height={495} />}

                </div>
            </Group>

            <FixedLayout 
                vertical='bottom'
                filled 
                className={styles.fixedLayout}>
                <WriteBar
                    getRef={inputRef as React.RefObject<HTMLTextAreaElement>}
                    onChange={e => setMessage(e.currentTarget.value)}
                    value={message}
                    className={styles.input}
                    placeholder="Сообщение" />
                <Separator className='sep-wide' />
                <Div style={{backgroundColor: 'var(--secondary_background)'}}>
                    <ButtonGroup stretched style={{justifyContent: 'right'}}>
                        <Button size='m'>
                            Без оформления
                        </Button>
                        <Button size='m'>
                            Орфография
                        </Button>
                        <Button size='m'>
                            Нецелесообразный ответ
                        </Button>
                        <Button
                            disabled={message.length < 1}
                            loading={fetching}
                            onClick={sendMessage}
                            size='m'>
                            Отправить
                        </Button>
                    </ButtonGroup>
                </Div>
            </FixedLayout>
        </Panel>
    )
}