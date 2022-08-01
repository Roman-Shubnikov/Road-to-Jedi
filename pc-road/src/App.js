import React, {useCallback, useEffect, useState} from 'react'; // React
import {useDispatch, useSelector} from "react-redux";
import bridge from '@vkontakte/vk-bridge';
import {SkeletonTheme} from "react-loading-skeleton";
import {viewsStructure} from "./config";
import {
    AdaptivityProvider,
    AppRoot, Avatar,
    Button,
    CellButton,
    ConfigProvider,
    Group,
    ModalCard,
    ModalRoot,
    Panel,
    Root,
    ScreenSpinner,
    Separator,
    SimpleCell,
    Spacing,
    SplitCol,
    SplitLayout,
    Tabs,
    TabsItem,
    ViewHeight,
    ViewWidth,
    Tappable,
    VKCOM,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import "@vkontakte/vkui/dist/unstable.css";
import styles from './App.module.css';
import './styles/style.css';
import {InvalidQR, ModalBan, ModalComment, ModalShare, ShowQR,} from './Modals';

import {accountActions, reportsActions, ticketActions, viewsActions} from './store/main'
// Импортируем панели
import {Disconnect, Profile, Questions,} from './views'

import {
    Icon12Chevron,
    Icon24DonateOutline,
    Icon24LogoVkOutline,
    Icon24MarketOutline,
    Icon24MessagesOutline,
    Icon24QuestionOutline,
    Icon24ShareOutline,
} from '@vkontakte/icons';
import {isEmptyObject} from 'jquery';
import {goOtherProfileCreator, setActiveModalCreator} from './Utils';
import {useApi, useNavigation} from './hooks';
import {socket, SocketContext} from "./context/soket";


const DESKTOP_SIZE = 1000;
const TABLET_SIZE = 900;
const SMALL_TABLET_SIZE = 768;
const MOBILE_SIZE = 320;
const MOBILE_LANDSCAPE_HEIGHT = 414;
const MEDIUM_HEIGHT = 720;


function calculateAdaptivity(windowWidth, windowHeight) {
    let viewWidth, viewHeight;

    if (windowWidth >= DESKTOP_SIZE) {
        viewWidth = ViewWidth.DESKTOP;
    } else if (windowWidth >= TABLET_SIZE) {
        viewWidth = ViewWidth.TABLET;
    } else if (windowWidth >= SMALL_TABLET_SIZE) {
        viewWidth = ViewWidth.SMALL_TABLET;
    } else if (windowWidth >= MOBILE_SIZE) {
        viewWidth = ViewWidth.MOBILE;
    } else {
        viewWidth = ViewWidth.SMALL_MOBILE;
    }

    if (windowHeight >= MEDIUM_HEIGHT) {
        viewHeight = ViewHeight.MEDIUM;
    } else if (windowHeight > MOBILE_LANDSCAPE_HEIGHT) {
        viewHeight = ViewHeight.SMALL;
    } else {
        viewHeight = ViewHeight.EXTRA_SMALL;
    }
    return {
        viewWidth: viewWidth,
        viewHeight: viewHeight,
    };
}

let backTimeout = false;

const App = () => {
    const [activeModal, setModal] = useState(null);
    const [modalHistory, setModalHistory] = useState(null);
    const dispatch = useDispatch();
    const {
        goPanel,
        setSnackbar,
        setAbortSnack,
        setPopout,
        showAlert,
        showErrorAlert,
        setHash,
        hash,
        setBigLoader,
        goTiket,
    } = useNavigation();
    const {fetchApi} = useApi();
    const {account, schemeSettings, other_profile: OtherProfileData,} = useSelector((state) => state.account)
    const {scheme, default_scheme} = schemeSettings;
    const {activeStory, historyPanels, snackbar, activePanel, popout} = useSelector((state) => state.views)
    const [ignoreOtherProfile, setIgnoreOtherProfile] = useState(false);
    const need_epic = useSelector((state) => state.views.need_epic)
    const comment_special = useSelector((state) => state.tickets.comment)


    const goBack = useCallback(async () => {
        let history = [...historyPanels]
        if (!backTimeout) {
            backTimeout = true;
            if (history.length <= 1) {
                await bridge.send("VKWebAppClose", {"status": "success"});
            } else {
                if (history[history.length] >= 2) {
                    await bridge.send('VKWebAppDisableSwipeBack');
                }
                setHash('');
                history.pop()
                let {view, panel} = history[history.length - 1];
                dispatch(viewsActions.setActiveScene(view, panel))
                setPopout(<ScreenSpinner/>)
                setTimeout(() => {
                    setPopout(null)
                }, 500)
            }
            dispatch(viewsActions.setHistory(history))
            setTimeout(() => {
                backTimeout = false;
            }, 500)

        } else {
            window.history.pushState({...history[history.length - 1]}, history[history.length - 1].panel);
        }
    }, [historyPanels, setPopout, setHash, dispatch])

    const setActiveModal = (activeModal) => {
        setActiveModalCreator(setModal, setModalHistory, modalHistory, activeModal)
    }
    const setReport = (name, id) => {
        dispatch(reportsActions.setTypeReport(name))
        dispatch(reportsActions.setResourceReport(id))
        goPanel(activeStory, "report", true);
    }

    const fetchAccount = useCallback(() => {
        fetchApi("account.get")
            .then(data => {
                setBigLoader(false);
                dispatch(accountActions.setAccount(data))
            })
            .catch(() => {
            });
        // eslint-disable-next-line
    }, [account, activeStory, default_scheme, dispatch])

    const AppInit = useCallback(() => {
        dispatch(accountActions.setBanObject(null))
        fetchAccount()
        if (activeStory === 'disconnect') {
            let {view, panel} = historyPanels[historyPanels.length - 2];
            goPanel(view, panel, true, true)
        }

    }, [historyPanels, fetchAccount, activeStory, goPanel, dispatch])

    const bridgecallback = useCallback(({detail: {type, data}}) => {
        if (type === 'VKWebAppViewHide') {
            console.log('closing...')
        }
        if (type === 'VKWebAppViewRestore') {
            AppInit();
        }
        if (type === 'VKWebAppUpdateConfig') {
            dispatch(accountActions.setScheme({...schemeSettings, default_scheme: data.scheme}))

        }
    }, [AppInit, dispatch, schemeSettings])
    useEffect(() => {
        dispatch(accountActions.setScheme({scheme: default_scheme}))
    }, [account, default_scheme, dispatch])

    const handlePopstate = useCallback((e) => {
        // Важно пофиксить этот баг история пишется некорректно возможно ошибка в goBack()
        // if(e.state === null) {
        // let history = [...historyPanels];
        // window.history.replaceState({ ...history[history.length - 1] }, history[history.length - 1].panel);
        // return false;
        // }
        e.preventDefault();
        goBack();
    }, [goBack]);

    const clickTab = (tab) => {
        return {
            className: 'gray ' + styles.navigationButton,
            onClick: () => {
                setHash('');
                goPanel(tab, viewsStructure[tab].panels.homepanel)
            },
            selected: activeStory === tab,
        }
    }
    const activeLeftBlock = useCallback(() => {
        let viewsNeedLeftBlock = [
            viewsStructure.Profile.navName + viewsStructure.Profile.panels.homepanel,

        ];
        return !!viewsNeedLeftBlock.find(v => v === activeStory + activePanel);

    }, [activeStory, activePanel])

    useEffect(() => {
        AppInit();
        bridge.send('VKWebAppInit', {})
            .then(() => {
            });
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        window.addEventListener('popstate', handlePopstate);
        return () => {
            window.removeEventListener('popstate', handlePopstate)
        }
    }, [handlePopstate])
    useEffect(() => {
        if (!isEmptyObject(account)) {
            if (hash?.promo && activePanel !== 'promocodes') {
                goPanel(viewsStructure.Profile.navName, 'promocodes', true)
            } else if (hash.ticket_id !== undefined && activePanel !== 'ticket') {
                dispatch(ticketActions.setTicketId(hash.ticket_id))
                goPanel(viewsStructure.Questions.navName, 'ticket', true);
            } else if (hash.agent_id !== undefined) {
                if (activePanel !== 'other_profile' && !ignoreOtherProfile) {
                    setIgnoreOtherProfile(true)
                    goOtherProfileCreator(goPanel, viewsStructure.Questions.navName, showErrorAlert, OtherProfileData, dispatch, hash.agent_id)
                    setTimeout(() => setIgnoreOtherProfile(false), 1000)
                }

            } else if ("help" in hash && activePanel !== 'faqMain') {
                goPanel(viewsStructure.Profile.navName, 'faqMain', true);
            } else if (activeStory === 'loading') {
                dispatch(viewsActions.setActiveScene(viewsStructure.Questions.navName, viewsStructure.Questions.panels.homepanel))
            }
        }

    }, [account, dispatch, showErrorAlert, activeStory, activePanel, goTiket, goPanel, hash, OtherProfileData, ignoreOtherProfile])
    useEffect(() => {
        bridge.subscribe(bridgecallback);

        return () => bridge.unsubscribe(bridgecallback);
    }, [account, bridgecallback])

    useEffect(() => {
        socket.on("connect_error", (err) => {
            console.log(err.message);
        });
        socket.on('ERROR', (err) => {
            setAbortSnack(err.reason);
            console.log('ERROR: ', err);
        })
        return () => {
            socket.off('connect_error');
            socket.off('ERROR');
        }
    })

    const modalClose = () => setActiveModal(null);
    const modals = (
        <ModalRoot
            onClose={modalClose}
            activeModal={activeModal}>
            <ModalComment
                id='comment'
                comment={comment_special}
                onClose={modalClose}
                reporting={setReport}/>

            <ModalBan
                id='ban_user'
                onClose={modalClose}
                callbacks={{setPopout, showErrorAlert, setActiveModal, showAlert}}
            />

            <ModalShare
                id="share"
                setActiveModal={setActiveModal}
                setSnackbar={setSnackbar}
                onClick={modalClose}/>

            <ShowQR
                id='qr'
                onClick={modalClose}/>
            <InvalidQR
                id='invalid_qr'
                onClick={modalClose}/>

            <ModalCard
                onClose={modalClose}
                id='test'>
                Вью {activeStory}
            </ModalCard>
        </ModalRoot>
    )
    return (
        <SocketContext.Provider value={socket}>
            <ConfigProvider
                scheme={scheme}
                platform={VKCOM}>

                <AppRoot>
                    {need_epic && <>
                        <div style={{minWidth: '100vw', position: 'fixed', top: 0, zIndex: 4}}>
                            <Group className={styles.navigationTab}>
                                <Tabs className={styles.navigationButtons}>
                                    <TabsItem {...clickTab('Questions')}>
                                        Вопросы
                                    </TabsItem>
                                    <TabsItem
                                        {...clickTab('Top')}>
                                        Статистика
                                    </TabsItem>
                                    <TabsItem
                                        {...clickTab('Moderation')}>
                                        Управление
                                    </TabsItem>
                                </Tabs>
                                <div style={{marginLeft:'auto', height: '100%'}}>
                                    <Tappable
                                        className={styles.profileButton}
                                        onClick={() => {
                                            setHash('');
                                            goPanel(viewsStructure.Profile.navName, viewsStructure.Profile.panels.homepanel)
                                        }}>
                                        <Avatar src={account?.avatar?.url} alt='avatar' size={34}/>
                                        <Icon12Chevron className={styles.profileButtonChevron} />
                                    </Tappable>
                                </div>
                            </Group>
                        </div>
                        <div style={{marginBottom: 54 + 16}}/>
                    </>}

                    <SplitLayout
                        style={{justifyContent: "center"}}
                        popout={popout}
                        modal={modals}>

                        {activeLeftBlock() && (<SplitCol fixed width="230px" minWidth="230px">
                            <Panel id='menu_epic'>
                                {!isEmptyObject(account) && <>
                                    <Group>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            padding: 7
                                        }}>
                                            <img className='profile_avatar' src={account?.avatar?.url} alt='avatar'/>
                                            <Spacing/>
                                            <Button size='m'
                                                    mode='secondary'
                                                    stretched>
                                                Настройки
                                            </Button>
                                        </div>
                                        <Spacing/>
                                        <CellButton
                                            multiline
                                            before={<Icon24LogoVkOutline/>}>
                                            Профиль VK
                                        </CellButton>
                                        <Spacing>
                                            <Separator/>
                                        </Spacing>
                                        <SimpleCell
                                            className='gray'
                                            before={<Icon24MessagesOutline/>}>
                                            Чат агентов
                                        </SimpleCell>
                                        <SimpleCell
                                            className='gray'
                                            before={<Icon24DonateOutline/>}>
                                            Чат донов
                                        </SimpleCell>
                                        <Spacing>
                                            <Separator/>
                                        </Spacing>
                                        <SimpleCell
                                            className='gray'
                                            before={<Icon24MarketOutline/>}>
                                            Магазин
                                        </SimpleCell>
                                        <SimpleCell
                                            className='gray'
                                            before={<Icon24QuestionOutline/>}>
                                            Помощь
                                        </SimpleCell>
                                    </Group>
                                    <Group>
                                        <CellButton
                                            multiline
                                            before={<Icon24ShareOutline/>}>
                                            Поделиться профилем
                                        </CellButton>
                                    </Group>
                                </>}
                            </Panel>
                        </SplitCol>)}

                        <SplitCol
                            animate={false}
                            spaced={activeLeftBlock()}
                            width='100%'
                            maxWidth='100%'
                        >
                            <SkeletonTheme
                                color={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#232323'}
                                highlightColor={['bright_light', 'vkcom_light'].indexOf(scheme) !== -1 ? undefined : '#6B6B6B'}>
                                <Root activeView={activeStory}>

                                    <Profile id={viewsStructure.Profile.navName}/>
                                    <Questions id={viewsStructure.Questions.navName}/>
                                    <Disconnect
                                        id="disconnect"
                                        AppInit={AppInit}/>

                                </Root>
                            </SkeletonTheme>
                        </SplitCol>
                        {snackbar}
                    </SplitLayout>
                </AppRoot>
            </ConfigProvider>
        </SocketContext.Provider>
    )

}

export default () => (
    <AdaptivityProvider
        viewWidth={calculateAdaptivity(document.documentElement.clientWidth, document.documentElement.clientHeight).viewWidth}>
        <App/>
    </AdaptivityProvider>
);
