import React, {useContext, useEffect, useState} from 'react';
import {
    Panel,
    Group,
    SimpleCell,
    Pagination, List, PanelSpinner, Placeholder, Button,
} from '@vkontakte/vkui';
import {SocketContext} from "../../../context/soket";
import {useDispatch, useSelector} from "react-redux";
import {ticketActions, ticketSelector} from "../../../store/main";

const TICKETS_PER_PAGE = 100;
export const Home = props => {
    const dispatch = useDispatch();
    const {tickets, myTickets} = useSelector(ticketSelector);
    const socket = useContext(SocketContext);
    const [currentPage, setCurrentPage] = useState(1);


	useEffect(() => {
	    socket.on('TICKETS_CURR', (tickets) => {
	        dispatch(ticketActions.setTickets(tickets.tickets))
            console.log(tickets)

        })
        socket.on('TICKETS_MY_REVIEW', (tickets) => {
            dispatch(ticketActions.setMyTickets(tickets))
        })
        socket.emit('TICKETS_GET', {offset: (currentPage-1)*TICKETS_PER_PAGE});
	    socket.emit('TICKETS_MY_REVIEW');
        return () => {
            socket.off('TICKETS_CURR')
        }
    }, [socket, dispatch, currentPage])
    return (
        <Panel id={props.id}>
            {myTickets && !!myTickets.length && <Group>
                <TicketsList tickets={myTickets} />
            </Group>}
            <Group>
                <TicketsList tickets={tickets} />

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
const TicketsList = ({tickets}) => {
    return (
        <List>
            {!tickets && <PanelSpinner />}
            {tickets && !tickets.length &&
            <Placeholder>
                Здесь пока пусто
            </Placeholder>}
            {!!tickets?.length && tickets.map(v =>
                <TicketPreview
                    key={v.id}
                    status={v.status}
                    id={v.id}>
                    {v.title}
                </TicketPreview>)}
        </List>
    )
}

const TicketPreview = ({id, children, status}) => {
    const getIconTicketByStatus = (status) => {
        switch (status) {
            case 0:
                return;
            case 1:
                return;
            case 2:
                return;
            case 3:
                return;
            case 4:
                return;
            case 5:
                return;
            default:
                return;
        }
    }
    return (
        <SimpleCell>
            {children}
        </SimpleCell>
    )
}