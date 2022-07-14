import React, { useState } from 'react';
import { 
    Panel,
    Group,
    Tabs,
    TabsItem,
    Separator,
} from '@vkontakte/vkui';


export const Home = props => {
    const [activeTab, setActiveTab] = useState('all');

    const clickTab = (tab) => {
		return {
            onClick: () => setActiveTab(tab),
            selected: activeTab === tab,
        }
	}
    return (
        <Panel id={props.id}>
            <Group>
                <Tabs>
                    <TabsItem
                    {...clickTab('all')}>
                        Все вопросы
                    </TabsItem>
                    <TabsItem
                    {...clickTab('my')}>
                        Рассматриваемые мной
                    </TabsItem>
                </Tabs>
                <Separator className='sep-wide' />
            </Group>

        </Panel>
    )
}