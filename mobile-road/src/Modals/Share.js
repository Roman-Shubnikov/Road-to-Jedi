import React from 'react'; // React
import { 
    ModalPage,
    Cell,
    Snackbar,
    Avatar,
    Group,
    

} from "@vkontakte/vkui";
import ModalHeader from './headerModalPage';
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import { blueBackground, HISTORY_IMAGES, LINK_APP, POST_TEXTS } from "../config";
import { 
  Icon24Linked,
  Icon28NewsfeedOutline,
  Icon28StoryAddOutline,
  Icon24Qr,
  Icon16CheckCircle,

} from '@vkontakte/icons';
import { useSelector } from 'react-redux';

export const ModalShare = ({id, onClick, setActiveModal, setSnackbar}) => {
  const account = useSelector((state) => (state.account.account))
    return(
        <ModalPage
        id={id}
        onClose={onClick}
        header={
            <ModalHeader
            onClick={onClick}>
                Поделиться
            </ModalHeader>}
        >
          <Group>
            <Cell onClick={() => setActiveModal("qr")} before={<Icon24Qr width={28} height={28} />}>QR-код профиля</Cell>
            <Cell onClick={() => {
              bridge.send("VKWebAppCopyText", { text: LINK_APP + "#agent_id=" + account['id']}); setActiveModal(null); setSnackbar(<Snackbar
                layout="vertical"
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
              >
                Ссылка скопирована
                    </Snackbar>);
            }} before={<Icon24Linked width={28} height={28} />}>Скопировать ссылку</Cell>
          </Group>
          
      </ModalPage>
    )
}
export const ModalShare2 = ({id, onClick, sharing_type}) => {
  return(
    <ModalPage
      id={id}
      onClose={onClick}
      header={
        <ModalHeader
        onClick={onClick}>
          Рассказать
        </ModalHeader>
      }
      >
        <Group>
          <Cell
            onClick={() => bridge.send("VKWebAppShowWallPostBox",
              {
                message: POST_TEXTS[sharing_type]['text'],
                attachments: POST_TEXTS[sharing_type]['image']
              })}
            before={<Icon28NewsfeedOutline />}>
            На стене
          </Cell>
          <Cell before={<Icon28StoryAddOutline />}
            onClick={() => {
              bridge.send("VKWebAppShowStoryBox",
                {
                  background_type: "image",
                  url: HISTORY_IMAGES[sharing_type]['image'],
                  attachment: {
                    "type": "url",
                    "url": LINK_APP,
                    "text": "learn_more"
                  }
                })
            }}>
            В истории
          </Cell>
        </Group>
          
    </ModalPage>
  )
}







