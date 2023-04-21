import React from 'react';
import {
    Icon28RoubleCircleFillBlue,
    Icon28InfoOutline,
    Icon28DonateCircleFillYellow,
    Icon16TicketOutline,
    Icon16Add,
} from '@vkontakte/icons';
import {
    usePlatform,
    Group,
    SimpleCell,
    IconButton,
    Headline,
    Platform,
    Div,
    Text,
    ButtonGroup,
    Button,
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
                        // <IconButton
                        //     target="_blank"
                        //     rel="noopener noreferrer"
                        //     href={LINKS_VK.market_info_article}
                        // >
                        //     <Icon28InfoOutline />
                        // </IconButton>
                        <ButtonGroup mode='vertical' stretched>
                            <ButtonGroup stretched>
                                {platform !== Platform.IOS && (<Button
                                stretched
                                appearance='positive'
                                onClick={() =>
                                    props.setActivetab('real-money-store')
                                }
                                ><Icon16Add /></Button>)}
                                <Button
                                stretched
                                onClick={() => goPanel(activeStory, 'promocodes', true)}>
                                    <Icon16TicketOutline />
                                </Button>
                            </ButtonGroup>
                            
                            <Button
                            stretched
                            mode='secondary'
                            onClick={() => setActiveModal('transfer_send')}>
                                Перевести
                            </Button>
                        </ButtonGroup>
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
