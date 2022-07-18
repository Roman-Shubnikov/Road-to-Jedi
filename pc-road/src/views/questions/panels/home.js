import React, {useContext, useEffect, useState} from 'react';
import {
    Panel,
    Group,
    Tabs,
    TabsItem,
    Separator, SimpleCell,
} from '@vkontakte/vkui';
import {SocketContext} from "../../../context/soket";
import {useDispatch, useSelector} from "react-redux";
import {ticketActions, ticketSelector} from "../../../store/main";


export const Home = props => {
    const dispatch = useDispatch();
    const {tickets} = useSelector(ticketSelector);
    const [activeTab, setActiveTab] = useState('all');
    const socket = useContext(SocketContext);

    const clickTab = (tab) => {
		return {
            onClick: () => setActiveTab(tab),
            selected: activeTab === tab,
        }
	}
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

	useEffect(() => {
	    socket.on('TICKETS_CURR', (tickets) => {
	        dispatch(ticketActions.setTickets({tickets, ticketsCurrent: null}))
        })
        socket.emit('TICKETS_GET');
	    return () => {
            socket.off('TICKETS_CURR')
        }
    }, [])
    return (
        <Panel id={props.id}>
            <Group>
                <Tabs>
                    <TabsItem
                    {...clickTab('all')}>
                        Все вопросы
                    </TabsItem>
                    <TabsItem
                    {...clickTab('my')}>
                        Рассматриваемые мной
                    </TabsItem>
                </Tabs>
                <Separator className='sep-wide' />
                {tickets?.map(v =>
                <SimpleCell>
                    {v.title}
                </SimpleCell>)}
            </Group>

        </Panel>
    )
}