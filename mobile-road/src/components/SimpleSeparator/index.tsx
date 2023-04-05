import React from 'react';
import { Separator, Spacing } from '@vkontakte/vkui'

export const SimpleSeparator = ({wide=false}: {wide?: boolean}) => {
    return (
        <>
        <Spacing />
        <Separator wide={wide} />
        <Spacing />
        </>
    )
}