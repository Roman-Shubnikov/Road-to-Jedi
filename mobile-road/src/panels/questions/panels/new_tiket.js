import React, { useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
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
    SimpleCell,
    Switch,
    } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { GreenCard } from '../../../components/GreenCard';

export default props => {
    const { goDisconnect } = props.navigation;
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const { account } = useSelector((state) => state.account)
    const { setPopout, showErrorAlert, showAlert } = props.callbacks;
    const [noty, setNoty] = useState(() => (account.settings.generator_noty));
    const saveSettings = (setting, value) => {
        setPopout(<ScreenSpinner />)
        fetch(API_URL + "method=settings.set&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'setting': setting,
                    'value': value,
                })
            })
            .then(data => data.json())
            .then(data => {
                if (data.result) {
                    setPopout(null)
                    setTimeout(() => {
                        props.reloadProfile();
                    }, 4000)
                } else {
                    showErrorAlert(data.error.message);
                }
            })
            .catch(goDisconnect)
    }
    const setNotify = (check) => {
        check = check.currentTarget.checked;
        console.log(check);
        if (check) {
            bridge.send("VKWebAppAllowMessagesFromGroup", { "group_id": 188280516 }).then(data => {
                setNoty(check)
                saveSettings('generator_noty', Number(check))
            }).catch(() => showErrorAlert("Вы не разрешили сообщения группы"))
        } else {
            setNoty(check)
            saveSettings('generator_noty', Number(check))
        }

    }
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
                    showAlert('Отправлено', "Вопрос отправлен на модерацию. Примерное время ожидания сейчас: 5 часов.")
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(goDisconnect)
    }

    return(
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Новый вопрос
                </PanelHeader>
            <Group>
                {console.log(noty)}
                <SimpleCell
                    disabled
                    multiline
                    description='После активации данной функции Вам будут поступать в личные сообщения результаты рассмотрения вопросов'
                    after={
                        <Switch
                            checked={noty}
                            onChange={(e) => setNotify(e)} />
                    }
                >
                    Уведомления
                </SimpleCell>
            </Group>
            <Group>
                <FormLayout>
                    <FormItem>
                        <GreenCard header='При создании вопросов обращайте внимание на:'>
                            — то, чтобы название или описание не содержало нецензурной брани (маты - не круто);<br />
                            — то, чтобы вопрос был креативным и новым (скучно много раз отправлять одни и те же инструкции);<br />
                            — то, чтобы вопрос был грамотным (если это не его фишка).<br /><br />

                            Приветствуются вопросы о ВКонтакте, жизни и философии.
                            Пишите вопрос только в случае, если сами знаете на него ответ!
                        </GreenCard>
                    </FormItem>
                    
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