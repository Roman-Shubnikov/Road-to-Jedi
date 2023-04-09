import React, { useEffect, useState } from 'react';
import {
    Button,
    Div,
    FixedLayout,
    SegmentedControl,
    Group,
    PanelSpinner,
    Placeholder,
} from '@vkontakte/vkui';
import { PurchasedColor } from '../../../../components/PurchasedColor';
import { PurchasedIcon } from '../../../../components/PurchasedIcon';
import { useSelector } from 'react-redux';
import style from './avatar-generator.module.css';
import {
    Icon56LogoClipsOutline,
    Icon56LikeLockOutline,
} from '@vkontakte/icons';
import {
    createCustomAvatar,
    getMyColors,
    getMyIcons,
    installAvatar,
} from '../../../../backend/market';
import { useNavigation } from '../../../../hooks';

enum AvatarGeneratorSections {
    ICONS,
    COLORS,
}
type ColorsData = {
    items: {
        color: string;
    }[];
};
type IconsData = {
    url_to_icons: string;
    items: {
        id: number;
        icon_name: string;
        purchased_at: number;
    }[];
};
type profileData = { account: { account: { avatar: { id: number, url: string } } } };
type avatarData = { id: number, bucket_path: string; path: string; hash: string };

export const AvatarGenerator = ({ reloadProfile }: { reloadProfile: any }) => {
    const account = useSelector((state: profileData) => state.account.account);
    const [myColors, setMyColors] = useState<null | ColorsData>(null);
    const [myIcons, setMyIcons] = useState<null | IconsData>(null);
    const [activeSection, setActiveSection] = useState<AvatarGeneratorSections>(
        AvatarGeneratorSections.ICONS
    );

    const [fetching, setFetching] = useState<boolean>(false);

    const [customColor, setCustomColor] = useState<null | string>(null);
    const [customIconName, setCustomIconName] = useState<null | string>(null);
    const [generatedAvatar, setGeneratedAvatar] = useState<null | avatarData>(
        null
    );
    const [noItems, setNoItems] = useState<null | boolean>();
    const [installInProgress, setInstallInProgress] = useState<boolean>(false);

    const { setInfoSnackbar } = useNavigation();

    

    useEffect(() => {
        const fetchInfo = async () => {
            const icons = await getMyIcons();
            const colors = await getMyColors();
            setMyColors(colors);
            setMyIcons(icons);
            if (icons.items.length && colors.items.length) {
                setCustomColor(colors.items[0].color);
                setCustomIconName(icons.items[0].icon_name);
            } else {
                setNoItems(true);
            }
        };
        fetchInfo();
    }, []);

    const generateAvatar = async () => {
        if (!customColor || !customIconName) return;
        setFetching(true);
        createCustomAvatar(customColor, customIconName)
            .then((avatarData: avatarData) => {
                console.log(avatarData);
                setGeneratedAvatar(avatarData);
            })
            .finally(() => setFetching(false));
    };
    const installAvatarClick = () => {
        if (!generatedAvatar?.hash) return;
        setInstallInProgress(true);
        installAvatar(generatedAvatar.hash)
            .then(() => {
                setInfoSnackbar('Аватарка успешно установлена')
                reloadProfile()
            })
            .finally(() => setInstallInProgress(false));
    };

    useEffect(() => {
        generateAvatar();
        console.log('avatar gen');
    }, [customColor, customIconName]);

    const getSection = () => {
        switch (activeSection) {
            case AvatarGeneratorSections.ICONS:
                return (
                    <Div className={style.container_items}>
                        {myIcons ? (
                            myIcons.items.map((icon) => (
                                <PurchasedIcon
                                    key={icon.id}
                                    selected={icon.icon_name === customIconName}
                                    onClick={() =>
                                        setCustomIconName(icon.icon_name)
                                    }
                                    icon_url={
                                        myIcons.url_to_icons +
                                        '/' +
                                        icon.icon_name.split('.')[0] +
                                        '.svg'
                                    }
                                />
                            ))
                        ) : (
                            <PanelSpinner />
                        )}
                    </Div>
                );

            case AvatarGeneratorSections.COLORS:
                return (
                    <Div className={style.container_items}>
                        {myColors ? (
                            myColors.items.map((color) => (
                                <PurchasedColor
                                    key={color.color}
                                    selected={color.color === customColor}
                                    color={color.color}
                                    onClick={() => setCustomColor(color.color)}
                                />
                            ))
                        ) : (
                            <PanelSpinner />
                        )}
                    </Div>
                );
        }
    };
    const getError = () => {
        if (noItems)
            return (
                <Placeholder icon={<Icon56LikeLockOutline />} header="Ошибка">
                    Нужно купить хотя бы одну иконку и один цвет в разделе
                    товары
                </Placeholder>
            );
        if (customColor === null)
            return (
                <Placeholder
                    icon={<Icon56LogoClipsOutline />}
                    header="Подождите"
                >
                    Пока редактор загружается...
                </Placeholder>
            );

        return false;
    };

    return (
        <>
            <Group>
                {fetching && <PanelSpinner height={610} size="large" />}
                {!fetching && (
                    <Div className={style.avatar_container}>
                        <img
                            alt='userAvatar'
                            className={style.avatar}
                            src={
                                generatedAvatar
                                    ? generatedAvatar.bucket_path +
                                      '/' +
                                      generatedAvatar.path
                                    : account.avatar.url
                            }
                        />
                    </Div>
                )}
                {getError() ? (
                    getError()
                ) : (
                    <>
                        <Div>
                            <SegmentedControl
                                onChange={(value) =>
                                    setActiveSection(
                                        value as AvatarGeneratorSections
                                    )
                                }
                                options={[
                                    {
                                        label: 'Иконки',
                                        value: AvatarGeneratorSections.ICONS,
                                        'aria-label': 'Иконки',
                                    },
                                    {
                                        label: 'Цвета',
                                        value: AvatarGeneratorSections.COLORS,
                                        'aria-label': 'Цвета',
                                    },
                                ]}
                            />
                        </Div>
                        {getSection()}
                    </>
                )}

                <div style={{ marginBottom: 30 }}></div>
            </Group>

            <FixedLayout vertical="bottom" filled>
                <Div>
                    <Button
                        stretched
                        size="m"
                        disabled={
                            !!getError() || fetching || !generatedAvatar?.hash || generatedAvatar?.id === account.avatar.id
                        }
                        loading={installInProgress}
                        onClick={installAvatarClick}
                    >
                        Обновить аватар за 250 баллов
                    </Button>
                </Div>
            </FixedLayout>
        </>
    );
};
