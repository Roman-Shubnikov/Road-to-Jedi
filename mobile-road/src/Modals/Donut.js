import React from 'react';
import { 
    ModalCard
  } from '@vkontakte/vkui';
import Icon28FavoriteCircleFillYellow from '@vkontakte/icons/dist/28/favorite_circle_fill_yellow';


export default class Donut extends React.Component {
    render() {
        return (
            <ModalCard
                id={this.props.id}
                onClose={this.props.onClose}
                icon={<Icon28FavoriteCircleFillYellow width={72} height={72} />}
                caption={<span>Donut — отметка выдаваемая Агентам за поддержку проекта.<br /><br />
                        Агенты, которые поддержали проект,
                        получают отметку, на весь период подписки. По
                        истечении данного периода отметка пропадает.</span>}
                actions={[{
                  title: 'Понятно',
                  mode: 'secondary',
                  action: this.props.action
                }
                ]}
                
              />
        )
    }
}