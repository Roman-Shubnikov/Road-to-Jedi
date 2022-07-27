import React, {MouseEventHandler, ReactElement, ReactNode} from 'react';
import {Dropdown} from "@vkontakte/vkui/unstable";
import styles from './ticketOptions.module.css'
import {Div, Separator, SimpleCell} from "@vkontakte/vkui";
import clsx from 'clsx';
import {
    Icon20CheckCircleOutline,
    Icon20CommentOutline,
    Icon20CopyOutline,
    Icon20DeleteOutlineAndroid,
    Icon20ReportOutline,
    Icon20UserOutline
} from "@vkontakte/icons";

interface IOptionElement {
    children: string,
    before: ReactNode,
    onClick: MouseEventHandler<HTMLElement>,
}

const OptionElement = (props: IOptionElement) => {
    const {
        onClick,
        before,
        children,
    } = props;
    return(
        <SimpleCell
        onClick={onClick}
        className={clsx('gray', styles.ticketOption)}
        before={before}>
            {children}
        </SimpleCell>
    )
}


interface ITicketOptions {
    children: ReactElement,
}

export const TicketOptions = (props: ITicketOptions) => {
    const {
        children,
    } = props;
    return(
        <Dropdown
        content={
            <Div style={{padding: '5px 0'}}>
                <OptionElement
                before={<Icon20UserOutline />}
                onClick={() => {}}>
                    Профиль агента
                </OptionElement>
                <Separator />
                <OptionElement
                    before={<Icon20DeleteOutlineAndroid />}
                    onClick={() => {}}>
                    Удалить оценку
                </OptionElement>
                <OptionElement
                    before={<Icon20CheckCircleOutline />}
                    onClick={() => {}}>
                    Одобрить
                </OptionElement>
                <OptionElement
                    before={<Icon20CommentOutline />}
                    onClick={() => {}}>
                    Написать комментарий
                </OptionElement>
                <Separator />
                <OptionElement
                    before={<Icon20CopyOutline />}
                    onClick={() => {}}>
                    Скопировать текст
                </OptionElement>
                <OptionElement
                    before={<Icon20ReportOutline />}
                    onClick={() => {}}>
                    Пожаловаться
                </OptionElement>
            </Div>
        }>
            {children}
        </Dropdown>
    )
}