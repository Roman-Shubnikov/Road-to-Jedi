import React from 'react';

import { 
    Button,
    Panel,
    PanelHeader,
    Div,
    Placeholder,
    Group,
    } from '@vkontakte/vkui';


import SclidePlaceholder from '../../../images/start_slide_1.svg'

export default props => {
  const { goPanel } = props.callbacks;

  return (
    <Panel id={props.id}>
      <PanelHeader
      >
        Road to Jedi
                </PanelHeader>
      <Group>
        <Placeholder
          icon={<img style={{ width: 250, height: 130 }} src={SclidePlaceholder} alt='Тут была иконка... Press F to pay respect...' />}
          header='Отвечайте на разные вопросы пользователей ВКонтакте'>
          Вам присвоен номер #{props.account.id !== undefined ? props.account.id : "undefined"}
          <br /><br />Помните, отвечать нужно вдумчиво. После
                    ответа Команда наших специальных агентов
                    проверит его и в случае отрицательной
                    оценки — оставит комментарий, если все
                    хорошо, Вы получите уведомление.
                    <br /><br />Сервис не имеет отношения к
                    Администрации ВКонтакте
                  </Placeholder>
        <Div>
          <Button
            size='l'
            stretched
            onClick={() => {
              goPanel('start2');
            }}
            mode='secondary'>Далее</Button>
        </Div>
      </Group>

    </Panel>
  )
}