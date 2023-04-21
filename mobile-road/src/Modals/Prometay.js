import React from 'react';
import { 
    ModalCard,
    Button,
    

  } from '@vkontakte/vkui';
import { Icon56FireOutline } from '@vkontakte/icons';
import { useNavigation } from '../hooks';
import { LINKS_HELP_USER_ACHIEVEMENTS } from '../config';

export const AgentFlashing = ({ id }) => {
  const { closeModal } = useNavigation();
  return (
      <ModalCard
          id={id}
          onClose={closeModal}
          icon={<Icon56FireOutline style={{color: "var(--strong_blue)"}} />}
          header='Профиль Прометея'
          subheader="Агент Поддержки работает днем и ночью, тем самым получая положительные оценки от Команды Специальных агентов."
          actions={
            <Button stretched size='l'
            rel="noopener noreferrer" 
            href={LINKS_HELP_USER_ACHIEVEMENTS.flash} 
            target="_blank" >
              Узнать о уникальности
            </Button>
          }
          
        />
  )
}