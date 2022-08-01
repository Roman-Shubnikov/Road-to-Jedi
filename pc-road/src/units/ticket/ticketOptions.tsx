import React, {memo, MouseEventHandler, ReactElement, ReactNode} from 'react';
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
    onClickProfile: VoidFunction,
    onClickRemove: VoidFunction,
    onClickMark: (mark:number) => void,
    onClickWriteComment: VoidFunction,
    onClickCopyText: VoidFunction,
    children: ReactElement,
    adminButtons: boolean,
}

export const TicketOptions = memo((props: ITicketOptions) => {
    const {
        onClickProfile,
        onClickRemove,
        onClickMark,
        onClickWriteComment,
        onClickCopyText,
        children,
        adminButtons = false,
    } = props;
    return(
        <Dropdown
        content={
            <Div style={{padding: '5px 0'}}>
                <OptionElement
                before={<Icon20UserOutline />}
                onClick={onClickProfile}>
                    Профиль агента
                </OptionElement>
                <OptionElement
                    before={<Icon20DeleteOutlineAndroid />}
                    onClick={onClickRemove}>
                    Удалить сообщение
                </OptionElement>
                <Separator />
                {adminButtons && <>
                <OptionElement
                    before={<Icon20DeleteOutlineAndroid />}
                    onClick={() => onClickMark(-1)}>
                    Удалить оценку
                </OptionElement>
                <OptionElement
                    before={<Icon20CheckCircleOutline />}
                    onClick={() => onClickMark(1)}>
                    Одобрить
                </OptionElement>
                <OptionElement
                    before={<Icon20CheckCircleOutline />}
                    onClick={() => onClickMark(0)}>
                    Оценить отрицательно
                </OptionElement>
                <OptionElement
                    before={<Icon20CommentOutline />}
                    onClick={onClickWriteComment}>
                    Написать комментарий
                </OptionElement>
                <Separator />
                </>}
                <OptionElement
                    before={<Icon20CopyOutline />}
                    onClick={onClickCopyText}>
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
})