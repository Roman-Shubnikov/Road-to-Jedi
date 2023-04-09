import React, { useCallback, useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import { 
    Panel,
    PanelHeader,
    Header,
    PanelHeaderBack,
    FormLayout,
    Input,
    Button,
    Snackbar,
    Avatar,
    PanelHeaderButton,
    FormItem,
    Group
    } from '@vkontakte/vkui';


import Icon20CancelCircleFillRed    from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon16CheckCircle            from '@vkontakte/icons/dist/16/check_circle';
import Icon28ScanViewfinderOutline  from '@vkontakte/icons/dist/28/scan_viewfinder_outline';
import { API_URL } from '../../../config';
import { isEmptyObject } from 'jquery';

import queryString from 'query-string';


const greenBackground = {
    backgroundColor: 'var(--dynamic_green)'
  };
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
var promoInfo = {
  check: 'check',
  activate: 'activate',

}
export const PromocodesPanel = props => {
  const [promocode, setPromocode] = useState('');
  const { setActiveModal, setSnackbar } = props.callbacks;
  const hash = queryString.parse(window.location.hash);
  const { goDisconnect } = props.navigation;

  const setErrorSnackbar = useCallback((text) => {
    setSnackbar(
      <Snackbar
        layout="vertical"
        onClose={() => setSnackbar(null)}
        before={<Avatar size={24}><Icon20CancelCircleFillRed width={24} height={24} /></Avatar>}
      >
        {text}
      </Snackbar>
    )
  }, [setSnackbar])
  const promoMenager = (type) => {
    let method = (type === promoInfo.check) ? "method=shop.checkPromo&" : "method=shop.activatePromo&";
    fetch(API_URL + method + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'promocode': promocode,
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.result) {
          if (type === promoInfo.check){
            setSnackbar(
              <Snackbar
                layout="vertical"
                onClose={() => setSnackbar(null)}
                before={<Avatar size={24} style={greenBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
              >
                Промокод действителен
                </Snackbar>
            )
          } else if (type === promoInfo.activate){
            props.setMoneyPromo(data.response.cost)
            setActiveModal('valid_qr');
            setTimeout(() => {
              props.reloadProfile();
            }, 4000)
          }
          
        } else {
          if (type === promoInfo.check) {
            setErrorSnackbar(data.error.message)
          } else if (type === promoInfo.activate) {
            if (data.error.error_code === 1015) {
              setActiveModal('invalid_qr');
            } else {
              setErrorSnackbar(data.error.message)
            }
          }

        }
      })
      .catch(goDisconnect)
  }
  const validatePromo = (promo) => {
    let valid = ['default', '']
    if (promo.length >= 1) {
      if (/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/ui.test(promo)) {
        valid = ['valid', 'Промокод введён верно']
      } else {
        valid = ['error', 'Промокод введён неверно']
      }
    }
    return valid;
  }

  const QRHandler = () => {
      bridge.send("VKWebAppOpenCodeReader")
        .then(data => {
          data = data['code_data']
          let machedHash = data.match(/#(.*)/);
          if (!isEmptyObject(machedHash)){
            let parse = queryString.parse(machedHash[1]);
            if (validatePromo(parse.promo)[0] === 'valid'){
              setPromocode(parse.promo)

            } else setErrorSnackbar("Некорректный QR-код");
          } else setErrorSnackbar("Хеш строка не найдена QR-код");
        })
        .catch(err => {
          if (err.error_type) {
            setErrorSnackbar("Вначале просканируйте QR-код");
          } else {
            setErrorSnackbar(err.error_data);
          }
        })

  }

  useEffect(() => {
    if (hash.promo) {
      if (/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/ui.test(hash.promo)) {
        setPromocode(hash.promo)
      } else {
        setErrorSnackbar("Некорректный QR-код");
      }
    }
  }, [setPromocode, setErrorSnackbar, hash.promo])

  return (
    <Panel id={props.id}>
      <PanelHeader
        before={
          <>
            <PanelHeaderBack onClick={() => window.history.back()} />
            {platformname ? <PanelHeaderButton onClick={() => QRHandler()}><Icon28ScanViewfinderOutline /></PanelHeaderButton> : null}
          </>
        }>
        Активация
      </PanelHeader>

      <Group header={<Header>Активировать промокод</Header>}>
        <FormLayout>
          <FormItem>
            <Input
              top='Введите промокод и получите монетки, которые можно потратить на товары в магазине.'
              maxLength="14"
              name="promo"
              status={validatePromo(promocode)[0]}
              bottom={validatePromo(promocode)[1]}
              onChange={(e) => setPromocode(e.currentTarget.value)}
              placeholder="XXXX-XXXX-XXXX"
              value={promocode} />
          </FormItem>
          <FormItem>
            <Button size='l'
              stretched
              type='submit'
              mode='primary'
              onClick={() => {
                promoMenager(promoInfo.activate);
              }}
              disabled={!(validatePromo(promocode)[0] === 'valid')}
            >Активировать</Button>
          </FormItem>
        </FormLayout>
      </Group>

      <Group header={<Header>Проверить промокод</Header>}>
        <FormLayout>
          <FormItem>
            <Input
              top='Введите промокод и проверьте его. Если он действителен, то любой пользователь может его ввести.'
              maxLength="14"
              status={validatePromo(promocode)[0]}
              bottom={validatePromo(promocode)[1]}
              onChange={(e) => setPromocode(e.currentTarget.value)}
              placeholder="XXXX-XXXX-XXXX"
              value={promocode} />
          </FormItem>
          <FormItem >
            <Button size='l'
              mode='secondary'
              type='submit'
              stretched
              onClick={() => {
                promoMenager(promoInfo.check);
              }}
              disabled={!(validatePromo(promocode)[0] === 'valid')}
            >Проверить</Button>
          </FormItem>
        </FormLayout>
      </Group>
    </Panel>
  )
}