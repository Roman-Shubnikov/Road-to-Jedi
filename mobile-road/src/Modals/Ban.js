import React from 'react';
import { 
    ModalCard, 
    Select,
    Input,
    Avatar,
    ScreenSpinner,
    FormLayout,
    FormItem,
    Button,
    FormLayoutGroup,
    CustomSelectOption,
  } from '@vkontakte/vkui';
import { useState } from 'react';
import { API_URL } from '../config';
import { timeConvertVal } from '../Utils';
import { useSelector } from 'react-redux';

export default props => {
  const [time_val, setTimeVal] = useState('');
  const [time_num, setTimeNum] = useState('sec');
  const [reason, setReason] = useState('');
  const OtherProfileData = useSelector((state) => (state.account.other_profile))
  const { setPopout, showErrorAlert, setActiveModal, showAlert } = props.callbacks;

  const userBan = (user_id, text, time) => {
    this.setPopout(<ScreenSpinner />)
    fetch(API_URL + "method=account.ban&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'agent_id': user_id,
          'timeban': time,
          'reason': text,

        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          setActiveModal(null);
          showAlert('Успех', 'Пользователь забанен');
          setPopout(null);
        } else {
          showErrorAlert(data.error.message)
        }
      })
      .catch(err => {
        this.changeData('activeStory', 'disconnect')
      })
  }

  return (
    <ModalCard
      id='ban_user'
      onClose={props.onClose}
      icon={<Avatar src={OtherProfileData ? OtherProfileData['avatar']['url'] : null} size={72} />}
      header="Забанить пользователя"
      actions={
        <Button mode='secondary'
          stretched size='l'
          onClick={() => {
            userBan(OtherProfileData ? OtherProfileData['id'] : 0, reason, timeConvertVal(time_val, time_num))
          }}>Заблокировать</Button>
      }
    >
      <FormLayout>
        <FormItem>
          <Input disabled
            value={OtherProfileData ? (OtherProfileData['id'] < 0) ? -OtherProfileData['id'] : OtherProfileData['id'] : null} />
        </FormItem>

        <FormLayoutGroup mode='horizontal'>
          <FormItem>
            <Input maxLength="100"
              type='number'
              name="time_val"
              onChange={(e) => setTimeVal(e)} placeholder="Число"
              value={time_val} />
          </FormItem>
          <FormItem
            status={time_num ? 'valid' : 'error'}
            bottom={time_num ? '' : 'А где время'}>
            <Select
              value={time_num}
              defaultValue='sec'
              options={[{ label: 'sec', value: 'sec' }, { label: 'min', value: 'min' }, { label: 'day', value: 'day' }]}
              renderOption={({ option, ...restProps }) => (
                <CustomSelectOption {...restProps} />
              )}
              onChange={e => { setTimeNum( e.currentTarget.value ) }}
            />
          </FormItem>
        </FormLayoutGroup>

        <FormItem>
          <Input maxLength="100" name="ban_reason" onChange={(e) => setReason(e.currentTarget.value)} placeholder="Введите причину бана" value={reason} />
        </FormItem>
      </FormLayout>



    </ModalCard>
  )

}
