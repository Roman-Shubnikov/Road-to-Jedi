import React, {useContext, useEffect, useState} from 'react';
import {Avatar, Group, Header, List, Pagination, Panel, PanelSpinner, Placeholder, SimpleCell, Separator} from '@vkontakte/vkui';
import {SocketContext} from "../../../context/soket";
import {useDispatch, useSelector} from "react-redux";
import {ticketActions, ticketSelector} from "../../../store/main";
import {useNavigation} from "../../../hooks";
import {ITicket} from "../../../types";
import {getHumanyTime} from "../../../Utils";
import {
    Icon56ArchiveOutline,
    Icon56CheckCircleOutline,
    Icon56ErrorTriangleOutline,
    Icon56RecentOutline,
    Icon24CalendarOutline, Icon56ErrorOutline,

} from '@vkontakte/icons';
const TICKETS_PER_PAGE = 100;

type IHome = {
    id: string,
}


export const Home = (props: IHome) => {
    const { id } = props;
    const dispatch = useDispatch();
    const {tickets, myTickets} = useSelector(ticketSelector);
    const socket = useContext(SocketContext);
    const [currentPage, setCurrentPage] = useState(1);


	useEffect(() => {
	    socket.on('TICKETS_CURR', (tickets) => {
	        dispatch(ticketActions.setTickets(tickets))
            console.log(tickets)

        })
        socket.on('TICKETS_MY_REVIEW', (tickets) => {
            dispatch(ticketActions.setMyTickets(tickets))
            console.log(tickets, 'ada')
        })
        socket.emit('TICKETS_GET', {offset: (currentPage-1)*TICKETS_PER_PAGE});
	    socket.emit('TICKETS_MY_REVIEW');
        return () => {
            socket.off('TICKETS_CURR');
            socket.off('TICKETS_MY_REVIEW')
        }
    }, [socket, dispatch, currentPage])

    console.log(myTickets);

    return (
        <Panel id={id}>
            {myTickets?.tickets && !!myTickets.tickets.length && <Group header={<Header>Рассматриваемые мной</Header>}>
                <TicketsList ticketsInfo={myTickets} />
            </Group>}
            <Group header={<Header>Все вопросы</Header>}>
                {tickets ? <TicketsList ticketsInfo={tickets} /> : <PanelSpinner />}

                <div style={{display: 'flex', justifyContent: 'center', marginTop: 10}}>
                    <Pagination
                        currentPage={currentPage}
                        onChange={setCurrentPage}
                        totalPages={tickets?.count ? Math.ceil(tickets.count / TICKETS_PER_PAGE) : 1}
                    />
                </div>
            </Group>

        </Panel>
    )
}

type ITicketsList = {
    ticketsInfo: {
        tickets: ITicket[],
        count: number,
        users: ShortUserInfo[]
    },
}

const TicketsList = (props: ITicketsList) => {
    const { ticketsInfo } = props;
    const {tickets, users} = ticketsInfo;
    return (
        <List>
            {!tickets && <PanelSpinner />}
            {tickets && !tickets.length &&
            <Placeholder>
                Здесь пока пусто
            </Placeholder>}
            {!!tickets?.length && tickets.map(v => {
                let user = users.find(user => user.id === v.author_id);
                if(user === undefined) return null;
                return (<>
                    <TicketPreview
                        author={user}
                        key={v.id}
                        created_at={v.created_at}
                        status={v.status}
                        id={v.id}>
                        {v.title}
                    </TicketPreview>
                    <Separator />
                    </>)
            })}
        </List>
    )
}

type ShortUserInfo = {
    permissions: number,
    id: number,
    first_name: string,
    last_name: string,
    avatar: string,
}
type ITicketPreview = {
    id: number,
    children: string,
    status: number,
    author: ShortUserInfo,
    created_at: number,
}

const TicketPreview = (props: ITicketPreview) => {
    const {id, children, status, author, created_at} = props;
    const dispatch = useDispatch();
    const { goPanel } = useNavigation();
    const getIconTicketByStatus = (status: number) => {
        switch (status) {
            case 2:
            case 4:
                return <Icon56CheckCircleOutline width={41} height={41} style={{ color: 'var(--clock_support_green)'}} />;
            case 3:
                return <Icon56ErrorOutline width={41} height={41} style={{ color: 'var(--warn)'}} />;
            case 0:
            case 1:
            default:
                return <Icon56RecentOutline width={41} height={41} style={{ color: 'var(--warn)'}} />;
        }
    }
    return (
        <SimpleCell
            onClick={() => {
            dispatch(ticketActions.setTicketId(id))
            goPanel('Questions', 'ticket', true);
            }}
            before={getIconTicketByStatus(status)}
            after={
                <SimpleCell
                    disabled
                    description={getHumanyTime(created_at).date + ' в ' + getHumanyTime(created_at).time}
                    before={<Avatar src={author.avatar} alt='ava' />}>
                    {author.first_name} {author.last_name}
                </SimpleCell>
            }>
            {children}
        </SimpleCell>
    )
}