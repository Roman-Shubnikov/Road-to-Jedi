import React from 'react';
import { 
    Tooltip,
    } from '@vkontakte/vkui';
import { LinkHandler } from '../Utils';


const LINKS = {
    flash: 'https://vk.com/@jedi_road-authors',
    verif: 'https://vk.com/@jedi_road-verification',
    donut: 'https://vk.com/@jedi_road-vk-donut-for-road-to-jedi',

}

export const FlashVerifTooltip = props => (
    <Tooltip
    isShown={props.isShown}
    onClose={props.onClose}
    offsetX={props.offsetX}
    header={<span>
        <LinkHandler href={LINKS.verif}>
        Верифицированный
        </LinkHandler> <LinkHandler href={LINKS.flash}>
            огненный
        </LinkHandler> агент</span>}
    text="Агент поддержки писал оригинальные ответы на протяжении длительного времени."
    mode='light'
    >
        {props.children}
    </Tooltip>
)
export const VerifTooltip = props => (
    <Tooltip
    isShown={props.isShown}
    onClose={props.onClose}
    offsetX={props.offsetX}
    header={<span>
        <LinkHandler href={LINKS.verif}>
        Верифицированный
        </LinkHandler> профиль</span>}
    text="Данный агент был верифицирован администрацией проекта."
    mode='light'
    >
        {props.children}
    </Tooltip>
)
export const DonutTooltip = props => (
    <Tooltip
    isShown={props.isShown}
    offsetX={props.offsetX}
    onClose={props.onClose}
    header={<span>Миром правят <LinkHandler href={LINKS.donut}>
        пончики
        </LinkHandler></span>}
    text="Агент поддерживает официальное сообщество платной подпиской."
    mode='light'
    >
        {props.children}
    </Tooltip>
)
export const FlashTooltip = props => (
    <Tooltip
    isShown={props.isShown}
    onClose={props.onClose}
    offsetX={props.offsetX}
    header={<span>
        <LinkHandler href={LINKS.flash}>
            Огненный
        </LinkHandler> агент</span>}
    text="Агент поддержки писал оригинальные ответы на протяжении длительного времени. "
    mode='light'
    >
        {props.children}
    </Tooltip>
)