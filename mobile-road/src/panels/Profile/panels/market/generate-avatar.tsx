import React, { useEffect, useState } from 'react';
import { Button, Div, FixedLayout, SegmentedControl, Group, PanelSpinner } from '@vkontakte/vkui';
import { getMyColors, getMyIcons } from '../../../../backend';
import { Color } from '../../../../components/Colors';



export const AvatarGenerator = ({prices}: {prices: any}) => {
    const [myColors, setMyColors] = useState<null | { items: {color: string}[] }>(null);
    const [myIcons, setMyIcons] = useState(null);

    useEffect(() => {
        const fetchInfo = async () => {
            const icons = await getMyIcons();
            const colors = await getMyColors();
            setMyColors(colors);
            setMyIcons(icons);
        }
        fetchInfo()
    })

    return(
        <>
        <Group>
            <Div>
            <SegmentedControl
                options={[
                    {
                    'label': 'Иконки',
                    'value': 'icons',
                    'aria-label': 'Иконки',
                    },
                    {
                    'label': 'Цвета',
                    'value': 'colors',
                    'aria-label': 'Цвета',
                    },
                ]}
                />
            </Div>
            <Div>
                {myColors ? myColors.items.map((color:any) => <Color color={color.color} />) : <PanelSpinner />}
                <Color color='#5BF1FF' />
            </Div>
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