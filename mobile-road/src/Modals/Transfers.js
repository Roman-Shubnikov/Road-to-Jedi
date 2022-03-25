import React, { useState } from 'react'; // React
import { 
    ModalCard,
    Button,
    FormLayout,
    FormItem,
    Input,
    ScreenSpinner,
    Avatar,
} from "@vkontakte/vkui";
import { 
  Icon56MoneyTransferOutline,

} from '@vkontakte/icons';
import { API_URL } from '../config';


export const ModalTransfers = ({id, onClick, setActiveModal, reloadProfile, setPopout, goDisconnect, showErrorAlert, setTransfers}) => {
  const [comment, setComment] = useState('');
  const [to_agent, setAgent] = useState('');
  const [count, setCount] = useState('');
    const sendMoney = () => {
        setPopout(<ScreenSpinner />)
        fetch(API_URL + 'method=transfers.send&' + window.location.search.replace('?', ''),
          {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'summa': count,
              'send_to': to_agent,
              'comment': comment
            })
          })
          .then(data => data.json())
          .then(data => {
            if (data.result) {
              setTimeout(() => {
                reloadProfile();
                setPopout(null)
                setTransfers(data.response)
                setActiveModal("transfer_card")
              }, 2000)
    
            } else {
              showErrorAlert(data.error.message)
            }
          })
          .catch(goDisconnect)
      }
      const validateInputs = (title) => {
        if (title.length > 0) {
          let valid = ['error', 'Заполните это поле'];
          if (/^[a-zA-ZА-Яа-я0-9_ .,"'!?\-=+]*$/ui.test(title)) {
            valid = ['valid', '']
          } else {
            valid = ['error', 'Поле не должно содержать спец. символы'];
          }
    
          return valid
        }
        return ['default', '']
    
      }
    return(
        <ModalCard
        id={id}
        onClose={onClick}
        icon={<Icon56MoneyTransferOutline />}
        header="Отправляйте ECoin друзьям"
      >
        <FormLayout>
          <FormItem
            status={validateInputs(to_agent)[0]}
            bottom={validateInputs(to_agent)[1]}>
            <Input maxLength="15"
              onChange={(e) => setAgent(e.currentTarget.value)}
              placeholder="Введите id или ник агента"
              value={to_agent}
            />
          </FormItem>
          <FormItem>
            <Input maxLength="5"
              type='number'
              onChange={(e) => setCount(e.currentTarget.value)}
              placeholder="Введите кол-во ECoin"
              value={count} />
          </FormItem>
          <FormItem
            status={validateInputs(comment)[0]}
            bottom={validateInputs(comment)[1]}>
            <Input
              maxLength="100"
              name="money_transfer_comment"
              onChange={(e) => {setComment(e.currentTarget.value);console.log(e.currentTarget.value)}}
              placeholder="Введите комментарий к переводу"
              value={comment}
            />
          </FormItem>
          <FormItem>
            <Button
              disabled={
                !to_agent || !count
              }
              size='l'
              stretched
              mode='secondary'
              type='submit'
              onClick={() => {
                setActiveModal(null)
                sendMoney();
              }}>Отправить</Button>
          </FormItem>
        </FormLayout>
      </ModalCard>
    )
}

export const ModalTransferCard = ({id, onClick, Transfers, setTransfers, setActiveModal}) => {
    return(
        <ModalCard
        id={id}
        onClose={onClick}
        icon={<Avatar src={Transfers ? Transfers.avatar : null} size={72} />}
        header={Transfers ? "Ваш баланс: " + Transfers.money : null}
        subheader={Transfers ? Transfers.text : null}
        actions={
          <Button mode='secondary'
            size='l'
            stretched
            onClick={() => {
              setActiveModal(null);
              setTransfers(null)
            }}>Закрыть</Button>
        }
      >
      </ModalCard>
    )
}
export const ModalTransferCardNotify = ({id, onClick, Transfer}) => {
  return(
    <ModalCard
    id={id}
    onClose={onClick}
    icon={<Avatar src={Transfer.avatar} size={72} />}
    header='Перевод ECoin'
    subheader={Transfer.comment}
    actions={
    <Button mode='secondary' stretched size='l' onClick={onClick}>Закрыть</Button>
  }
  />
  )
}