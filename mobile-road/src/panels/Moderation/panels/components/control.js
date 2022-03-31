import React from 'react';

import { 
    Group, 
    Banner,
    Button,
    SimpleCell,
    PanelSpinner,
    Counter,

 } from '@vkontakte/vkui';

import { 
    Icon28Users3Outline,
    Icon28MessagesOutline,
    Icon28QuestionOutline,
    Icon28ErrorCircleOutline,

} from '@vkontakte/icons';
import BG_spec from '../../../../images/bg_spec_force.png'
import { API_URL, SPEC_COURCE_LINKS } from '../../../../config';
import { useState } from 'react';
import { useEffect } from 'react';


export default props => {
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
            <Banner
                mode="image"
                header="Курс молодого бойца"
                subheader="Почитайте статью о том, как работать
                            с данным интерфейсом"
                background={
                <div
                    style={{
                    backgroundColor: "#7F24BF",
                    backgroundImage: 'url(' + BG_spec + ')',
                    backgroundPosition: "right center",
                    backgroundSize: '120%',
                    backgroundRepeat: "no-repeat",
                    }}
                />
                }
                actions={<Button 
                style={{backgroundColor: '#fff', color: '#222'}}
                href={SPEC_COURCE_LINKS.cource} 
                target="_blank" 
                rel="noopener noreferrer" 
                mode="neutral">Читать</Button>}
            />
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
                after={<Counter>{sysInfo?.questions_count}</Counter>}>
                    Вопросы в системе
                </SimpleCell>
            </> : <PanelSpinner />}
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
        </Group>
        </>
    )
    
}