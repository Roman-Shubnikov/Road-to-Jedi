import { 
    Button, 
    Placeholder,
    Panel,
    PanelHeader,
    PanelHeaderBack,
} from '@vkontakte/vkui';
import React from 'react';
import { useSelector } from 'react-redux';
import Cat from './images/Cat.svg'

export default props => {
    const TicketInfo = useSelector((state) => state.tickets.ticketInfo.info)
    return(
        <Panel id={props.id}>
            <PanelHeader 
                left={
                    <PanelHeaderBack onClick={() => window.history.back()}></PanelHeaderBack>
                }>
                    Вопрос #{TicketInfo ? TicketInfo.id : "..."}
            </PanelHeader>
            <Placeholder stretched
            action={
                <Button size='m' onClick={() => props.goQuestions()}>
                    Вопросы
                </Button>
            }
            icon={<img style={{width: 150, height: 150}} src={Cat} alt='jedi' />}
            header='Вы дали ответ'>
                Ваш ответ был отправлен на модерацию к специльным агентам. Самое время переходить к другим вопросам.
            </Placeholder>
        </Panel>
            
    )
}