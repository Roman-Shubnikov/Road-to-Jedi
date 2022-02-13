import React, { useState } from 'react';

export const UserRequest = props => {
    return (
        <Panel id={props.id}>
            <PanelHeader
                separator={false}
                    left={
                    <><PanelHeaderBack onClick={() => window.history.back()} /> </>
                    }>
                    Заявка #
            </PanelHeader>

        </Panel>
    )
}