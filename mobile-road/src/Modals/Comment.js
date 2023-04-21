import React from 'react';
import { 
    ModalPage,
    CellButton,
    Group,
    Text,
    MiniInfoCell,
    UsersStack

  } from '@vkontakte/vkui';

import { Anchorme } from 'react-anchorme'

import {
  Icon20UserOutline,
  Icon20ArticleOutline,
  Icon20RecentOutline,
  Icon20BombOutline,
  Icon20SkullOutline,
  
} from '@vkontakte/icons';
import { getHumanyTime } from '../Utils';
import { AVATARS_URL } from '../config';
import { ModalHeader } from './headerModalPage';
import { useNavigation } from '../hooks';

export const CommentAgent = props => {
  const Comment = props.comment.objComment;
  const { closeModal, setReport } = useNavigation();
  return (
    <ModalPage 
        id={props.id}
        onClose={closeModal}
        header={
          <ModalHeader>
            Комментарий
          </ModalHeader>
        }
        >
          <Group>
            {Comment.avatar && <MiniInfoCell
            before={Comment.author_id === -1 ? <Icon20SkullOutline /> : <Icon20UserOutline />}
            after={
                <UsersStack
                    photos={[AVATARS_URL + Comment.avatar]} />
            }>
              {Comment.nickname ? Comment.nickname : `Специальный агент #${Comment.author_id}`}
              
          </MiniInfoCell>}
          <MiniInfoCell
            before={<Icon20ArticleOutline />}
            textWrap='full'>
            <Text style={{whiteSpace: "pre-wrap", wordBreak: 'break-word'}} weight='regular'>
                <Anchorme onClick={(e) => {e.stopPropagation()}} target="_blank" rel="noreferrer noopener">
            {Comment.text}
                </Anchorme>
              </Text>
          </MiniInfoCell>
          <MiniInfoCell
            before={<Icon20RecentOutline />}>
              {getHumanyTime(Comment.time).datetime}
          </MiniInfoCell>
          {Comment.bomb_time > 0 && props.comment.mark===-1 && <MiniInfoCell
            textWrap='full'
            before={<Icon20BombOutline style={{color: "var(--dynamic_red)",}} 
            className={'blink2'}
             />}>
              Исправить ответ можно до {getHumanyTime(Comment.bomb_time).datetime}
          </MiniInfoCell>}
          </Group>
          <Group>
            <CellButton size="m"
              href="https://vk.me/club201542328"
              target="_blank" rel="noreferrer noopener"
              centered
              >Коментарий вызывал вопрос?</CellButton>
              {Comment.author_id === -1 || <CellButton size="m"
              mode='danger'
              centered
              onClick={() => {
                closeModal()
                setReport(1, props.comment.message_id)
              }}>Пожаловаться</CellButton>}
          </Group>
            
         
    </ModalPage>
  )
}