import React from 'react';
import { 
    ModalCard
  } from '@vkontakte/vkui';
import Icon56FireOutline from '@vkontakte/icons/dist/56/fire_outline';


export default class Prometay extends React.Component {
    render() {
        return (
            <ModalCard
                id={this.props.id}
                onClose={this.props.onClose}
                icon={<Icon56FireOutline style={{color: "var(--prom_icon)"}} width={72} height={72} />}
                caption="Прометей — особенный значок, выдаваемый агентам за хорошее качество ответов."
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