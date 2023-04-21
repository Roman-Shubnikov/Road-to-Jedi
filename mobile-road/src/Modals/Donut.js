import React from 'react';
import { ModalCard, Button } from '@vkontakte/vkui';
import { Icon56DonateOutline } from '@vkontakte/icons';
import { useNavigation } from '../hooks';
import { LINKS_HELP_USER_ACHIEVEMENTS } from '../config';

export const Donut = ({ id }) => {
    const { closeModal } = useNavigation();
    return (
        <ModalCard
            id={id}
            onClose={closeModal}
            icon={<Icon56DonateOutline style={{color: "var(--strong_blue)"}} />}
            header='Поддержка агента'
            subheader='Агент Поддержки поддержал сообщество и сервис своей подпиской, теперь в профиле отображается специальная метка'
            actions={
                <Button stretched size='l'
                rel="noopener noreferrer" 
                href={LINKS_HELP_USER_ACHIEVEMENTS.donut} 
                target="_blank" >
                    Узнать больше
                </Button>
            }
        />
    );
};
