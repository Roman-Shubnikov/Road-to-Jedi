import React, { useCallback, useState } from 'react';
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
    PanelHeaderButton,
    Alert,
    FormLayout,
    CellButton,
    Group,
    HorizontalScroll,
    HorizontalCell,
    FormItem,
    Slider,
    } from '@vkontakte/vkui';


import {
  Icon28MoneyHistoryBackwardOutline,
  Icon16CheckCircle,
  Icon20CancelCircleFillRed,
  Icon28InfoCircleOutline,
  Icon24BlockOutline,
  Icon24Repeat,
  Icon28MoneyCircleOutline,
  Icon28GhostOutline,

} from '@vkontakte/icons';


import UserTopC from '../../../components/userTop';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../../../store/main';
import { API_URL, AVATARS_URL } from '../../../config';
import { enumerate } from '../../../Utils';


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
    "13.png",
    "14.png",
    "15.png",
    "16.png",
    "17.png",
    "18.png",
    "19.png",
    "20.png",
    "21.png",
    "22.png",
    "23.png",
    "24.png",
    "25.png",
    "26.png",
    "27.png",
    "28.png",
    "29.png",
    "30.png",
    "31.png",
    "32.png",
    "33.png",
    "34.png",
    "35.png",
    "36.png",
    "37.png",
    "38.png",
    "39.png",
    "40.png",
    "41.png",
    "42.png",
    
]


const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default props => {
  const dispatch = useDispatch();
  const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch]);
  const account = useSelector((state) => state.account.account);
  const { setPopout, setActiveModal, goPanel, setSnackbar } = props.callbacks;

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
      .catch(err => {
        console.log(err)
        setActiveStory('disconnect');
      })

  }
  return (
    <Panel id={props.id}>
      <PanelHeader
        left={
          <><PanelHeaderBack onClick={() => window.history.back()} />
            <PanelHeaderButton
              href='https://vk.com/@jedi_road-sistema-nachisleniya-ballov-i-shop'
              target="_blank" rel="noopener noreferrer">
              <Icon28InfoCircleOutline />
            </PanelHeaderButton> </>
        }>
        Магазин
                </PanelHeader>

      <Group>
        <Div>
          <Text weight='medium'>Монетки — это универсальная условная единица для приобретения различных товаров в магазине</Text>
        </Div>
        <SimpleCell disabled indicator={account.balance}>Ваш баланс</SimpleCell>
        <CellButton onClick={() => goPanel('promocodes')}>Активировать промокод</CellButton>
      </Group>

      {/* <Div>
                  <FormStatus >
                    Скидки для тестеровщиков
                  </FormStatus>
                </Div> */}
      <Group header={<Header>Сменить аватар</Header>}>
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
            disabled={selectedAvatar === 0}>Сменить за 700 монеток</Button>
        </Div>
      </Group>

      <Group header={<Header>Сменить свой ник</Header>}>
        <FormLayout>
          <FormItem>
            <Input placeholder="Введите желаемый ник"
              bottom='Макс. 10 символов'
              onChange={(e) => setChangedId(e.currentTarget.value)}
              value={changed_id}
              maxLength="10" />
          </FormItem>
          <FormItem>
            <div style={{ display: 'flex' }}>
              <Button onClick={() => { MarketManager('changeId') }}
                style={{ marginRight: 8 }}
                before={<Icon24Repeat width={28} height={28} />}
                stretched
                size="m"
                mode="secondary"
                disabled={!( changed_id.trim().length > 0)}>Сменить за 1500 монеток</Button>
              {account.nickname ? <Button
                stretched
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
                size="m"
                mode='destructive'>Удалить ник</Button> : null}
            </div>
          </FormItem>
        </FormLayout>

      </Group>

      {account ? !account.is_recommended ? <Group header={<Header>Попасть в рекомедации</Header>}>
        <Div>
          <Text weight='medium'>После приобретения этого товара, ваш профиль попадёт на вторую вкладку в "Обзор", так вы сможете привлечь больше подписчиков</Text>
        </Div>
        <Div>
          <Button onClick={() => MarketManager('recomend')}
            before={<Icon28MoneyCircleOutline />}
            size="l"
            stretched
            mode="secondary">Купить за 150 монеток</Button>
        </Div>
      </Group> : null : null}

      <Group header={<Header>Купить фантомов</Header>}>
          <Div>
            <Text weight='medium'>Здесь вы можете купить фантомов для повышения своего уровня</Text>
          </Div>
          <FormLayout>
            <FormItem top={`Укажите количество: ${fantom_count}`}>
              <Slider 
                value={Number(fantom_count)}
                onChange={e => setFantoms(e)}
                min={1}
                step={1}
                max={500} />
            </FormItem>
          </FormLayout>
          <SimpleCell
          expandable
          target="_blank" rel="noopener noreferrer" 
          href='https://vk.com/@jedi_road-ohota-na-fantomov-nevidimovichei'
          before={<Icon28GhostOutline />}>
            Подробнее о Фантомах
          </SimpleCell>
          <Div>
            <Button
              onClick={() => MarketManager('fantoms')}
              stretched
              before={<Icon28MoneyHistoryBackwardOutline />} size="l">Купить за {5 * fantom_count} монеток</Button>
          </Div>
        </Group>           

      {account ? !account.diamond ?
        <Group header={<Header>Купить алмаз</Header>}>
          <Div>
            <Text weight='medium'>После приобретения этого товара, около вашей аватарки начнёт светиться фиолетовый алмаз. Это выглядит примерно так:</Text>
          </Div>
          <UserTopC {...account}
            diamond />
          <Div>
            <Button
              onClick={() => MarketManager('diamond')}
              stretched
              before={<Icon28MoneyHistoryBackwardOutline />} size="l" mode='destructive'>Купить за 10 000 монеток</Button>
          </Div>
        </Group> : null : null}
      <Group header={<Header>Опции</Header>}>
        <Div>
          <Button
            onClick={() => setActiveModal('send')}
            before={<Icon28MoneyHistoryBackwardOutline />}
            size="l"
            mode="secondary"
            stretched>Перевести</Button>
        </Div>
      </Group>

      {props.snackbar}
    </Panel>
  )
}