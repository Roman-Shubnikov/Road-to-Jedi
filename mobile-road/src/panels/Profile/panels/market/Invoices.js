import React from 'react';
import {
    Icon28RoubleCircleFillBlue,
    Icon28InfoOutline,
    Icon28MoneyRequestOutline,
    Icon28TicketOutline,
    Icon28UserOutgoingOutline,
    Icon28DonateCircleFillYellow,
} from '@vkontakte/icons';
import {
    usePlatform,
    Group,
    SimpleCell,
    IconButton,
    Headline,
    Platform,
    Div,
    Tappable,
    TabbarItem,
    Text,
} from '@vkontakte/vkui';
import { useSelector } from 'react-redux';
import { LINKS_VK } from '../../../../config';
import { useNavigation } from '../../../../hooks';

export const Invoices = (props) => {
    const account = useSelector((state) => state.account.account);
    const platform = usePlatform();
    const { goPanel, setActiveModal } = useNavigation();
    const { activeStory } = useSelector((state) => state.views);

    const genereCardId = (nickname) => {
        nickname = String(nickname);
        let hash = 0,
            i,
            chr;
        let chars = nickname.split('');
        for (i = 0; i < chars.length; i++) {
            chr = chars[i].charCodeAt(0);
            hash = hash + chr;
        }
        return String(hash + 1000).substring(0, 4);
    };
    return (
        <>
            <Group>
                <SimpleCell
                    before={<Icon28RoubleCircleFillBlue />}
                    disabled
                    after={
                        <IconButton
                            target="_blank"
                            rel="noopener noreferrer"
                            href={LINKS_VK.market_info_article}
                        >
                            <Icon28InfoOutline />
                        </IconButton>
                    }
                    multiline
                    subtitle={
                        <div>
                            <span>
                                • • • •{' '}
                                {genereCardId(
                                    account.nickname
                                        ? account.nickname
                                        : String(account.id)
                                )}
                            </span>
                            <br />
                            <span>Основной баланс</span>
                        </div>
                    }
                >
                    <Headline>{account.balance}</Headline>
                </SimpleCell>
                {platform === Platform.IOS && (
                    <Div>
                        <Text style={{ color: 'var(--subtext)' }}>
                            Платежи на данной платформе недоступны.
                        </Text>
                    </Div>
                )}
                <Div
                    className="vkuiTabbar--l-vertical"
                    style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                    {platform !== Platform.IOS && (
                        <Tappable
                            onClick={() =>
                                props.setActivetab('real-money-store')
                            }
                            style={{ padding: 8 }}
                        >
                            <TabbarItem
                                selected={platform !== Platform.IOS}
                                text="Пополнить"
                            >
                                <Icon28MoneyRequestOutline />
                            </TabbarItem>
                        </Tappable>
                    )}

                    <Tappable
                        style={{ padding: 8 }}
                        onClick={() => goPanel(activeStory, 'promocodes', true)}
                    >
                        <TabbarItem selected text="Промокоды">
                            <Icon28TicketOutline />
                        </TabbarItem>
                    </Tappable>
                    <Tappable
                        style={{ padding: 8 }}
                        onClick={() => setActiveModal('transfer_send')}
                    >
                        <TabbarItem selected text="Перевести">
                            <Icon28UserOutgoingOutline />
                        </TabbarItem>
                    </Tappable>
                </Div>
            </Group>
            <Group>
                <SimpleCell
                    before={<Icon28DonateCircleFillYellow />}
                    multiline
                    disabled
                    after={
                        <IconButton
                            target="_blank"
                            rel="noopener noreferrer"
                            href={LINKS_VK.market_info_donut_article}
                        >
                            <Icon28InfoOutline />
                        </IconButton>
                    }
                    subtitle={
                        <div>
                            <span>• • • • {genereCardId(account.vk_id)}</span>
                            <br />
                            <span>Эксклюзивный баланс</span>
                        </div>
                    }
                >
                    <Headline>{account.donuts}</Headline>
                </SimpleCell>
                <Div>
                    <Text style={{ color: 'var(--subtext)' }}>
                        Данный баланс нельзя пополнить настоящей валютой,
                        получить её можно только отвечая на вопросы с
                        эксклюзивной отметкой.
                    </Text>
                </Div>
            </Group>
        </>
    );
};
