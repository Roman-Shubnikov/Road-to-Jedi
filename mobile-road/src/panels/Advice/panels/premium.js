import React from 'react';

import { 
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Placeholder,
    SimpleCell,
    HorizontalCell,
    HorizontalScroll,
    Avatar,
    Button,
    Div,
    Header,
    Snackbar,



 } from '@vkontakte/vkui';

import {
    Icon48DonateOutline,
    Icon28UserStarBadgeOutline,
    Icon16CheckCircle,
    Icon20CancelCircleFillRed,


} from '@vkontakte/icons';

import Don from '../images/donut.svg';
const donutAvatars = [
  "1001.png",
  "1002.png",
  "1003.png",
  "1004.png",
  "1005.png",
  "1006.png",
  "1007.png",
  "1008.png",
  "1009.png",
  "1010.png",

]
const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default class Donuts extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            snackbar: null,
            selectedAvatar: 0,

        }
        this.changeAvatar = this.changeAvatar.bind(this)
        this.setSnack = (value) => {
            this.setState({ snackbar: value })
          }
        this.selectImage = (number) => {
            this.setState({selectedAvatar:number});
          }
        
    }

    changeAvatar(){
        console.log(this.state.selectedAvatar)
        fetch(this.state.api_url + "method=shop.changeDonutAvatars&" + window.location.search.replace('?', ''),
        {method: 'post',
        headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
        body: JSON.stringify({
            'avatar_id': Number(this.state.selectedAvatar),
        })
        })
        .then(data => data.json())
        .then(data => {
          this.setState({selectedAvatar: 0})
          if(data.result){
              this.setSnack( 
                <Snackbar
                  layout="vertical"
                  onClose={() => this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  Аватар успешно сменен
                </Snackbar>
              )

              setTimeout(() => {
                this.props.this.ReloadProfile();
              }, 4000)
            }else{
              this.setSnack(
                <Snackbar
                layout="vertical"
                onClose={() => this.setSnack(null)}
                before={<Icon20CancelCircleFillRed width={24} height={24} />}
              >
                {data.error.message}
              </Snackbar>);
            }
        })
        .catch(err => {
          this.props.this.changeData('activeStory', 'disconnect')
      })
    }
    render(){
        return (
            <Panel id={this.props.id}>
                <PanelHeader
                left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                    Premium
                </PanelHeader>
                <Group>
                    <Placeholder 
                    icon={<img src={Don} alt='jedi' />}>
                    </Placeholder>
                    <SimpleCell disabled indicator={this.props.account.donuts}>Пончики</SimpleCell>
                </Group>
                <Group>
                    {this.props.account.donut_chat_link && <SimpleCell
                        expandable
                        href={this.props.account.donut_chat_link}
                        target="_blank" rel="noopener noreferrer"
                        before={<Icon48DonateOutline width={28} height={28} />}>
                            Чат для донов
                    </SimpleCell>}
                    <SimpleCell
                    href="https://vk.com/@jedi_road-unikalnyi-kontent-vk-donut"
                    target="_blank" rel="noopener noreferrer"
                    before={<Icon28UserStarBadgeOutline/>}>
                        Уникальный контент VK Donut
                    </SimpleCell>

                </Group>
                <Group header={<Header>Эксклюзивные аватарки</Header>}>
                    
                  <HorizontalScroll showArrows getScrollToLeft={(i) => i - 190} getScrollToRight={(i) => i + 190}>
                  <div style={{ display: 'flex' }}>
                    {donutAvatars.map((ava, i) => 
                    <HorizontalCell key={i} size='m' 
                    className={((i + 1 ) === this.state.selectedAvatar) ? 'select_avatar' : ''}
                    onClick={(e) => (this.props.account.avatar.id === i +1+1000) ? this.setSnack(
                      <Snackbar
                      layout="vertical"
                      onClose={() => this.setSnack(null)}
                      before={<Icon20CancelCircleFillRed width={24} height={24} />}
                    >
                      Вы уже имеете данный аватар
                    </Snackbar>) : (this.state.selectedAvatar === (i + 1) ) ? this.selectImage(0) : this.selectImage(i + 1)}>
                        <Avatar id={i} size={88} src={"https://xelene.ru/road/php/images/avatars/" + ava}/>
                      
                    </HorizontalCell>)}
                  </div>
                  </HorizontalScroll>
                  <Div>
                      <Button onClick={this.changeAvatar} 
                      before={<Icon48DonateOutline width={28} height={28}/>} 
                      size="l" 
                      stretched
                      mode="secondary"
                      disabled={this.state.selectedAvatar === 0}>Сменить за 50 пончиков</Button>
                  </Div>
                </Group>
                {this.state.snackbar}
            </Panel>
        )
    }
}