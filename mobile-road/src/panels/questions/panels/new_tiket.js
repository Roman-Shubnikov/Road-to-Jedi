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
    Group,
    FormItem,
    FormStatus,
    } from '@vkontakte/vkui';
import { viewsActions } from '../../../store/main';
import { useDispatch } from 'react-redux';

export default props => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const { setPopout, showErrorAlert, showAlert } = props.callbacks;
    const sendNewTiket = () => {
        setPopout(<ScreenSpinner />)
        fetch(API_URL + "method=ticket.addNewModerationTicket&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'title': title,
                    'text': text,
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setTitle("");
                    setText("");
                    showAlert('Успех', "Ваш вопрос отправлен в модерацию, ожидайте")
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
                    <FormStatus>
                        Когда вы задаёте вопрос, помните, что нельзя помещать в него нецензурные выражения. Старайтесь быть вежливыми.
                        Когда вам ответят, вы сможете выбрать решил ли ответ вашу проблему или нет. Пожалуйста, не забывайте выбирать это. Так мы сможем понять помогли ли мы вам.
                        Вы можете сами отвечать на вопросы пользователей, став агентом. Для этого нужно перейти на вкладку «Профиль» и пройти тест на агента.
                    </FormStatus>
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