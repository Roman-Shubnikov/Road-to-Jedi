import React from 'react'; // React

import { 
    usePlatform,
    Platform,
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
            after={platform === Platform.IOS && <Header onClick={props.onClick}><Icon24Dismiss /></Header>}
            before={platform === Platform.ANDROID && <PanelHeaderButton onClick={props.onClick}><Icon24Dismiss /></PanelHeaderButton>}
          >
            {props.children}
        </ModalPageHeader>
    )
}