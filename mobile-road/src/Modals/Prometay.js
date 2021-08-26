import React from 'react';
import { 
    ModalCard,
    Button,
    

  } from '@vkontakte/vkui';
import { Icon56FireOutline } from '@vkontakte/icons';

export default class Prometay extends React.Component {
    render() {
        return (
            <ModalCard
                id={this.props.id}
                onClose={this.props.onClose}
                icon={<Icon56FireOutline style={{color: "var(--prom_icon)"}} width={72} height={72} />}
                subheader="Прометей — особенный значок, выдаваемый агентам за хорошее качество ответов."
                actions={this.props.action2 ? [
                  <Button mode='secondary' key={1} stretched size='l' onClick={this.props.action2}>Рассказать</Button>,
                  <Button mode='primary' key={2} stretched size='l' onClick={this.props.action}>Понятно</Button>
                ] : 
                  <Button mode='primary' stretched size='l' onClick={this.props.action}>Понятно</Button>
                }
                
              />
        )
    }
}
Prometay.defaultProps = {
  action2: null,
}