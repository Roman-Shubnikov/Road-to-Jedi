import React, { useCallback, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';

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
    Div,
    InfoRow,
    FormStatus,
    Progress,
    FormItem,
    Group,
    Switch,
    SimpleCell,
    Subhead,

    } from '@vkontakte/vkui';
import { useDispatch, useSelector } from 'react-redux';
import { enumerate, errorAlertCreator } from '../../../Utils';
import { API_URL, GENERATOR_NORM } from '../../../config';
import { viewsActions } from '../../../store/main';
export default props => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const { account } = useSelector((state) => state.account)
    const { setPopout, showErrorAlert, setActiveModal } = props.callbacks;
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
    const [check1, setCheck1] = useState(false);
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
            .catch(err => {
                setActiveStory('disconnect');
            })
    }
    const setNotify = (check) => {
        check = check.currentTarget.checked;
        if (check) {
            bridge.send("VKWebAppAllowMessagesFromGroup", { "group_id": 201151841 }).then(data => {
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
        if (text.length > 5 || title.length > 5) {
            fetch(API_URL + "method=special.addNewModerationTicket&" + window.location.search.replace('?', ''),
                {
                    method: 'post',
                    headers: { "Content-type": "application/json; charset=UTF-8" },
                    body: JSON.stringify({
                        'title': title,
                        'text': text,
                        'donut_only': check1
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if (data.result) {
                        setText('');
                        setTitle('');
                        setCheck1(false);
                        setPopout(null)
                    } else {
                        showErrorAlert(data.error.message)
                    }
                })
                .catch(err => {
                    setActiveStory('disconnect');
                })
        } else {
            errorAlertCreator(setPopout, "Заголовок или текст проблемы должен быть больше 5 символов.")
        }
    }
    return (
        <Panel id={props.id}>
            <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Новый вопрос
                </PanelHeader>
            {(account['bad_answers'] !== null && account['bad_answers'] !== undefined) ?
                <Group>
                    <Div>
                        <FormStatus onClick={() => setActiveModal('answers')}>
                            <div style={{ textAlign: 'center', color: "var(--text_profile)", marginBottom: 15 }}>
                                Вы сгенерировали <span style={{ color: 'var(--header_text)' }}>{account['bad_answers']} {enumerate(account['bad_answers'], ['вопрос', 'вопроса', 'вопросов'])}</span>
                            </div>
                            <InfoRow>
                                <Progress
                                    value={account['bad_answers'] ? account['bad_answers'] / GENERATOR_NORM * 100 : 0} />
                                <div style={{ textAlign: 'right', color: "var(--text_profile)", marginTop: 10, fontSize: 13 }}>{GENERATOR_NORM}</div>
                            </InfoRow>
                            {(account['marked'] >= 200) ? <div style={{ textAlign: 'center', color: "var(--text_profile)", marginBottom: 5 }}>
                                Но это не значит, что нужно расслабляться!
                            </div> : null}
                        </FormStatus>
                    </Div>
                </Group> : null}
            <Group>
                <SimpleCell
                    disabled
                    after={
                        <Switch
                            checked={noty}
                            onChange={(e) => setNotify(e)} />
                    }
                >
                    Уведомления
                    </SimpleCell>
                <Div>
                    <Subhead weight='regular' className='SimpleCell__description'>
                        После активации данной функции Вам будут поступать в личные сообщения результаты рассмотрения вопросов
                      </Subhead>
                </Div>
            </Group>
            <Group>
                <FormLayout>
                    <FormItem top={"Заголовок вопроса (" + title.length + "/80). Не менее 5 символов"}>
                        <Input
                            maxLength="80"
                            type="text"
                            placeholder='Введите свой текст...'
                            value={title}
                            onChange={(e) => setTitle(e.currentTarget.value)} />
                    </FormItem>
                    <FormItem top={"Сообщение (" + text.length + "/2020). Не менее 5 символов"} >
                        <Textarea maxLength="2020"
                            onChange={(e) => setText(e.currentTarget.value)}
                            placeholder='Введите свой текст...'
                            value={text}
                        />
                    </FormItem>

                    <Checkbox checked={check1} onChange={() => setCheck1(prev => !prev)}>
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
                            }>Добавить в очередь</Button>
                    </FormItem>

                </FormLayout>
            </Group>

        </Panel>
    )
    
}