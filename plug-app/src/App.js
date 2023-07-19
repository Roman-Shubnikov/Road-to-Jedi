import React, { useCallback, useEffect, useState } from 'react'; // React
import bridge from '@vkontakte/vk-bridge'; // VK Brige
// import music from './music/Soloriver.mp3';
import { IS_MOBILE } from './config';
import {
    Epic,
    ConfigProvider,
    AdaptivityProvider,
    AppRoot,
    SplitLayout,
    SplitCol,
    View,
    Panel,
    Placeholder,
    ButtonGroup,
    Button,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import '@vkontakte/vkui/dist/unstable.css';
import './styles/style.css';
import Lottie from 'lottie-react';
import bearEarsAnim from './animations/bear_ears.json';

const scheme_params = {
    light: {
        status_bar_style: 'dark',
        action_bar_color: '#FFFFFF',
        navigation_bar_color: '#FFFFFF',
    },
    dark: {
        status_bar_style: 'light',
        action_bar_color: '#19191A',
        navigation_bar_color: '#19191A',
    },
};
const App = () => {
    const [appearance, setAppearance] = useState('light');

    const bridgecallback = useCallback(
        ({ detail: { type, data } }) => {
            if (type === 'VKWebAppViewHide') {
                console.log('closing...');
            }
            if (type === 'VKWebAppUpdateConfig') {
                setAppearance(data.appearance);
            }
        },
        [setAppearance]
    );
    useEffect(() => {
        const brigeSchemeChange = (params) => {
            bridge.send('VKWebAppSetViewSettings', params);
        };
        if (IS_MOBILE) {
            brigeSchemeChange(scheme_params[appearance]);
        }
    }, [appearance]);
    useEffect(() => {
        bridge.send('VKWebAppInit', {});
    }, []);
    useEffect(() => {
        bridge.subscribe(bridgecallback);

        return () => bridge.unsubscribe(bridgecallback);
    }, [bridgecallback]);
    return (
        <>
            <ConfigProvider appearance={appearance}>
                <AppRoot>
                    <SplitLayout style={{ justifyContent: 'center' }}>
                        <SplitCol spaced={false} width="100%">
                            <Epic activeStory={'main'}>
                                <View id="main" activePanel="main">
                                    <Panel id="main" style={{background: 'var(--vkui--color_background_content)'}}>
                                        <Placeholder
                                            stretched
                                            icon={
                                                <Lottie
                                                    style={{
                                                        width: 140,
                                                        height: 140,
                                                    }}
                                                    animationData={
                                                        bearEarsAnim
                                                    }
                                                    loop={true}
                                                />
                                            }
                                            header="Время трогательного конца"
                                            action={
                                                <ButtonGroup
                                                    mode="vertical"
                                                    align="center"
                                                >
                                                    <Button size="m"
                                                    target="_blank"
                                                    rel="norefferer noopener"
                                                    href="mailto:group@vkgidteam.ru">
                                                        Связаться с нами
                                                    </Button>
                                                    <Button
                                                        mode="tertiary"
                                                        size="l"
                                                        target="_blank"
                                                        rel="norefferer noopener"
                                                        href="https://vk.com/trainingagents?w=wall-188280516_1631"
                                                    >
                                                        Публикация от
                                                        Команды
                                                    </Button>
                                                </ButtonGroup>
                                            }
                                        >
                                            <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', gap: 16, width: IS_MOBILE ? '100%' : '60%', margin: '0 auto'}}>
                                                <div style={{ maxWidth: '80%', margin: '0 auto' }}>
                                                    У всего есть конец, ничего
                                                    не бесконечно, согласны?
                                                </div>
                                                <div>
                                                    Тренажер Агента повлиял на
                                                    большое количество людей, он не
                                                    только научил чему-либо, но и
                                                    познакомил множество
                                                    пользователей, чьи интересы
                                                    схожи. 
                                                </div>
                                                <div>
                                                    Сегодня мы подводим
                                                    черту, отмечая этот день в
                                                    календаре – кандидаты, вы
                                                    лучшие, мы верим в Вас, у вас
                                                    все получится, главное не
                                                    сдаваться!
                                                </div>
                                                
                                            </div>
                                            
                                        </Placeholder>
                                    </Panel>
                                </View>
                            </Epic>
                        </SplitCol>
                    </SplitLayout>
                </AppRoot>
            </ConfigProvider>
        </>
    );
};

export const AdaptiveApp = () => (
    <AdaptivityProvider>
        <App />
    </AdaptivityProvider>
);
