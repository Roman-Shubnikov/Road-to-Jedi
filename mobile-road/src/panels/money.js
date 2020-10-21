import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Group from '@vkontakte/vkui/dist/components/Group/Group';
import Header from '@vkontakte/vkui/dist/components/Header/Header';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Input from '@vkontakte/vkui/dist/components/Input/Input';

import Icon24Repeat from '@vkontakte/icons/dist/24/repeat';
import Icon28MoneyCircleOutline from '@vkontakte/icons/dist/28/money_circle_outline';
import Icon28GlobeOutline from '@vkontakte/icons/dist/28/globe_outline';

import Icon28MoneyHistoryBackwardOutline from '@vkontakte/icons/dist/28/money_history_backward_outline';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon28GridSquareOutline from '@vkontakte/icons/dist/28/grid_square_outline';

var avatars = [
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

]

var last_selected = 0

function selectImage(e) {
    let number = e.currentTarget.id;
    let last_image = document.getElementById(last_selected)
    let image = document.getElementById(number);
    last_image.className = "changes_avatars"
    image.className = "changes_avatars select_avatar"
    last_selected = Number(number)
}

function images() {
    var number = Object.keys(avatars).length;
    var object = []
        for (let i = 0; i < number; i++ ) {
            object.push(
                <img id={i} onClick={(e) => selectImage(e)} style={i === 0 ? {marginLeft: "20px"} : null} className="changes_avatars" key={i} src={"https://xelene.ru/road/php/images/avatars/" + avatars[i]}/>
            )
        }
    
    return(object)
}

const Money = props => (
    <Panel id={props.id}>
        <PanelHeader 
            left={
                <PanelHeaderButton onClick={() => window.history.back()}> 
                    <Icon24BrowserBack/>
                </PanelHeaderButton>
        }>
            Магазин
        </PanelHeader>
        <Group separator="hide" header={<Header>Сменить аватар</Header>}>
                <div className="scrollImages">
                    {images()}
                </div>
                <Div>
                    <Button onClick={() => props.this.changeAvatar(last_selected + 1)} before={<Icon28MoneyCircleOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Сменить за 300 монеток</Button>
                </Div>
        </Group>
        <Group separator="hide" header={<Header>Сменить id агента</Header>}>
            <Div>
                <Input placeholder="Введите id" onChange={(e) => props.this.onChange(e)} value={props.this.state.changed_id} maxLength="5" name="changed_id"/>
                <br/>
                <Button onClick={() => props.this.ChangeId(last_selected + 1)} before={<Icon24Repeat width={28} height={28} style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Сменить за 500 монеток</Button>
            </Div>
        </Group>
        {/* <Group separator="hide" header={<Header>Сброс статистики</Header>}>
            <Div>
                <Button onClick={() => props.this.deleteStats()} before={<Icon28GridSquareOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Сбросить за 150 монеток</Button>
            </Div>
        </Group> */}
        <Group separator="hide" header={<Header>Опции</Header>}>
            <Div>
                <Button onClick={() => props.this.setActiveModal('send')} before={<Icon28MoneyHistoryBackwardOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Перевести</Button>
                {/* <br/>
                <Button onClick={() => props.this.goVitas()} before={<Icon28GlobeOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Обучать Витька</Button> */}
            </Div>
        </Group>
        {props.this.state.snackbar}
        {/* <Group separator="hide" header={<Header>Обнулить статистику</Header>}>
            <Div>
                Мы обнулим вам встатистику, число всех ответов станет равным 0.
            </Div>
        </Group>
        <Div>
            <Button before={<Icon28MoneyCircleOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Купить за 350 монеток</Button>
        </Div>
        <Group separator="hide" header={<Header>Сменить id Агента</Header>}>
            <Div>
                Установите себе другой id и будьте заметнее!
            </Div>
        </Group>
        <Div>
            <Button before={<Icon28MoneyCircleOutline style={{marginRight: "5px"}}/>} size="xl" mode="secondary">Купить за 700 монеток</Button>
        </Div> */}
    </Panel>
            
);

export default Money;