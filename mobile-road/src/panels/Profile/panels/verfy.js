import React, { useCallback, useEffect, useState } from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderBack,
    FormLayout,
    Input,
    Textarea,
    Checkbox,
    Button,
    Link,
    Placeholder,
    ScreenSpinner,
    Group,
    FormItem,
    Div,
    Card,
    MiniInfoCell,

    } from '@vkontakte/vkui';
import { API_URL, LINKS_VK } from '../../../config';
import {VerifyMan, VerifyDialogs} from '../images/svg';
import { 
  Icon20RectangleInfoOutline,
  Icon20PictureOutline,
  Icon20CheckNewsfeedOutline,
  Icon20HistoryBackwardOutline,
  Icon20AppBadgeOutline,
} from '@vkontakte/icons';


const maxLength = 2000;
const minLengthTitle = 5;
const minLengthDesc = 10;
export default props => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(-1);
  const [check1, setCheck1] = useState(false);
  const { goDisconnect } = props.navigation;
  const { setPopout, showErrorAlert } = props.callbacks;
  const checkVerfStatus = useCallback(() => {
    fetch(API_URL +
      "method=account.getVerfStatus&" + window.location.search.replace('?', ''))
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setStatus(data.response)
          setPopout(null);
        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(goDisconnect)
  }, [setPopout, showErrorAlert, goDisconnect])
  const handleForm = () => {
    setPopout(<ScreenSpinner />);
    fetch(API_URL +
      "method=account.sendRequestVerf&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'title': title.trim(),
          'description': description.trim(),
          'cond1': check1,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          checkVerfStatus()
        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(goDisconnect)

  }
  const validateTitle = (title, max, min) => {
    if (title.length > 0) {
      let valid = ['error', `Текст должен быть не больше ${max} и не меньше ${min} символов`];
      if (title.length <= max && title.length > min) {
        if (/^[a-zA-ZА-Яа-я0-9_ё .,"':!?*+=-]*$/ui.test(title)) {
          valid = ['valid', '']
        } else {
          valid = ['error', 'Текст не должен содержать спец. символы'];
        }
      }

      return valid
    }
    return ['default', '']
  }
  useEffect(() => {
    setPopout(<ScreenSpinner/>)
    checkVerfStatus()
// eslint-disable-next-line
  }, [setPopout])

  return (
    <Panel id={props.id}>
      <PanelHeader
        before={<>
          <PanelHeaderBack onClick={() => window.history.back()}></PanelHeaderBack>
        </>}>
        Верификация
                </PanelHeader>
      {(status !== -1) ? (status === 2) ? <><Group><Placeholder
        icon={VerifyDialogs}
        header='Вы отправили заявку на верификацию'>Вы отправили заявку на верификацию,
        по окончании проверки — мы сообщим Вам о результатах присвоении официального статуса</Placeholder>
      </Group></> : <>
        <Group>
          <Placeholder
          className='placeholders_short-bottom'
          style={{paddingBottom: 10}}
          icon={VerifyMan}>
            Верификация — это процесс подтверждения того, что профиль Агента пренадлежит настоящему пользователю.
            <br/><br/>Если проверка пройдена, профиль получает особую отметку — галочку справа от названия
            <Div style={{textAlign: 'left', paddingTop: 20}}>
              <Card mode='outline' style={{paddingTop: 5, paddingBottom: 5}}>
                <MiniInfoCell textWrap='full'
                before={<Icon20RectangleInfoOutline />}>
                  Страница ВКонтакте заполнена
                </MiniInfoCell>
                <MiniInfoCell textWrap='full'
                before={<Icon20PictureOutline />}>
                  На странице должны быть размещены фотографии
                </MiniInfoCell>
                <MiniInfoCell textWrap='full'
                before={<Icon20CheckNewsfeedOutline />}>
                  Страница должна переодически обновляться
                </MiniInfoCell>
                <MiniInfoCell textWrap='full'
                before={<Icon20HistoryBackwardOutline />}>
                  Агентскому профилю более 2 месяцев
                </MiniInfoCell>
                <MiniInfoCell textWrap='full'
                before={<Icon20AppBadgeOutline />}>
                  Количество отрицательных ответов не превышает
                  количество положительных
                </MiniInfoCell>
              </Card>
              {/* <Button mode='tertiary'
              target="_blank" rel="noopener noreferrer">
                Узнать подробности о процедуре
              </Button> */}
            </Div>
          </Placeholder>
          
        </Group>
        <Group>
          <FormLayout>
            <FormItem
              status={validateTitle(title.trim(), maxLength, minLengthTitle)[0]}
              top="Общая информация"
                bottom={validateTitle(title.trim(), maxLength, minLengthTitle)[1]}>
              <Input
                maxLength="2000"
                value={title}
                onChange={(e) => setTitle(e.currentTarget.value)}
                placeholder='Введите свой текст...' />
            </FormItem>
            <FormItem
              top="Почему вы решили верифицировать профиль"
                bottom={validateTitle(description.trim(), maxLength, minLengthDesc)[1]}
                status={validateTitle(description.trim(), maxLength, minLengthDesc)[0]}>
              <Textarea
                maxLength="2000"
                value={description}
                onChange={(e) => setDescription(e.currentTarget.value)}
                placeholder='Введите свой текст...' />
            </FormItem>
            <Checkbox checked={check1} onChange={() => setCheck1(prev => !prev)}>
              Согласен с <Link
                href={LINKS_VK.verification}
                target="_blank" rel="noopener noreferrer">
                правилами</Link> верификации
                  </Checkbox>
            <FormItem>
              <Button
                size='l'
                stretched
                disabled={
                  !check1 ||
                  !(validateTitle(title.trim(), maxLength, minLengthTitle)[0] === 'valid') ||
                  !(validateTitle(description.trim(), maxLength, minLengthDesc)[0] === 'valid')
                }
                onClick={() => handleForm()}
              >Отправить на рассмотрение</Button>
            </FormItem>
          </FormLayout>
        </Group>
      </> : null}
    </Panel>
  )
}