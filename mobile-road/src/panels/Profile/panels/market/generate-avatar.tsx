import React, { useEffect, useState } from 'react';
import { Button, Div, FixedLayout, SegmentedControl, Group, PanelSpinner } from '@vkontakte/vkui';
import { getMyColors, getMyIcons } from '../../../../backend';
import { PurchasedColor } from '../../../../components/PurchasedColor';
import { PurchasedIcon } from '../../../../components/PurchasedIcon';


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


export const AvatarGenerator = ({prices}: {prices: any}) => {
    const [myColors, setMyColors] = useState<null | ColorsData>(null);
    const [myIcons, setMyIcons] = useState<null | IconsData>(null);
    const [activeSection, setActiveSection] = useState<AvatarGeneratorSections>(AvatarGeneratorSections.ICONS);

    useEffect(() => {
        const fetchInfo = async () => {
            const icons = await getMyIcons();
            const colors = await getMyColors();
            setMyColors(colors);
            setMyIcons(icons);
        }
        fetchInfo()
    })

    const getSection = () => {
        console.log('AvatarGenerator', activeSection)
        switch(activeSection) {
            case AvatarGeneratorSections.ICONS:
                return (
                    <Div>
                        {myIcons ? 
                        myIcons.items.map((icon) => 
                            <PurchasedIcon key={icon.id}
                            icon_url={myIcons.url_to_icons + '/svg/' + icon.icon_name.split('.')[0] + '.svg'} />) 
                            : 
                            <PanelSpinner />}
                    </Div>
                )

            case AvatarGeneratorSections.COLORS:
                return (
                <Div>
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
            
        </Group>
        <FixedLayout vertical='bottom' filled>
            <Div>
                <Button>
                    Обновить аватар за 250 баллов
                </Button>
            </Div>
        </FixedLayout></>
    )
  }