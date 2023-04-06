import React from 'react';
import { 
  Link,
    ModalCard,
    Button,

  } from '@vkontakte/vkui';
import Icon36Done         from '@vkontakte/icons/dist/36/done';


export const Verification = props => {
    return (
        <ModalCard
            id={props.id}
            onClose={props.onClose}
            icon={<Icon36Done style={{color: "var(--accent)"}} width={72} height={72} />}
            subheader={<>Этот профиль был верифицирован.<br /><br />
            <Link 
              href='https://vk.com/@jedi_road-chto-takoe-verifikaciya-i-kak-ee-poluchit-galochku'
              target="_blank"
              rel="noopener noreferrer">Узнайте больше о новой верификации
            </Link></>}
            actions={props.action2 ? [
              <Button mode='secondary' key={1} stretched size='l' onClick={props.action2}>Рассказать</Button>,
              <Button mode='primary' key={2} stretched size='l' onClick={props.action}>Понятно</Button>
            ] : 
              <Button mode='primary' stretched size='l' onClick={props.action}>Понятно</Button>
            }
            
          />
    )
}