import React from 'react';

import { 
    Group, 
    Banner,
    Button,
    SimpleCell,
    PanelSpinner,
    Counter,
    Placeholder,

 } from '@vkontakte/vkui';

import { 
    Icon28Users3Outline,
    Icon28MessagesOutline,
    Icon28QuestionOutline,
    Icon28ErrorCircleOutline,
    Icon28LifebuoyOutline,
    Icon28BrainOutline,
    Icon28UserCardOutline,
    Icon28PenStackOutline,

} from '@vkontakte/icons';
import { API_URL, SPEC_COURCE_LINKS } from '../../../../config';
import { useState } from 'react';
import { useEffect } from 'react';
import { Icon64ServicesSearch } from '../../assets';


export const Control = props => {
    const [sysInfo, setSysInfo] = useState(null);
    const getSysInfo = () => {
        fetch(API_URL + `method=special.getSysInfo&` + window.location.search.replace('?', ''))
        .then(data => data.json())
        .then(data => {
        if (data.result) {
            setSysInfo(data.response)
        }
        })
        .catch(err => console.log())
    }
    useEffect(() => {
        getSysInfo();
    }, [])
    return (
        <>
        <Group>
            <Placeholder
            header='Курс молодого бойца'
            action={
            <Button
            size='m'
            rel="noopener noreferrer" 
            href={SPEC_COURCE_LINKS.cource} 
            target="_blank" 
            >
                Читать статью
            </Button>}
            icon={<Icon64ServicesSearch />}>
                Почитайте статью о том, как работать с данным интерфейсом
            </Placeholder>
        </Group>
        <Group>
            {sysInfo ? <>
                <SimpleCell
                disabled
                before={<Icon28ErrorCircleOutline />}
                after={<Counter>{sysInfo?.banned}</Counter>}>
                    Заблокированные агенты
                </SimpleCell>
                <SimpleCell
                disabled
                before={<Icon28QuestionOutline />}
                after={<Counter>{sysInfo?.questions}</Counter>}>
                    Вопросы в системе
                </SimpleCell>
                <SimpleCell
                disabled
                before={<Icon28BrainOutline />}
                after={<Counter>{sysInfo?.answers}</Counter>}>
                    Ответы в системе
                </SimpleCell>
                <SimpleCell
                disabled
                before={<Icon28PenStackOutline />}
                after={<Counter>{sysInfo?.comments}</Counter>}>
                    Комментарии в системе
                </SimpleCell>
                <SimpleCell
                disabled
                before={<Icon28UserCardOutline />}
                after={<Counter>{sysInfo?.agents}</Counter>}>
                    Агенты в системе
                </SimpleCell>
            </> : <PanelSpinner height={240} />}
        </Group>
        <Group>
            <SimpleCell
            before={<Icon28Users3Outline />}
            href={SPEC_COURCE_LINKS.community}
            target="_blank" 
            rel="noopener noreferrer">
                Общество уменьшения энтропии
            </SimpleCell>
            <SimpleCell
            before={<Icon28MessagesOutline />}
            href={SPEC_COURCE_LINKS.conversation}
            target="_blank" 
            rel="noopener noreferrer">
                Чат специальных агентов
            </SimpleCell>
            <SimpleCell
            before={< Icon28LifebuoyOutline />}
            href={SPEC_COURCE_LINKS.messages_help}
            target="_blank" 
            rel="noopener noreferrer">
                Обращения агентов
            </SimpleCell>
        </Group>
        </>
    )
    
}