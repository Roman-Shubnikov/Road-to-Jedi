import React from 'react'; // React
import { 
    ModalCard,
    Button,
    CellButton,


} from "@vkontakte/vkui";
import { 
  Icon56GhostOutline,

} from '@vkontakte/icons';
import { useSelector } from 'react-redux';
import { recog_number } from '../Utils';

export default ({id, onClick, setActiveModal, goPanel}) => {
    const account = useSelector((state) => state.account.account)
    const levels = account.levels;
    const exp_to_next_lvl = levels.exp_to_lvl - levels.exp;
    const { activeStory } = useSelector((state) => state.views)
    return(
        <ModalCard 
        id={id}
        onClose={onClick}
        icon={<Icon56GhostOutline/>}
        header={`Вы собрали ${recog_number(levels.exp)} фантомов и заработали ${levels.lvl} уровень`}
        subheader={`Чтобы начать собирать фантомов, перейдите в магазин и приобретите.\nДо следующего уровня не хватает ${exp_to_next_lvl} фантомов`}
        actions={<Button stretched size='l' onClick={onClick}>Понятно</Button>}>
            <CellButton expandable centered hasActive={false} hasHover={false} onClick={() => {goPanel(activeStory, 'market', true);setActiveModal(null)}}>Приобретите их</CellButton>
        </ModalCard>
    )
}