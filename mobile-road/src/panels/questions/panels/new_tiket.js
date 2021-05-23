import React, { useState } from 'react';
import {API_URL} from '../../../config';

import { 
    Panel,
    PanelHeader,
    Button,
    ScreenSpinner,
    Input,
    FormLayout,
    Textarea,
    PanelHeaderBack,
    Checkbox,
    Group,
    FormItem,
    } from '@vkontakte/vkui';
import { viewsActions } from '../../../store/main';
import { useDispatch } from 'react-redux';

export default props => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [check1, setCheck1] = useState(false);
    const { setPopout, showErrorAlert } = props.callbacks;

    const getRandomInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const sendNewTiket = () => {
        setPopout(<ScreenSpinner />)
        fetch(API_URL + "method=ticket.add&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'title': title,
                    'text': text,
                    'user': getRandomInRange(501, 624429367),
                    'donut_only': check1,
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setTitle("");
                    setText("");
                    setCheck1(false);
                    setPopout(null)
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                dispatch(viewsActions.setActiveStory('disconnect'))
            })
    }

    return(
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Новый вопрос
                </PanelHeader>
            <Group>
                <FormLayout>
                    <FormItem top={"Суть проблемы (" + title.length + "/80). Не менее 5 символов"}
                    >
                        <Input
                            maxLength="80"
                            type="text"
                            placeholder='Введите свой текст...'
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)} />
                    </FormItem>
                    <FormItem top={"Подробнее о проблеме (" + text.length + "/2020). Не менее 5 символов"}
                    >
                        <Textarea 
                            maxLength="2020"
                            onChange={(e) => setText(e.currentTarget.value)}
                            placeholder='Введите свой текст...'
                            value={text}
                        />
                    </FormItem>
                    <Checkbox checked={check1} onChange={() => setCheck1(prev => !prev)}>
                        Разрешить оценивать вопрос
                    </Checkbox>
                    <Checkbox checked={check1} onChange={() => setCheck1(!check1)}>
                        Только для донов
                    </Checkbox>
                    <FormItem>
                        <Button
                            size="l"
                            level="secondary"
                            stretched
                            disabled={!Boolean(text.length > 5) || !Boolean(title.length > 5)}
                            onClick={
                                () => {
                                    sendNewTiket();
                                }
                            }>Отправить</Button>
                    </FormItem>
                </FormLayout>
            </Group>

        </Panel>
    )
}