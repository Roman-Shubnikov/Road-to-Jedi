import React, { useCallback } from 'react';
import { 
    Panel,
    PanelHeader,
    ScreenSpinner,
    Header,
    PanelHeaderBack,
    Radio,
    FormLayout,
    Div,
    Group,
    usePlatform,
    VKCOM
    } from '@vkontakte/vkui';

import Message from '../../../components/message'
import avaUser from '../../../images/user.png'
import avaAgent from '../../../images/schemeagent.jpg'
import { useDispatch, useSelector } from 'react-redux';
import { accountActions, viewsActions } from '../../../store/main';
import { API_URL } from '../../../config';

const themes = [
    { themeName: 'Светлая тема', val: '1' },
    { themeName: 'Тёмная тема', val: '2' },
    { themeName: 'Автоматически', val: '0', description: 'Сервис будет использовать тему, установленную в настройках ВКонтакте' },
]

export default props => {
    const dispatch = useDispatch();
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
    const { account, schemeSettings } = useSelector((state) => state.account)
    const { default_scheme } = schemeSettings;
    const setScheme = useCallback((payload) => dispatch(accountActions.setScheme(payload)), [dispatch])
    const { setPopout, showErrorAlert } = props.callbacks;
    const platform = usePlatform();


    const ChangeScheme = (e) => {
        setPopout(<ScreenSpinner />)
        let value = e.currentTarget.value;
        if (value === 0) {
            setScheme({ ...schemeSettings, scheme: default_scheme })
        }
        fetch(API_URL + "method=account.changeScheme&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                // signal: controllertime.signal,
                body: JSON.stringify({
                    'scheme': value,
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setTimeout(() => {
                        props.reloadProfile();
                        setPopout(null)
                    }, 3000)
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                setActiveStory('disconnect')

            })

    }
    return (
        <Panel id={props.id}>
            <PanelHeader
                left={
                    <PanelHeaderBack onClick={() => window.history.back()} />
                }>
                Смена темы
                </PanelHeader>

            <Group header={<Header mode='secondary'>Предпросмотр</Header>}>
                <Div>
                    <Message
                        title='Пользователь'
                        is_mine={false}
                        avatar={avaUser}
                        onClick={() => { }}
                        clickable={false}
                    >О, тут можно менять тему</Message>
                    <Message
                        title='Агент Поддержки'
                        is_mine={true}
                        avatar={avaAgent}
                        onClick={() => { }}
                        clickable={false}
                    >Действительно</Message>
                </Div>
            </Group>

            <Group>
                <FormLayout>
                    {themes.map((res, i) => 
                        <Radio name="radio" 
                        onChange={ChangeScheme}
                        disabled={platform === VKCOM} 
                        value={res.val} 
                        // eslint-disable-next-line
                        defaultChecked={(account.scheme == res.val)}
                        description={res.description}>
                            {res.themeName}
                        </Radio>)}
                    {platform === VKCOM && 
                    <Radio name="radio" defaultChecked
                    description="В компьютерной версии не поддерживается смена темы">
                        Desktop
                    </Radio> 
                    }
                    
                </FormLayout>
            </Group>

        </Panel>
    )
}