import React from 'react';
import { 
    ModalCard, 
    Input,
    FormLayout,
    FormItem,
    Button,
  } from '@vkontakte/vkui';
import { useState } from 'react';
import { API_SIGN, API_URL, DEFAULT_PUBLIC_STATUS } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '../hooks';
import { StoreObject } from '../store';
import { accountActions } from '../store/main';

export const EditStatus = ({ id }: { id: string }) => {
  const dispatch = useDispatch();
  const { closeModal, setPopout, showErrorAlert, goDisconnect, setActiveModal } = useNavigation();
  const account = useSelector((state: StoreObject) => state.account.account)
  const [status, setStatus] = useState(account.publicStatus || DEFAULT_PUBLIC_STATUS);
  const [fetching, setFetching] = useState(false)

  const editStatus = () => {
    setFetching(true);
    fetch(API_URL + 'method=account.changeStatus&' + API_SIGN, {
      method: 'post',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify({
          status: status.trim(),
      })
  })
    .then(res => res.json())
    .then(data => {
        if (data.result) {
          dispatch(accountActions.setPublicStatus(status.trim()))
          setFetching(false);
        } else {
            showErrorAlert(data.error.message)
        }
    })
    .catch(goDisconnect)
    .finally(() => {
      setActiveModal(null)
    })
  }

  return (
    <ModalCard
      id={id}
      onClose={closeModal}
      header="Статус"
      actions={
        <Button mode='secondary'
        loading={fetching}
          stretched size='l'
          onClick={() => editStatus()}>Сохранить</Button>
      }
    >
      <FormLayout>
        <FormItem>
          <Input onChange={(e) => setStatus(e.currentTarget.value)} value={status} />
        </FormItem>
      </FormLayout>
    </ModalCard>
  )

}
