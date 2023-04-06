import React from 'react';
import { 
    ModalCard,
    Button,
    

  } from '@vkontakte/vkui';
import { Icon56FireOutline } from '@vkontakte/icons';
import { useNavigation } from '../hooks';

export const AgentFlashing = props => {
  const { closeModal } = useNavigation();
  return (
      <ModalCard
          id={props.id}
          onClose={closeModal}
          icon={<Icon56FireOutline style={{color: "var(--prom_icon)"}} width={72} height={72} />}
          subheader="Прометей — особенный значок, выдаваемый агентам за хорошее качество ответов."
          actions={props.action2 ? [
            <Button mode='secondary' key={1} stretched size='l' onClick={props.action2}>Рассказать</Button>,
            <Button mode='primary' key={2} stretched size='l' onClick={props.action}>Понятно</Button>
          ] : 
            <Button mode='primary' stretched size='l' onClick={action}>Понятно</Button>
          }
          
        />
  )
}