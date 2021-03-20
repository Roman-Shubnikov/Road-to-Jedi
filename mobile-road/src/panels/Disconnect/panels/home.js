import React from 'react';
import { 
    Panel,
    PanelHeader,
    Button,
    Placeholder,
    Group,
    } from '@vkontakte/vkui';
import Icon56CheckCircleDeviceOutline from '@vkontakte/icons/dist/56/check_circle_device_outline';

export default props => {
    return (
        <Panel id={props.id}>
            <PanelHeader>
                Ошибка
                </PanelHeader>
            <Group>
                <Placeholder
                    icon={<Icon56CheckCircleDeviceOutline style={{ color: 'var(--dynamic_orange)' }} />}
                    header='Упс, кажется, при запросе возникла ошибка'
                    action={<>
                        <Button size='m'
                            style={{ marginRight: 8, marginBottom: 8 }}
                            href='https://vk.me/special_help'
                            target="_blank"
                            rel="noopener noreferrer">Связаться с нами</Button>
                        <Button
                            size='m'
                            onClick={() => props.restart()}>Переподключится</Button>
                    </>}>
                    Наш сервис не смог получить ответ от сервера. Возможно, он недоступен. Проверьте интернет-соединение, а затем попробуйте подключится снова
                    </Placeholder>
            </Group>

        </Panel>
    )
}