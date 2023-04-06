import React from 'react'; // React
import { 
    ModalPage,
    ModalCard,
    Button,


} from "@vkontakte/vkui";
import vkQr from '@vkontakte/vk-qr';
import ModalHeader from './headerModalPage';
import { 
  Icon56ErrorOutline,
  Icon56CheckCircleOutline,

} from '@vkontakte/icons';

import { LINK_APP } from '../config';
import { useSelector } from 'react-redux';
import { useNavigation } from '../hooks';
function qr(agent_id, sheme) {
    let hex = "foregroundColor"
    if (sheme === "bright_light" || sheme === "vkcom_light") {
      hex = "#000"
    }
    if (sheme === "space_gray"|| sheme === "vkcom_dark") {
      hex = "#fff"
    }
    return (
      vkQr.createQR(LINK_APP + '#agent_id=' + agent_id, {
        qrSize: 120,
        isShowLogo: true,
        foregroundColor: hex,
        className: 'svgqr'
      })
    )
  }

export const ShowQR = ({id, onClick}) => {
  const { account, schemeSettings } = useSelector((state) => state.account)
  const { scheme } = schemeSettings;
  const { closeModal } = useNavigation();
  return(
      <ModalPage
      id={id}
      onClose={closeModal}
      dynamicContentHeight
      header={
          <ModalHeader
          onClick={onClick}
          >QR-код профиля</ModalHeader>
      }
    >
      {<div className="qr" dangerouslySetInnerHTML={{ __html: qr(account.id, scheme) }} />}
      <br />
      <div className="qr" >Отсканируйте камерой ВКонтакте!</div>
      <br />
    </ModalPage>
  )
}

export const InvalidQR = ({id, onClick}) => {
  const { closeModal } = useNavigation();
  return(
      <ModalCard
      id={id}
      onClose={closeModal}
      icon={<Icon56ErrorOutline />}
      header="Промокод недействительный"
      caption={
        <span>
          Увы, активировать промокод не получится, так как он использовался ранее или его никогда не существовало.
              </span>}
      actions={
        <Button mode='secondary' stretched size='l' onClick={onClick}>Понятно</Button>
      } />
  )
}

export const ValidQR = ({id, onClick, moneyPromo}) => {
  const { closeModal } = useNavigation();
  return(
    <ModalCard
    id={id}
    onClose={closeModal}
    icon={<Icon56CheckCircleOutline />}
    header="Вы активировали промокод!"
    caption={
      <span>
        Поздравляем! На Ваш виртуальный счет было начислено {moneyPromo} ECoin.
            </span>}
    actions={
      <Button mode='primary' stretched size='l' onClick={onClick}>Ура!</Button>
    } />
  )
}



      
      