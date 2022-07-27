import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    ButtonGroup,
    Div,
    FixedLayout,
    Group,
    IconButton,
    Panel, PanelSpinner,
    Separator,
    SimpleCell,
    WriteBar
} from "@vkontakte/vkui";
import {TicketOptions} from "./ticketOptions";
import {Icon24MoreHorizontal} from "@vkontakte/icons";
import {TICKET_STATUS_TEXTS} from "../../config";
import styles from './ticketOptions.module.css'
import {SocketContext} from "../../context/soket";
import {useDispatch, useSelector} from "react-redux";
import {ticketActions, ticketSelector} from "../../store/main";
import {ITicket} from "../../types";
import {Message} from "../../components/Message";
import {useNavigation} from "../../hooks";


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
    const { setBigLoader } = useNavigation();
    const dispatch = useDispatch();
    const [fetching, setFetching] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<null|{count: number, messages: IMessage[], users: any[]}>(null);
    const { current_id, ticketInfo }: {current_id: number, ticketInfo: {ticket: ITicket|null, users: any[]}} = useSelector(ticketSelector)
    const socket = useContext(SocketContext);

    const sendMessage = () => {
        setBigLoader();
        setFetching(true);
        socket.emit('TICKETS_SEND_MESSAGE',
            {
                text: message,
                ticket_id: 1,
            })
        setMessage('')
        setTimeout(() => {
            setBigLoader(false);
            setFetching(false);
        }, 1)
    }

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
        socket.emit('TICKET_GET_BY_ID', {id: current_id});
        socket.emit('TICKETS_GET_MESSAGES_BY_TICKET_ID', {ticket_id: current_id, offset: 0});
        return () => {
            socket.off('TICKETS_BY_ID');
            socket.off('TICKETS_MESSAGES_BY_TICKET_ID');
        };
    }, [dispatch, socket, current_id])
    const options = (
        <TicketOptions>
            <IconButton aria-label='Меню' className='gray'>
                <Icon24MoreHorizontal/>
            </IconButton>
        </TicketOptions>
    )

    return (
        <Panel id={id}>
            <Group>
                <SimpleCell
                    disabled
                    description={ticketInfo?.ticket?.status != null ?
                        <span style={{color: TICKET_STATUS_TEXTS[ticketInfo.ticket.status][1]}}>
                            {TICKET_STATUS_TEXTS[0][0]}
                        </span> : 'На рассмотрении'}
                >
                    {ticketInfo?.ticket?.title}
                </SimpleCell>
            </Group>
            <Group>
                <div style={{maxHeight: 495, overflowY: 'auto'}}>
                    {messages ? messages.messages.map(v => {
                        let user = messages.users.find(user => user.id === v.author_id);
                        return (
                            <Message
                                key={v.id}
                                avatar_url={user.avatar}
                                author_name={`${user.first_name} ${user.last_name}`}
                                time={v.created_at}
                                after={options}>
                                {v.text}
                            </Message>
                        )
                    }) : <PanelSpinner />}
                </div>
            </Group>

            <FixedLayout 
                vertical='bottom'
                filled 
                className={styles.fixedLayout}>
                <WriteBar
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