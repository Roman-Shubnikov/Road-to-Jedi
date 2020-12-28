import React from 'react';
import { 
  Link,
    ModalCard,
    Button,

  } from '@vkontakte/vkui';
import Icon36Done         from '@vkontakte/icons/dist/36/done';


export default class Verification extends React.Component {
    render() {
        return (
            <ModalCard
                id={this.props.id}
                onClose={this.props.onClose}
                icon={<Icon36Done style={{color: "var(--accent)"}} width={72} height={72} />}
                subheader={<>Этот профиль был верифицирован.<br /><br />
                <Link 
                  href='https://vk.com/@jedi_road-chto-takoe-verifikaciya-i-kak-ee-poluchit-galochku'
                  target="_blank"
                  rel="noopener noreferrer">Узнайте больше о новой верификации
                </Link></>}
                actions={this.props.action2 ? [
                  <Button mode='secondary' stretched size='l' onClick={this.props.action2}>Рассказать</Button>,
                  <Button mode='primary' stretched size='l' onClick={this.props.action}>Понятно</Button>
                ] : 
                  <Button mode='primary' stretched size='l' onClick={this.props.action}>Понятно</Button>
                }
                
              />
        )
    }
}
Verification.defaultProps = {
  action2: null,
}