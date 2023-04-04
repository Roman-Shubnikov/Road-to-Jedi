import React, { useEffect, useState } from 'react';
import { Button, Div, FixedLayout, SegmentedControl, Group, PanelSpinner } from '@vkontakte/vkui';
import { createCustomAvatar, getMyColors, getMyIcons } from '../../../../backend';
import { PurchasedColor } from '../../../../components/PurchasedColor';
import { PurchasedIcon } from '../../../../components/PurchasedIcon';
import { useSelector } from 'react-redux';
import style from './market.module.css';


enum AvatarGeneratorSections {
    ICONS,
    COLORS,
}
type ColorsData = { 
    items: {
        color: string}[] 
    }
type IconsData = { 
    url_to_icons: string,
    items: {
        id: number,
        icon_name: string,
        purchased_at: number,
    }[] }
type profileData = {account: { account: {avatar: { url: string }}}}
type avatarData = { bucket_path: string, path: string }

export const AvatarGenerator = ({prices}: {prices: any}) => {
    const account = useSelector((state: profileData) => state.account.account)
    const [myColors, setMyColors] = useState<null | ColorsData>(null);
    const [myIcons, setMyIcons] = useState<null | IconsData>(null);
    const [activeSection, setActiveSection] = useState<AvatarGeneratorSections>(AvatarGeneratorSections.ICONS);

    const [fetching, setFetching] = useState<boolean>(false);

    const [customColor, setCustomColor] = useState(null);
    const [customIconName, setCustomIconName] = useState(null);
    const [generatedAvatar, setGeneratedAvatar] = useState<null | avatarData>(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const icons = await getMyIcons();
            const colors = await getMyColors();
            setMyColors(colors);
            setMyIcons(icons);
            if (icons.items.length && colors.items.length) {
                setCustomColor(colors.items[0].color);
                setCustomIconName(icons.items[0].icon_name);
            }
            
        }
        fetchInfo()

    }, [])

    const generateAvatar = async () => {
        if(!customColor || !customIconName) return; 
        setFetching(true);
        createCustomAvatar(customColor, customIconName)
        .then((avatarData: avatarData) => {
            console.log(avatarData);
            setGeneratedAvatar(avatarData)
        })
        .finally(() => setFetching(false));
    }

    const getSection = () => {
        console.log('AvatarGenerator', activeSection)
        switch(activeSection) {
            case AvatarGeneratorSections.ICONS:
                return (
                    <Div className={style.container_items}>
                        {myIcons ? 
                        myIcons.items.map((icon) => 
                            <PurchasedIcon key={icon.id}
                            icon_url={myIcons.url_to_icons + '/' + icon.icon_name.split('.')[0] + '.svg'} />) 
                            : 
                            <PanelSpinner />}
                    </Div>
                )

            case AvatarGeneratorSections.COLORS:
                return (
                <Div className={style.container_items}>
                    {myColors ? 
                    myColors.items.map((color) => 
                        <PurchasedColor key={color.color} 
                        color={color.color} />) 
                        : 
                        <PanelSpinner />}
                </Div>
                )
        }
    } 

    return(
        <>
        <Group>
            {fetching && <PanelSpinner height={610} size='large' />}
            {!fetching && <Div>
                <img className={style.avatar} src={generatedAvatar ? generatedAvatar.bucket_path + '/' + generatedAvatar.path : account.avatar.url } />
            </Div>}
            
            <Div>
                <SegmentedControl
                onChange={(value) => setActiveSection(value as AvatarGeneratorSections)}
                options={[
                    {
                    'label': 'Иконки',
                    'value': AvatarGeneratorSections.ICONS,
                    'aria-label': 'Иконки',
                    },
                    {
                    'label': 'Цвета',
                    'value': AvatarGeneratorSections.COLORS,
                    'aria-label': 'Цвета',
                    },
                ]}
                />
            </Div>
            {getSection()}
            <div style={{marginBottom: 60}}></div>
        </Group>
        
        <FixedLayout vertical='bottom' filled>
            <Div>
                <Button stretched size='m'
                onClick={generateAvatar}>
                    Обновить аватар за 250 баллов
                </Button>
            </Div>
        </FixedLayout></>
    )
  }