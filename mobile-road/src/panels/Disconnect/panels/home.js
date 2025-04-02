import React, {useState} from 'react';
import { 
    Panel,
    PanelHeader,
    Button,
    Placeholder,
    Group,
    } from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { Icon56GlobeCrossOutline } from '@vkontakte/icons';


export const DisconnectPanel = props => {
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const { globalError } = useSelector((state) => state.views)
    return (
        <Panel id={props.id}>
            <PanelHeader>
                Ошибка
            </PanelHeader>
            <Group>
                <Placeholder
                    icon={<Icon56GlobeCrossOutline />}
                    header='Ошибка'
                    action={<>
                        <Button size='m'
                            style={{ marginRight: 8, marginBottom: 8 }}
                            href='https://vk.me/special_help'
                            target="_blank"
                            rel="noopener noreferrer">Связаться с нами</Button>
                        <Button
                            size='m'
                            loading={buttonSpinner}
                            onClick={() => {
                                setButtonSpinner(true);
                                props.restart();
                                setTimeout(() => {
                                    setButtonSpinner(false);
                                }, 1000)

                                }}>Переподключится</Button>
                    </>}>
                        {/* {globalError.name + ': ' + globalError.message} */}
                        <br/>
                        {navigator.userAgent}
                        <br/>
                        <br/>
                        Дополнительная информация уже отправлена
                        <br/>
                        При обращении в поддержку сделайте скриншот этого экрана
                    </Placeholder>
            </Group>

        </Panel>
    )
}