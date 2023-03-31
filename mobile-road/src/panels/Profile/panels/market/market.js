import React, { useState } from 'react';

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
  Headline,
  TabbarItem,
  IconButton,
  Tappable,
  usePlatform,
  Switch,
  Tabs,
  TabsItem,
  ScreenSpinner,
  Platform,
} from '@vkontakte/vkui';


import {
  Icon16CheckCircle,
  Icon20CancelCircleFillRed,
  Icon16StarCircleFillYellow,
  Icon28RoubleCircleFillBlue,
  Icon28DonateCircleFillYellow,
  Icon28TicketOutline,
  Icon28MoneyRequestOutline,
  Icon28UserOutgoingOutline,
  Icon28InfoOutline,
  Icon28UserStarBadgeOutline,
  Icon28SparkleOutline,
} from '@vkontakte/icons';
import { useSelector } from 'react-redux';
import { API_URL, AVATARS_URL, LINKS_VK, PERMISSIONS } from '../../../../config';
import { sendGoal } from '../../../../metrika';
import { useNavigation } from '../../../../hooks';

import { RealMoneyStore } from './realmoney-store';
import { AvatarGenerator } from './generate-avatar';

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

]
const donutAvatars = [
    "1000.png",
    "1001.png",
    "1002.png",
    "1003.png",
    "1004.png",
    "1005.png",
    "1006.png",
    "1007.png",
    "1008.png",
    "1009.png",
]
const specialAvatars = [
    "2000.png",
    "2001.png",
    "2002.png",
    "2003.png",
    "2004.png",
    "2005.png",
    "2006.png",
    "2007.png",
    "2008.png",
    "2009.png",
]
const zenAvatars = [
    "3000.png",
    "3001.png",
    "3002.png",
    "3003.png",
    "3004.png",
    "3005.png",
    "3006.png",
    "3007.png",
    "3008.png",
    "3009.png",
]
const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


export const MarketPage = props => {
  const [activeTab, setActivetab] = useState('market');
  const platform = usePlatform();
  const labels = [
    {
      label: 'Аватарка',
      value: 'avatar', 
    },
    {
      label: 'Товары', 
      value: 'market', 
    },
    {
      label: 'Счета', 
      value: 'invoices', 
    },
    {
      label: 'Ценности', 
      value: 'real-money-store', 
    }
  ]
  const getCurrPanel = () => {
    switch(activeTab) {
      case 'avatar': return <AvatarGenerator prices={[]} /> 
      case 'market': return <Market reloadProfile={props.reloadProfile} />
      case 'invoices': return <Invoices reloadProfile={props.reloadProfile} setActivetab={setActivetab} />
      case 'real-money-store': return <RealMoneyStore reloadProfile={props.reloadProfile} />
    }
  }
  return(
    <Panel id={props.id}>
      <PanelHeader
      separator={!platformname}
        left={
          <><PanelHeaderBack onClick={() => window.history.back()} /> </>
        }>
        Магазин
      </PanelHeader>
      <Group>
        <Tabs mode='accent'>
          <HorizontalScroll>
            {(platform !== Platform.IOS ? labels : labels.slice(0,2)).map((label) => 
            <TabsItem
              key={label.value}
              onClick={() => {
                setActivetab(label.value)
                if(label.value === 'real-money-store') {
                  sendGoal('marketMoneyClick');
                }
              }}
              selected={activeTab === label.value}
            >
              {label.label}
            </TabsItem>)}
          </HorizontalScroll>
        </Tabs>        
      </Group>
      {getCurrPanel()}
    </Panel>
  )
}

const Invoices = props => {
  const account = useSelector((state) => state.account.account);
  const platform = usePlatform();
  const { goPanel, setActiveModal } = useNavigation();
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
        <Headline>{account.balance}</Headline>
      </SimpleCell>
      {platform === Platform.IOS && <Div>
        <Text style={{color: 'var(--subtext)'}}>Платежи на данной платформе недоступны.</Text>
      </Div>}
      <Div 
      className='vkuiTabbar--l-vertical' 
      style={{display: 'flex', justifyContent: 'space-around'}}>
        {platform !== Platform.IOS && 
        <Tappable onClick={() => props.setActivetab('real-money-store')} style={{padding: 8}}>
          <TabbarItem selected={platform !== Platform.IOS}
          text='Пополнить'>
            <Icon28MoneyRequestOutline />
          </TabbarItem>
        </Tappable>}
        
        <Tappable
        style={{padding: 8}}
        onClick={() => goPanel(activeStory, 'promocodes', true)}>
          <TabbarItem selected
          text='Промокоды'>
            <Icon28TicketOutline />
          </TabbarItem>
        </Tappable>
        <Tappable 
        style={{padding: 8}}
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
        <Headline>{account.donuts}</Headline>
      </SimpleCell>
      <Div>
        <Text style={{color: 'var(--subtext)'}}>Данный баланс нельзя пополнить настоящей валютой, получить её можно только отвечая на вопросы с эксклюзивной отметкой.</Text>
      </Div>
    </Group>
    </>
  )
}
const Market = props => {
  const account = useSelector((state) => state.account.account);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [hideDonut, setHidedonut] = useState(() => (!account.settings.hide_donut))
  const [colorchangeDonut, setColorchangeDonut] = useState(() => (account.settings.change_color_donut))
  const { goDisconnect, showErrorAlert, setPopout, setSnackbar } = useNavigation();
  const [changed_id, setChangedId] = useState(account.nickname ? account.nickname : '');
  const permissions = account.permissions;
  const moderator_permission = permissions >= PERMISSIONS.special;

  const saveSettings = (setting, value) => {
    setPopout(<ScreenSpinner />)
    fetch(API_URL + "method=settings.set&" + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'setting': setting,
          'value': value,
        })
      })
      .then(data => data.json())
      .then(data => {
        if (data.result) {
          setPopout(null)
          setTimeout(() => {
            props.reloadProfile();
          }, 4000)
        } else {
          showErrorAlert(data.error.message);
        }
      })
      .catch(goDisconnect)
  }

  const hide_donut = (check) => {
    check = check.currentTarget.checked;
    setHidedonut(check);
    saveSettings('hide_donut', Number(!check))
  }
  const needChangeColor = (check) => {
    check = check.currentTarget.checked;
    setColorchangeDonut(check);
    saveSettings('change_color_donut', Number(check))
  }

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
      case 'resetStat':
        textSnack = "Вы успешно обнулили свою статистику";
        jsonData = {}
        method = "shop.resetStatistics&";
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
          if (type === 'resetId') setChangedId('');
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
      <Group>
        <SimpleCell
            disabled
            before={<Icon28UserStarBadgeOutline />}
            after={
              <Switch
                checked={hideDonut}
                onChange={(e) => hide_donut(e)} />
            }
          >
            Отметка возле имени
          </SimpleCell>
          <SimpleCell
            disabled
            before={<Icon28SparkleOutline />}
            after={
              <Switch
                checked={colorchangeDonut}
                onChange={(e) => needChangeColor(e)} />
            }
          >
            Цвет короткого имени
          </SimpleCell>
      </Group>
      <Group>
      
        <AvatarsBlock 
        header='Универсальные аватары'
        header_sub='800 баллов'
        avatar_list={avatars}
        reloadProfile={props.reloadProfile}
        />
        {account.donut &&
        <AvatarsBlock 
        header={<div style={{display: 'flex', alignItems: 'center'}}>
          Эксклюзивные аватары <Icon16StarCircleFillYellow style={{marginLeft: 5}} />
        </div>}
        header_sub='300 пончиков'
        avatar_list={donutAvatars}
        reloadProfile={props.reloadProfile}
        />}
        <AvatarsBlock 
        header='Дзеновские аватары'
        header_sub='800 баллов'
        avatar_list={zenAvatars}
        reloadProfile={props.reloadProfile}
        />
        {moderator_permission &&
        <AvatarsBlock 
        header='Служебные аватары'
        header_sub=''
        avatar_list={specialAvatars}
        reloadProfile={props.reloadProfile}
        />}
      </Group>
      <Group>
        <ShopCard
        header='Короткое имя'
        header_sub='1500 баллов'
        text_button={account.nickname && account.nickname === changed_id ? 'Удалить' : 'Сменить'}
        disabled={(!account.nickname || account.nickname === changed_id) && !( changed_id.trim().length > 0)}
        onClickButton={account.nickname && account.nickname === changed_id ? () => setPopout(<Alert
          actionsLayout='vertical'
          actions={[{
            title: 'Удалить',
            autoclose: true,
            mode: 'destructive',
            action: () => MarketManager('resetId'),
          }, {
            title: 'Отмена',
            autoclose: true,
            style: 'cancel'
          },]}
          onClose={() => setPopout(null)}
          header="Удаление короткого имени"
          text="После удаления, у других агентов появится возможность поставить это которое имя. А вы будете числиться под цифровым ID"
        />) : () => MarketManager('changeId')}>
          <FormLayout>
            <FormItem>
              <Input placeholder="Введите желаемое короткое имя"
                bottom='Макс. 10 символов'
                onChange={(e) => setChangedId(e.currentTarget.value)}
                value={changed_id}
                maxLength="10" />
            </FormItem>
          </FormLayout>
        </ShopCard>
      </Group>
      <Group>
        <ShopCard
        header='Сброс статистики'
        header_sub='1800 баллов'
        onClickButton={() => MarketManager('resetStat')}
        text_button='Аннулировать'>

        </ShopCard>
      </Group>
      </>   
  )
}

const AvatarsBlock = ({avatar_list, header, header_sub, ...props}) => {
  const { goDisconnect, setSnackbar } = useNavigation();
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const account = useSelector((state) => state.account.account);
  const [fetching, setFetching] = useState(false)
  const buyAvatar = () => {
    setFetching(true);
    fetch(API_URL + `method=shop.buyAvatar&` + window.location.search.replace('?', ''),
      {
        method: 'post',
        headers: { "Content-type": "application/json; charset=UTF-8" },
        body: JSON.stringify({
          'avatar_id': Number(avatar_list[selectedAvatar - 1].split('.')[0]),
        })
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
              Аватар успешно сменен
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
        setFetching(false);
      })
      .catch(goDisconnect)

  }
  return(
    <ShopCard
    header={header}
    header_sub={header_sub}
    text_button='Приобрести'
    onClickButton={buyAvatar}
    disabled={selectedAvatar === 0}
    fetching={fetching}
    >
      <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
        <div style={{ display: 'flex' }}>
        {avatar_list && avatar_list.map((ava, i) => (
          <HorizontalCell key={i} size='m'
          hasHover={false} hasActive={false}
          style={{display: 'flex', alignItems: 'center'}}
          // eslint-disable-next-line
          onClick={() => (account.avatar.id == avatar_list[i].split('.')[0]) ? setSnackbar(
            <Snackbar
              layout="vertical"
              onClose={() => setSnackbar(null)}
              before={<Icon20CancelCircleFillRed width={24} height={24} />}
            >
              Вы уже имеете данный аватар
              </Snackbar>) : (selectedAvatar === (i + 1)) ? setSelectedAvatar(0) : setSelectedAvatar(i + 1)}>
          <Avatar id={i} size={88} src={AVATARS_URL + ava}
          className={((i + 1) === selectedAvatar) ? 'select_avatar' : ''} />

        </HorizontalCell>
      
      ))}
      </div>
      </HorizontalScroll>
    </ShopCard>
  )
}

const ShopCard = ({header, header_sub, text_button, onClickButton, fetching, disabled, ...props}) => {
  return (
    <Group mode='plain'
    header={<Header subtitle={header_sub}
    aside={<Button
    loading={fetching}
    onClick={onClickButton}
    disabled={disabled}>
      {text_button}
    </Button>}>
      {header}
    </Header>}>
      {props.children}
    </Group>
  )
}