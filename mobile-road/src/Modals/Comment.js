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
            <ModalPage //this.props.this.setReport(3, message_id)
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
                    {/* <div style={{whiteSpace: "pre-wrap"}}> */}
                    <Div>
                      <Text weight='regular'>
                        <Anchorme target="_blank" rel="noreferrer noopener">
                          {this.props.comment.text}
                        </Anchorme>
                      </Text>
                    </Div>
                    
                    {/* </div> */}
                    <CellButton size="m"
                    mode='danger'
                    centered
                    onClick={() => {
                      this.props.onClose()
                      this.props.reporting(1, this.props.comment.message_id)
                    }}>Пожаловаться</CellButton>
                    {/* <Button size="m"
                    mode="secondary" 
                    style={{ marginLeft: 8 }}
                    onClick={() => {
                      this.deny(result.id)
                    }}>Отклонить</Button> */}
                  </Group>
                  <br/>
                  <br/>
                  <br/>
            </ModalPage>
        )
    }
})