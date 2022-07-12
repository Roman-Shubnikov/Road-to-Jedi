import React from 'react'; // React

import { 
    usePlatform,
    IOS,
    ANDROID,
    PanelHeaderButton,
    ModalPageHeader,
    Header,
} from "@vkontakte/vkui"
import { 
    Icon24Dismiss,

} from "@vkontakte/icons";

export default props => {
    const platform = usePlatform();
    return(
        <ModalPageHeader
            right={platform === IOS && <Header onClick={props.onClick}><Icon24Dismiss /></Header>}
            left={platform === ANDROID && <PanelHeaderButton onClick={props.onClick}><Icon24Dismiss /></PanelHeaderButton>}
          >
            {props.children}
        </ModalPageHeader>
    )
}