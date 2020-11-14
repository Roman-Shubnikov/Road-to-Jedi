import React from 'react';
import { 
    ModalPage,
    ModalPageHeader,
    PanelHeaderButton,
    Header,
    Div,
    IOS,
    ANDROID,
    withPlatform,

  } from '@vkontakte/vkui';

import { Anchorme } from 'react-anchorme'

import Icon24Dismiss              from '@vkontakte/icons/dist/24/dismiss';


export default withPlatform(class Donut extends React.Component {
    render() { 
      const { platform } = this.props;
        return (
            <ModalPage
                id={this.props.id}
                onClose={this.props.onClose}
                header={
                  <ModalPageHeader
                  right={platform === ANDROID && <Header onClick={this.props.onClose}><Icon24Dismiss /></Header>}
                  left={platform === IOS && <PanelHeaderButton onClick={this.props.onClose}><Icon24Dismiss /></PanelHeaderButton>}
                  >
                    Комментарий
                  </ModalPageHeader>
                }
                >
                  <Div>
                    <div style={{whiteSpace: "pre-wrap"}}><Anchorme target="_blank" rel="noreferrer noopener">{this.props.comment}</Anchorme></div>
                  </Div>
            </ModalPage>
        )
    }
})