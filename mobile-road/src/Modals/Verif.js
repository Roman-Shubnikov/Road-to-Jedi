import React from 'react';
import { 
    ModalCard,
    Button,

  } from '@vkontakte/vkui';
import { LINKS_HELP_USER_ACHIEVEMENTS } from '../config';
import { Icon56CheckCircleOutline } from '@vkontakte/icons';
import { useNavigation } from '../hooks';

export const Verification = ({ id }) => {
  const { closeModal } = useNavigation();
    return (
        <ModalCard
            id={id}
            onClose={closeModal}
            icon={<Icon56CheckCircleOutline style={{color: "var(--strong_blue)"}} />}
            header='Верифицированный агент'
            subheader='Агент Поддержки подтверил официальность своей карточки, теперь возле его номера отображается соответствующая метка.'
            actions={<Button stretched size='l'
                    rel="noopener noreferrer" 
                    href={LINKS_HELP_USER_ACHIEVEMENTS.verification} 
                    target="_blank" >
                      Узнать о верификации
                    </Button>
            }
            
          />
    )
}