import React from 'react';
import { 
    ModalCard,
    Button
  } from '@vkontakte/vkui';
import Icon28FavoriteCircleFillYellow from '@vkontakte/icons/dist/28/favorite_circle_fill_yellow';
import { useNavigation } from '../hooks';


export const Donut = props => {
  const { closeModal } = useNavigation();
  return (
    <>
      <ModalCard
          id={props.id}
          onClose={closeModal}
          icon={<Icon28FavoriteCircleFillYellow width={72} height={72} />}
          subheader={<span>Звезда — отметка, выдаваемая Агентам за поддержку проекта.<br /><br />
                  Агенты, которые поддержали проект через раздел "Ценности",
                  получают отметку, на весь период подписки. По
                  истечении данного периода отметка пропадает.</span>}
          actions={props.action2 ? [
            <Button mode='secondary' key={1} stretched size='l' onClick={props.action2}>Рассказать</Button>,
            <Button mode='primary' key={2} stretched size='l' onClick={props.action}>Понятно</Button>
          ] : 
            <Button mode='primary' stretched size='l' onClick={props.action}>Понятно</Button>
          }
          
        />
        </>
  )
}