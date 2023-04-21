import React, { useState, useEffect } from 'react';

import {
    Input,
    Avatar,
    Button,
    Header,
    Snackbar,
    SimpleCell,
    Alert,
    FormLayout,
    Group,
    FormItem,
    Switch,
    ScreenSpinner,
    Gallery,
} from '@vkontakte/vkui';

import {
    Icon16CheckCircle,
    Icon20CancelCircleFillRed,
    Icon28UserStarBadgeOutline,
    Icon28SparkleOutline,
} from '@vkontakte/icons';
import { useSelector } from 'react-redux';
import { API_URL } from '../../../../config';
import style from './products.module.css';
import { useNavigation } from '../../../../hooks';
import {
    buyColor,
    buyIcon,
    getAvalibleColors,
    getAvalibleIcons,
    getMyColors,
    getMyIcons,
} from '../../../../backend/market';
import { PurchasedColor } from '../../../../components/PurchasedColor';
import { chunkArray } from '../../../../Utils';
import { PurchasedIcon } from '../../../../components/PurchasedIcon';

const blueBackground = {
    backgroundColor: 'var(--accent)',
};

export const Products = (props) => {
    const account = useSelector((state) => state.account.account);
    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const [hideDonut, setHidedonut] = useState(
        () => !account.settings.hide_donut
    );
    const [colorchangeDonut, setColorchangeDonut] = useState(
        () => account.settings.change_color_donut
    );
    const { goDisconnect, showErrorAlert, setPopout, setSnackbar, setInfoSnackbar } =
        useNavigation();
    const [changed_id, setChangedId] = useState(
        account.nickname ? account.nickname : ''
    );
    const [avalibleColors, setAvalibleColors] = useState(null);
    const [avalibleIcons, setAvalibleIcons] = useState(null);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [storageData, setStorageData] = useState(null);

    const saveSettings = (setting, value) => {
        setPopout(<ScreenSpinner />);
        fetch(
            API_URL +
                'method=settings.set&' +
                window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    setting: setting,
                    value: value,
                }),
            }
        )
            .then((data) => data.json())
            .then((data) => {
                if (data.result) {
                    setPopout(null);
                    setTimeout(() => {
                        props.reloadProfile();
                    }, 4000);
                } else {
                    showErrorAlert(data.error.message);
                }
            })
            .catch(goDisconnect);
    };

    const hide_donut = (check) => {
        check = check.currentTarget.checked;
        setHidedonut(check);
        saveSettings('hide_donut', Number(!check));
    };
    const needChangeColor = (check) => {
        check = check.currentTarget.checked;
        setColorchangeDonut(check);
        saveSettings('change_color_donut', Number(check));
    };

    const MarketManager = (type) => {
        let method, jsonData, textSnack;
        switch (type) {
            case 'avatar':
                textSnack = 'Аватар успешно сменен';
                method = 'shop.changeAvatar&';
                jsonData = {
                    avatar_id: Number(selectedAvatar),
                };
                break;
            case 'changeId':
                textSnack = 'Вы успешно сменили ник';
                jsonData = {
                    change_id: changed_id.trim(),
                };
                method = 'shop.changeId&';
                break;
            case 'resetId':
                textSnack = 'Вы успешно удалили ник';
                jsonData = {};
                method = 'shop.resetId&';
                break;
            case 'recomend':
                textSnack = 'Вы успешно попали в рекомендации';
                jsonData = {};
                method = 'shop.buyRecommendations&';
                break;
            case 'resetStat':
                textSnack = 'Вы успешно обнулили свою статистику';
                jsonData = {};
                method = 'shop.resetStatistics&';
                break;
            default:
                method = 'shop.changeAvatar&';
        }

        fetch(
            API_URL +
                `method=${method}` +
                window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { 'Content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(jsonData),
            }
        )
            .then((data) => data.json())
            .then((data) => {
                setSelectedAvatar(0);
                if (data.result) {
                    setSnackbar(
                        <Snackbar
                            layout="vertical"
                            onClose={() => setSnackbar(null)}
                            before={
                                <Avatar size={24} style={blueBackground}>
                                    <Icon16CheckCircle
                                        fill="#fff"
                                        width={14}
                                        height={14}
                                    />
                                </Avatar>
                            }
                        >
                            {textSnack}
                        </Snackbar>
                    );
                    if (type === 'resetId') setChangedId('');
                    setTimeout(() => {
                        props.reloadProfile();
                    }, 2000);
                } else {
                    setSnackbar(
                        <Snackbar
                            layout="vertical"
                            onClose={() => setSnackbar(null)}
                            before={
                                <Icon20CancelCircleFillRed
                                    width={24}
                                    height={24}
                                />
                            }
                        >
                            {data.error.message}
                        </Snackbar>
                    );
                }
            })
            .catch(goDisconnect);
    };

    useEffect(() => {
        if(selectedIcon) return;
        getAvalibleIcons().then((icons) => {
            getMyIcons().then((myIcons) => {
                let myIconsItems = myIcons.items.map(v => v.icon_name)
                let avalibleBuyIcons = icons.filter(
                    (v) => !myIconsItems.includes(v)
                );
                setStorageData(myIcons);
                setAvalibleIcons(avalibleBuyIcons);
            });
        });
    }, [selectedIcon]);
    useEffect(() => {
        if(selectedColor) return;
        getAvalibleColors().then((colors) => {
            getMyColors().then((myColors) => {
                let myColorsItems = myColors.items.map(colorData => colorData.color)
                let avalibleBuyColors = colors.map(v => v.color).filter(
                    (v) => !myColorsItems.includes(v)
                );
                setAvalibleColors(avalibleBuyColors);
            });
        });
    }, [selectedColor])

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
                            onChange={(e) => hide_donut(e)}
                        />
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
                            onChange={(e) => needChangeColor(e)}
                        />
                    }
                >
                    Цвет короткого имени
                </SimpleCell>
            </Group>
            <Group>
                <ShopCard
                    header="Цветовая палитра"
                    header_sub="800 баллов"
                    text_button="Приобрести"
                    disabled={!selectedColor}
                    onClickButton={() => {
                        buyColor(selectedColor)
                        .then(() => {
                            setInfoSnackbar('Цвет успешно приобретен')
                            setSelectedColor(null)
                        })
                    }}
                >
                    <GalleryItems>
                        {avalibleColors && chunkArray(avalibleColors, 28).map((chunkColors, i) => 
                        <GalleryCard key={i}>
                            {chunkColors.map((color, i) => (
                                <PurchasedColor
                                    key={i}
                                    color={color}
                                    onClick={() => setSelectedColor(color)}
                                    selected={selectedColor === color}
                                />
                            ))}
                        </GalleryCard>)}
                    </GalleryItems>
                </ShopCard>
            </Group>
            <Group>
                <ShopCard
                    header="Иконка аватара"
                    header_sub="1200 баллов"
                    text_button="Приобрести"
                    disabled={!selectedIcon}
                    onClickButton={() => {
                        buyIcon(selectedIcon)
                        .then(() => {
                            setInfoSnackbar('Иконка успешно приобретена')
                            setSelectedIcon(null)
                        })
                    }}
                >
                    <GalleryItems>
                        {avalibleIcons && chunkArray(avalibleIcons, 27).map((chunkIcons, i) => 
                        <GalleryCard key={i}>
                            {chunkIcons.map((icon, i) => (
                                <PurchasedIcon
                                    key={i}
                                    icon_url={storageData.url_to_icons + '/' + icon.split('.')[0]+'.svg'}
                                    onClick={() => setSelectedIcon(icon)}
                                    selected={selectedIcon === icon}
                                />
                            ))}
                        </GalleryCard>)}
                    </GalleryItems>
                </ShopCard>
            </Group>
            <Group>
                <ShopCard
                    header="Короткое имя"
                    header_sub="1500 баллов"
                    text_button={
                        account.nickname && account.nickname === changed_id
                            ? 'Деактивировать'
                            : 'Сменить'
                    }
                    disabled={
                        (!account.nickname ||
                            account.nickname === changed_id) &&
                        !(changed_id.trim().length > 0)
                    }
                    onClickButton={
                        account.nickname && account.nickname === changed_id
                            ? () =>
                                  setPopout(
                                      <Alert
                                          actionsLayout="vertical"
                                          actions={[
                                              {
                                                  title: 'Удалить',
                                                  autoclose: true,
                                                  mode: 'destructive',
                                                  action: () =>
                                                      MarketManager('resetId'),
                                              },
                                              {
                                                  title: 'Отмена',
                                                  autoclose: true,
                                                  style: 'cancel',
                                              },
                                          ]}
                                          onClose={() => setPopout(null)}
                                          header="Удаление короткого имени"
                                          text="После удаления, у других агентов появится возможность поставить это которое имя. А вы будете числиться под цифровым ID"
                                      />
                                  )
                            : () => MarketManager('changeId')
                    }
                >
                    <FormLayout>
                        <FormItem>
                            <Input
                                placeholder="Введите желаемое короткое имя"
                                bottom="Макс. 10 символов"
                                onChange={(e) =>
                                    setChangedId(e.currentTarget.value)
                                }
                                value={changed_id}
                                maxLength="10"
                            />
                        </FormItem>
                    </FormLayout>
                </ShopCard>
            </Group>
            <Group>
                <ShopCard
                    header="Сброс статистики"
                    header_sub="1800 баллов"
                    onClickButton={() => MarketManager('resetStat')}
                    text_button="Аннулировать"
                ></ShopCard>
            </Group>
        </>
    );
};

const GalleryCard = ({children}) => {
    return <div className={style.gallery_card_root}>
        {children}
    </div>;
};

const GalleryItems = ({children}) => {
    return <Gallery showArrows bullets='light'>{children}</Gallery>;
};

const ShopCard = ({
    header,
    header_sub,
    text_button,
    onClickButton,
    fetching,
    disabled,
    ...props
}) => {
    return (
        <Group
            mode="plain"
            header={
                <Header
                    subtitle={header_sub}
                    aside={
                        <Button
                            loading={fetching}
                            onClick={onClickButton}
                            disabled={disabled}
                        >
                            {text_button}
                        </Button>
                    }
                >
                    {header}
                </Header>
            }
        >
            {props.children}
        </Group>
    );
};
