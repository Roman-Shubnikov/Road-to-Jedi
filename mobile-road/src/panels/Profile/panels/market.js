import React, { useEffect, useRef, useState } from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige

import { 
    Panel,
    PanelHeader,
    Input,
    Avatar,
    Button,
    Header,
    Div,
    Snackbar,
    PanelHeaderBack,
    Text,
    SimpleCell,
    Alert,
    FormLayout,
    Group,
    HorizontalScroll,
    HorizontalCell,
    FormItem,
    Slider,
    Tabs,
    TabsItem,
    Headline,
    TabbarItem,
    IconButton,
    Tappable,
    List,
    Placeholder,
    PanelSpinner,
    usePlatform,
    IOS,
    ButtonGroup,
    } from '@vkontakte/vkui';


import {
  Icon28MoneyHistoryBackwardOutline,
  Icon16CheckCircle,
  Icon20CancelCircleFillRed,
  Icon24BlockOutline,
  Icon24Repeat,
  Icon28MoneyCircleOutline,
  Icon28GhostOutline,
  Icon28RoubleCircleFillBlue,
  Icon28DonateCircleFillYellow,
  Icon28TicketOutline,
  Icon28MoneyRequestOutline,
  Icon28UserOutgoingOutline,
  Icon28InfoOutline,

} from '@vkontakte/icons';

import UserTopC from '../../../components/userTop';
import { useSelector } from 'react-redux';
import { API_URL, AVATARS_URL, LINKS_VK } from '../../../config';
import { enumerate } from '../../../Utils';
import { isEmptyObject } from 'jquery';
import { sendGoal } from '../../../metrika';


const avatars = [
    "1.png",
    "2.png",
    "3.png",
    "4.png",
    "5.png",
    "6.png",
    "7.png",
    "8.png",
    "9.png",
    "10.png",
    "11.png",
    "12.png",
    
]

const blueBackground = {
    backgroundColor: 'var(--accent)'
  };

export default props => {
  const [activeTab, setActivetab] = useState('market');
  const platform = usePlatform();

  const getCurrPanel = () => {
    if(activeTab === 'market') return <Market navigation={props.navigation} callbacks={props.callbacks} reloadProfile={props.reloadProfile} />
    if(activeTab === 'invoices') return <Invoices navigation={props.navigation} callbacks={props.callbacks} reloadProfile={props.reloadProfile} setActivetab={setActivetab} />
    if(activeTab === 'treasures') return <Treasures navigation={props.navigation} callbacks={props.callbacks} reloadProfile={props.reloadProfile} />
  }
  return(
    <Panel id={props.id}>
      <PanelHeader
        left={
          <><PanelHeaderBack onClick={() => window.history.back()} /> </>
        }>
        Магазин
      </PanelHeader>
      <Group>
        <Tabs>
          <HorizontalScroll getScrollToLeft={(i) => i - 50} getScrollToRight={(i) => i + 50}>
            <TabsItem onClick={() => setActivetab('market')}
            selected={activeTab === 'market'}>
              Товары
            </TabsItem>
            <TabsItem onClick={() => setActivetab('invoices')}
            selected={activeTab === 'invoices'}>
              Счета
            </TabsItem>
            {platform !== IOS && <TabsItem onClick={() => {
              setActivetab('treasures');
              sendGoal('marketMoneyClick');
            }}
            selected={activeTab === 'treasures'}>
              Ценности
            </TabsItem>}
          </HorizontalScroll>
        </Tabs>
      </Group>
      {getCurrPanel()}
    </Panel>
  )
}
const Treasures = props => {
  const [products, setProducts] = useState(null);
  const { setSnackbar } = props.callbacks;
  const { goDisconnect } = props.navigation;
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
const Invoices = props => {
  const account = useSelector((state) => state.account.account);
  const platform = usePlatform();
  const { goPanel, setActiveModal } = props.callbacks;
  const { activeStory } = useSelector((state) => state.views)
  
  const genereCardId= (nickname) => {
    nickname = String(nickname)
    let hash = 0, i,chr;
    let chars = nickname.split('')
    for (i = 0; i < chars.length; i++) {
      chr   = chars[i].charCodeAt(0);
      hash  = hash + chr;
    }
    return String(hash + 1000).substring(0,4);
  }
  return(
    <>
    <Group>
      <SimpleCell before={<Icon28RoubleCircleFillBlue />}
        disabled
        after={<IconButton target="_blank" rel="noopener noreferrer" href={LINKS_VK.market_info_article}><Icon28InfoOutline /></IconButton>}
        multiline
        description={
        <div>
          <span>• • • • {genereCardId(account.nickname ? account.nickname : String(account.id))}</span>
          <br/>
          <span>Основной баланс</span>
        </div>
      }>
        <Headline>{account.balance} $</Headline>
      </SimpleCell>
      <Div 
      className='vkuiTabbar--l-vertical' 
      style={{display: 'flex', justifyContent: 'space-around'}}>
        <Tappable disabled={platform === IOS} onClick={platform !== IOS ? () => props.setActivetab('treasures') : undefined}>
          <TabbarItem selected={platform !== IOS}
          text='Пополнить'>
            <Icon28MoneyRequestOutline />
          </TabbarItem>
        </Tappable>
        
        <Tappable
        onClick={() => goPanel(activeStory, 'promocodes', true)}>
          <TabbarItem selected
          text='Промокоды'>
            <Icon28TicketOutline />
          </TabbarItem>
        </Tappable>
        <Tappable 
        onClick={() => setActiveModal('transfer_send')}>
          <TabbarItem selected
          text='Перевести'>
            <Icon28UserOutgoingOutline />
          </TabbarItem>
        </Tappable>
        
        
      </Div>
    </Group>
    <Group>
      <SimpleCell before={<Icon28DonateCircleFillYellow />}
        multiline
        disabled
        after={<IconButton target="_blank" rel="noopener noreferrer" href={LINKS_VK.market_info_donut_article}><Icon28InfoOutline /></IconButton>}
        description={
        <div>
          <span>• • • • {genereCardId(account.vk_id)}</span>
          <br/>
          <span>Эксклюзивный баланс</span>
        </div>
      }>
        <Headline>{account.donuts} $</Headline>
      </SimpleCell>
      <Div>
        <Text style={{color: 'var(--subtext)'}}>Пока тут нет контента, связанного с этой тематической лентой,
          но если у вас такой есть, мы можем об
          судить его публикацию в этом блоке</Text>
      </Div>
    </Group>
    </>
  )
}
const Market = props => {
  const account = useSelector((state) => state.account.account);
  const { setPopout, setSnackbar } = props.callbacks;
  const { goDisconnect } = props.navigation;
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [changed_id, setChangedId] = useState('');
  const [fantom_count, setFantoms] = useState(5);

  const MarketManager = (type, data) => {
    let method,jsonData,textSnack;
    switch(type){
      case 'avatar':
        textSnack = "Аватар успешно сменен";
        method = "shop.changeAvatar&";
        jsonData = {
          'avatar_id': Number(selectedAvatar),
        };
        break;
      case 'changeId':
        textSnack = "Вы успешно сменили ник";
        jsonData = {
          'change_id': changed_id.trim(),
        }
        method = "shop.changeId&";
        break;
      case 'resetId':
        textSnack = "Вы успешно удалили ник";
        jsonData = {}
        method = "shop.resetId&";
        break;
      case 'recomend':
        textSnack = "Вы успешно попали в рекомендации";
        jsonData = {}
        method = "shop.buyRecommendations&";
        break;
      case 'diamond':
        textSnack = "Вы успешно купили алмаз"
        jsonData = {}
        method = "shop.buyDiamond&";
        break;
      case 'fantoms':
        textSnack = `Вы успешно купили ${fantom_count} ` + enumerate(fantom_count, ['фантом','фантома', 'фантомов'])
        jsonData = {
          count: fantom_count,
        }
        method = "shop.buyGhosts&";
        break;
      default:
        method = "shop.changeAvatar&";
    }
     
    fetch(API_URL + `method=${method}` + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify(jsonData)
      })
      .then(data => data.json())
      .then(data => {
        setSelectedAvatar(0);
        if (data.result) {
          setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
            >
              {textSnack}
                </Snackbar>
          )

          setTimeout(() => {
            props.reloadProfile();
          }, 2000)
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
  return (
    <>

      {/* <Div>
                  <FormStatus >
                    Скидки для тестеровщиков
                  </FormStatus>
                </Div> */}
      <Group header={<Header>Фотография профиля</Header>}>
        <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
          <div style={{ display: 'flex' }}>
            {avatars.map((ava, i) =>
              <HorizontalCell key={i} size='m'
                className={((i + 1) === selectedAvatar) ? 'select_avatar' : ''}
                onClick={(e) => (account.avatar.id === i + 1) ? setSnackbar(
                  <Snackbar
                    layout="vertical"
                    onClose={() => setSnackbar(null)}
                    before={<Icon20CancelCircleFillRed width={24} height={24} />}
                  >
                    Вы уже имеете данный аватар
                    </Snackbar>) : (selectedAvatar === (i + 1)) ? setSelectedAvatar(0) : setSelectedAvatar(i + 1)}>
                <Avatar id={i} size={88} src={AVATARS_URL + ava} />

              </HorizontalCell>)}
          </div>
        </HorizontalScroll>
        <Div>
          <Button onClick={() => MarketManager('avatar')}
            before={<Icon28MoneyCircleOutline />}
            size="l"
            stretched
            mode="secondary"
            disabled={selectedAvatar === 0}>Сменить за 700 ECoin</Button>
        </Div>
      </Group>

      <Group header={<Header>Сменить никнейм</Header>}>
        <FormLayout>
          <FormItem>
            <Input placeholder="Введите желаемый ник"
              bottom='Макс. 10 символов'
              onChange={(e) => setChangedId(e.currentTarget.value)}
              value={changed_id}
              maxLength="10" />
          </FormItem>
          <FormItem>
            <ButtonGroup stretched>
            <Button onClick={() => { MarketManager('changeId') }}
                before={<Icon24Repeat width={28} height={28} />}
                stretched
                size="l"
                mode="secondary"
                disabled={!( changed_id.trim().length > 0)}>Сменить за 1500 ECoin</Button>
              {account.nickname ? <Button
                stretched
                size='l'
                onClick={() => setPopout(<Alert
                  actionsLayout='vertical'
                  actions={[{
                    title: 'Удалить ник',
                    autoclose: true,
                    mode: 'destructive',
                    action: () => MarketManager('resetId'),
                  }, {
                    title: 'Нет, я нажал сюда случайно',
                    autoclose: true,
                    style: 'cancel'
                  },]}
                  onClose={() => setPopout(null)}
                  header="Осторожно!"
                  text="Если вы удалите ник, то, возможно, его сможет забрать кто-то другой. После удаления ника у вас будет отображён начальный id"
                />)}
                before={<Icon24BlockOutline width={28} height={28} />}
                mode='destructive'>Удалить ник</Button> : null}
            </ButtonGroup>
          </FormItem>
        </FormLayout>

      </Group>
      </>   
  )
}