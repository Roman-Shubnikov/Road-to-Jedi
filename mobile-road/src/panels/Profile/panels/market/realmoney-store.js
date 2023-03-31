import React, { useEffect, useRef, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Avatar,
    Snackbar,
    SimpleCell,
    Group,
    List,
    Placeholder,
    PanelSpinner,
} from '@vkontakte/vkui';
import {
  Icon20CancelCircleFillRed,
} from '@vkontakte/icons';
import { API_URL } from '../../../../config';
import { enumerate } from '../../../../Utils';
import { isEmptyObject } from 'jquery';
import { useNavigation } from '../../../../hooks';


export const RealMoneyStore = props => {
    const [products, setProducts] = useState(null);
    const { goDisconnect, setSnackbar } = useNavigation();
    const fetched = useRef(false);
    const getCost = (price, discount, enum_list) => {
      let total_price = price - discount;
      let price_show;
      if(discount !== 0 && discount !== undefined) {
        price_show = <span>Стоимость: <span style={{textDecoration: 'line-through'}}>{price}</span> {total_price} {enumerate(total_price, enum_list)}</span>
      }else{
        price_show = "Стоимость: " + price + " " + enumerate(total_price, enum_list);
      }
      return price_show
    }
    useEffect(() => {
      const getProducts = () => {
        fetch(API_URL + `method=shop.getProducts&` + window.location.search.replace('?', ''))
          .then(data => data.json())
          .then(data => {
            if (data.result) {
              setProducts(data.response)
              fetched.current = true
            } else {
              setSnackbar(
                <Snackbar
                  layout="vertical"
                  onClose={() => setSnackbar(null)}
                  before={<Icon20CancelCircleFillRed width={24} height={24} />}
                >
                  {data.error.message}
                </Snackbar>);
            }
          })
          .catch(goDisconnect)
      }
      if(!fetched.current){
        getProducts()
      }
      
    }, [setSnackbar, goDisconnect])
    return(
      <>
      <Group>
        <List>
          {products ? !isEmptyObject(products) ? 
          products.map((res, i) => 
          <SimpleCell
          key={i}
          onClick={() => {
            bridge.send('VKWebAppShowOrderBox', {type: 'item', item: res.item_name})
            .then(data => {if(data.success) {props.reloadProfile()}})
          }}
          before={<Avatar mode="image" src={res.photo_url} shadow={false} style={{backgroundColor: 'var(--background_page_my)'}} />}
          description={
            getCost(res.price, res.discount, ['голос', 'голоса', 'голосов'])
          }>
            {res.title}
          </SimpleCell>
          )
          : 
          <Placeholder>
            Все товары, кажется, разобрали. Сейчас их нет в наличии. Скоро появятся.
          </Placeholder> : <PanelSpinner/>}
        </List>
      </Group></>
    )
  }