import React, { useState } from 'react';
import { 
    ModalRoot, 
    Button,
    ModalCard,


} from '@vkontakte/vkui';
import { useNavigation } from '../hooks';
import { CommentAgent } from './Comment';
import { AgentFlashing } from './Prometay';
import { Donut } from './Donut';
import { Verification } from './Verif';
import { Ban } from './Ban';
import { ShowQR, InvalidQR, ValidQR } from './QR';
import { ModalTransfers, ModalTransferCard, ModalTransferCardNotify } from './Transfers';
import { 
    ModalShare,
    ModalShare2,

} from './Share';


import { useSelector } from 'react-redux';
import { Icon56MessageReadOutline } from '@vkontakte/icons';
import { SPECIAL_NORM } from '../config';
import { enumerate } from '../Utils';

// type ticketsData = {
//     tickets: {
//         comment: {

//         }
//     }
// }

// type ModalsProps = {
//     moneyPromo: number,
//     setMoneyPromo: VoidFunction,
//     fetchAccount: VoidFunction,
//     Transfers: any,
//     Transfer: any,
//     setTransfers: VoidFunction,
//     setTransfer: VoidFunction,

// }

export const Modals = ({ 
    moneyPromo, 
    fetchAccount,
    Transfers,
    setTransfers,
    Transfer,
    isMyMark,
    setIsMyMark,

 }) => {
    const { closeModal, setReport, Modal, setActiveModal, setSnackbar } = useNavigation();
    const { account } = useSelector((state) => state.account)
    const [sharing_type, setSharingType] = useState('prometay');
    const comment_special = useSelector((state) => state.tickets.comment)
    return (
        <ModalRoot
        onClose={closeModal}
        activeModal={Modal}>
            <CommentAgent
                id='comment'
                comment={comment_special}
                reporting={setReport} />
            <AgentFlashing
                id='prom'
                onClose={() => {closeModal();setIsMyMark(false)}}
                action={closeModal}
                action2={isMyMark ? () => { setSharingType('prometay'); setActiveModal('share2') } : undefined} />

            <Donut
                id='donut'
                onClose={() => {closeModal();setIsMyMark(false)}}
                action={closeModal}
                action2={isMyMark ? () => { setSharingType('donut'); setActiveModal('share2') } : undefined} />

            <Verification
                id='verif'
                onClose={() => {closeModal();setIsMyMark(false)}}
                action={closeModal}
                action2={isMyMark ? () => { setSharingType('verif'); setActiveModal('share2') } : undefined} />

            <Ban
                id='ban_user'
            />
            
            <ModalShare
            id="share"
            setActiveModal={setActiveModal}
            setSnackbar={setSnackbar}
            onClick={closeModal} />

            <ModalShare2
            id="share2"
            sharing_type={sharing_type}
            onClick={closeModal} />

            <ModalTransfers 
            id='transfer_send'
            reloadProfile={fetchAccount}
            setTransfers={setTransfers}
            />
            <ModalTransferCard 
            id='transfer_card'
            onClick={closeModal}
            Transfers={Transfers}
            setTransfers={setTransfers}
            setActiveModal={setActiveModal}
            />
            <ModalTransferCardNotify
            id='transfer_info'
            onClick={closeModal}
            Transfer={Transfer} />

            <ShowQR
            id='qr'
            onClick={closeModal} />
            <InvalidQR
            id='invalid_qr'
            onClick={closeModal} />
            <ValidQR
            id='valid_qr'
            moneyPromo={moneyPromo}
            onClick={closeModal} />

            <ModalCard
                id='answers'
                onClose={closeModal}
                icon={<Icon56MessageReadOutline width={56} height={56} />}
                header={'Вы оценили ' + account['marked'] + " " + enumerate(account['marked'], ['ответ', 'ответа', 'ответов'])}
                subheader={(SPECIAL_NORM - account['marked'] < 0) ? "Порог достигнут, но это не повод расслабляться." : "Для преодоления порога необходимо оценить ещё " +
                (SPECIAL_NORM - account['marked']) +
                " " + enumerate(account['marked'], ['ответ', 'ответа', 'ответов']) + " за неделю"}
                actions={<Button mode='primary' stretched size='l' onClick={closeModal}>Понятно</Button>}>
            </ModalCard>
            <ModalCard
            onClose={closeModal}
            id='test'>
                Вью 
            </ModalCard>
    </ModalRoot>
    )
}


// {editingStatus ? 
//     <FormLayout>
//         <FormItem bottom={publicStatus.trim().length + '/' + PUBLIC_STATUS_LIMIT}>
//             <Textarea 
//             placeholder="Введите статус тут..."
//             maxLength={PUBLIC_STATUS_LIMIT}
//             value={publicStatus}
//             onChange={e => {setPublicStatus(e.currentTarget.value)}}
//             />
//         </FormItem>
//         <FormItem>
//             <div style={{display: 'flex'}}>
//                 <Button
//                 style={{marginRight: 5}}
//                 onClick={() => {setEdititingStatus(false);setPublicStatus(originalStatus)}}
//                 mode='secondary'
//                 size='s'>
//                     Отменить
//                 </Button>
//                 <Button
//                 onClick={() => statusMenager()}
//                 mode='primary'
//                 size='s'>
//                     Сохранить
//                 </Button>
//             </div>
//         </FormItem>
//     </FormLayout>
//     : 