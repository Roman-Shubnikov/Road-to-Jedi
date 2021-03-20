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
    CellButton,
    Group,
    Text

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
                  right={platform === IOS && <Header onClick={this.props.onClose}><Icon24Dismiss /></Header>}
                  left={platform === ANDROID && <PanelHeaderButton onClick={this.props.onClose}><Icon24Dismiss /></PanelHeaderButton>}
                  >
                    Комментарий
                  </ModalPageHeader>
                }
                >
                  <Group>
                    <Div>
                      <Text style={{whiteSpace: "pre-wrap"}} weight='regular'>
                        <Anchorme onClick={(e) => {e.stopPropagation()}} target="_blank" rel="noreferrer noopener">
                    {this.props.comment.objComment.text}
                        </Anchorme>
                      </Text>
                    </Div>
                    
                    <CellButton size="m"
                    href="https://vk.me/club201542328"
                    target="_blank" rel="noreferrer noopener"
                    centered
                    >Комментарий вызвал вопрос?</CellButton>
                    <CellButton size="m"
                    mode='danger'
                    centered
                    onClick={() => {
                      this.props.onClose()
                      this.props.reporting(1, this.props.comment.message_id)
                    }}>Пожаловаться</CellButton>
                  </Group>
            </ModalPage>
        )
    }
})