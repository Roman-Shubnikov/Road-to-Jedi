import React, { useState } from 'react';

import { 
    Button,
    Panel,
    PanelHeader,
    ScreenSpinner,
    FormLayout,
    FormStatus,
    Slider,
    Placeholder,
    PanelHeaderBack,
    Group,
    FormItem
    } from '@vkontakte/vkui';


import SclidePlaceholder from '../../../images/start_slide_2.svg'
export default props => {
  const [age, setAge] = useState(0);
  const { setPopout, reloadProfile, setActiveStory, showErrorAlert } = props.callbacks;
  const ChangeAge = (age) => {
    setPopout(<ScreenSpinner />)
    fetch(this.state.api_url + "method=account.setAge&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({ 'age': age })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setTimeout(() => {
            reloadProfile();
            setActiveStory('questions');
          }, 2000);
        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        setActiveStory('disconnect')
      })
    }
    return (
      <Panel id={props.id}>
        <PanelHeader
          left={
            <PanelHeaderBack onClick={() => window.history.back()} />
          }>
          Road to Jedi
                </PanelHeader>
        <Group>
          <Placeholder
            icon={<img style={{ width: 200, height: 180 }} src={SclidePlaceholder} alt='Тут была иконка... Press F to pay respect...' />}
            header='Прежде чем начать, укажите следующие
                                      данные, они помогут нам оценивать
                                      Ваши ответы.'></Placeholder>
        </Group>
        <Group>
          <Placeholder>Убедительно просим, указывать только настоящие
          данные, для избежания большого количества
          неверных оценок от лица
          модерации.
                    </Placeholder>
        </Group>
        <Group>
          <FormLayout>
            <FormStatus header="Внимание! Важная информация" mode="error">
              Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                    </FormStatus>
            <FormItem top={`Укажите свой возраст: ${age}`}>
              <Slider
                min={10}
                max={80}
                step={1}
                value={age}
                onChange={e => {
                  setAge(e);
                }}

              />
            </FormItem>
            <FormItem>
              <Button
                size='l'
                stretched
                type='submit'
                mode='secondary'
                disabled={!age}
                onClick={() => {
                  ChangeAge(age);

                }}>Приступить!</Button>
            </FormItem>

          </FormLayout>
        </Group>
      </Panel>
    )

  }

