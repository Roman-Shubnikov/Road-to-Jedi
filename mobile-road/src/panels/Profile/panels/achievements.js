import React from 'react';
import { 
    Panel,
    PanelHeader,
    Group,
    // Placeholder,
    PanelHeaderBack,
    // Footer,
    Card,
    RichCell,
    Avatar,
    Progress
    } from '@vkontakte/vkui';

// import { STATUSES_ACHIEVEMENTS } from '../../../config';

const Achievement = ({avatar, title, caption, progress, status}) => {
    // const getIconForStatus = (status) => {
    //     if (status === STATUSES_ACHIEVEMENTS.recived) {
            
    //     }
    // }
    return (
        <Card mode='outline'>
            <RichCell
            multiline
            before={<Avatar src={avatar} size={72} />}
            caption={caption}
            actions={<div>
                <Progress value={Math.min(progress, 100)} />
            </div>}>
                {title}
            </RichCell>
        </Card>
    )
}

export const Achievements = props => {
    return (
        <Panel id={props.id}>
            <PanelHeader
                left={
                    <PanelHeaderBack onClick={() => window.history.back()} />
                }>
                Достижения
                </PanelHeader>
            <Group>
                <Achievement />
            </Group>


        </Panel>
    )
}