import React, { useState } from 'react';

import {
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Group,
    HorizontalScroll,
    usePlatform,
    Tabs,
    TabsItem,
    Platform,
} from '@vkontakte/vkui';

import { Invoices } from './Invoices';
import { AvatarGenerator } from './AvatarGenerator';
import { RealMoneyStore } from './RealMoneyStore';
import { Products } from './Products';

import { IS_MOBILE } from '../../../../config';
import { sendGoal } from '../../../../metrika';

export const MarketPanel = (props) => {
    const [activeTab, setActivetab] = useState('market');
    const platform = usePlatform();
    const labels = [
        {
            label: 'Аватарка',
            value: 'avatar',
        },
        {
            label: 'Товары',
            value: 'market',
        },
        {
            label: 'Счета',
            value: 'invoices',
        },
        {
            label: 'Ценности',
            value: 'real-money-store',
        },
    ];
    const getCurrPanel = () => {
        switch (activeTab) {
            case 'avatar':
                return <AvatarGenerator reloadProfile={props.reloadProfile} />;
            case 'market':
                return <Products reloadProfile={props.reloadProfile} />;
            case 'invoices':
                return (
                    <Invoices
                        reloadProfile={props.reloadProfile}
                        setActivetab={setActivetab}
                    />
                );
            case 'real-money-store':
                return <RealMoneyStore reloadProfile={props.reloadProfile} />;
        }
    };
    return (
        <Panel id={props.id}>
            <PanelHeader
                separator={!IS_MOBILE}
                before={
                    <>
                        <PanelHeaderBack
                            onClick={() => window.history.back()}
                        />{' '}
                    </>
                }
            >
                Магазин
            </PanelHeader>
            <Group>
                <Tabs mode="accent">
                    <HorizontalScroll>
                        {(platform !== Platform.IOS
                            ? labels
                            : labels.slice(0, 2)
                        ).map((label) => (
                            <TabsItem
                                key={label.value}
                                onClick={() => {
                                    setActivetab(label.value);
                                    if (label.value === 'real-money-store') {
                                        sendGoal('marketMoneyClick');
                                    }
                                }}
                                selected={activeTab === label.value}
                            >
                                {label.label}
                            </TabsItem>
                        ))}
                    </HorizontalScroll>
                </Tabs>
            </Group>
            {getCurrPanel()}
        </Panel>
    );
};
