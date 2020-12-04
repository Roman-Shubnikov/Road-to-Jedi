import React from 'react';
import { 
  Link,
    ModalCard,

  } from '@vkontakte/vkui';
import Icon36Done         from '@vkontakte/icons/dist/36/done';


export default class Verification extends React.Component {
    render() {
        return (
            <ModalCard
                id={this.props.id}
                onClose={this.props.onClose}
                icon={<Icon36Done style={{color: "var(--accent)"}} width={72} height={72} />}
                caption={<>Этот профиль был верифицирован.<br /><br />
                <Link 
                  href='https://vk.com/@jedi_road-chto-takoe-verifikaciya-i-kak-ee-poluchit-galochku'
                  target="_blank"
                  rel="noopener noreferrer">Узнайте больше о новой верификации
                </Link></>}
                actions={this.props.action2 ? [
                  {
                    title: 'Рассказать',
                    mode: 'secondary',
                    action: this.props.action2},
                  {
                    title: 'Понятно',
                    mode: 'primary',
                    action: this.props.action
                  },
                  
                  ]
                  :
                  [{
                    title: 'Понятно',
                    mode: 'primary',
                    action: this.props.action
                  }]}
                
              />
        )
    }
}
Verification.defaultProps = {
  action2: null,
}