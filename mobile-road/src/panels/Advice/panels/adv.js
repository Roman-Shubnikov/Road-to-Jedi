import React from 'react';

import { 
    Panel,
    PanelHeader,
    Placeholder,
    Group,
    RichCell,
    Avatar,
    PanelSpinner,
    Separator,
    UsersStack,
    Header,

    } from '@vkontakte/vkui';

import {
    Icon56Stars3Outline,
    Icon16StarCircleFillYellow,
    Icon16Verified,
    Icon16Fire,
    Icon24LifebuoyOutline,
    Icon36Users3Outline,
    Icon28UserStarBadgeOutline,
    Icon28BrainOutline,


} from '@vkontakte/icons';

import Tiles from '../../../components/menutiles';

function recog_number(num){
    let out = ""
    if (num > 999999) {
      out = Math.floor(num / 1000000 * 10) / 10 + "M"
    } else if (num > 999) {
      out = Math.floor(num / 1000 * 10) / 10 + "K"
    } else {
      out = num
    }
    return out;
  };
function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }

export default class Advice extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                fetching:false,
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
        }
        Prepare_recomendations() {
            this.props.this.getRecomendations()
            setTimeout(() => {
              this.setState({fetching: false});
            }, 500)
          }
        componentDidMount(){
        }
        componentWillUnmount(){
        }
        render() {
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                >
                Обзор
                </PanelHeader>
                <Group>
                  <div style={{display: 'flex', justifyContent: 'space-around'}}>
                    <a
                    href='https://vk.me/special_help'
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: 'inherit'}}>
                      <Tiles
                        icon={<Icon24LifebuoyOutline width={36} height={36} style={{color: '#4BB34B'}} />}>
                          Поддержка
                      </Tiles>
                    </a>
                    <a
                    href='https://vk.com/jedi_road'
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{color: 'inherit'}}>
                      <Tiles
                        icon={<Icon36Users3Outline width={36} height={36} style={{color: '#63B9BA'}} />}>
                          Сообщество
                      </Tiles>
                    </a>
                    <Tiles
                    onClick={() => this.props.this.goPanel(this.props.account.donut ? 'premium' : 'donuts')}
                    icon={<Icon28UserStarBadgeOutline width={36} height={36} style={{color: '#792EC0'}} />}>
                      Premium
                    </Tiles>
                    
                    
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-around', marginTop: 10}}>
                    {this.props.account['generator'] && <><Tiles
                      onClick={() => this.props.this.goPanel('new_ticket')}
                      icon={<Icon28BrainOutline width={36} height={36} style={{color: '#FFA000'}} />}>
                        Генератор
                      </Tiles>
                      <div style={{visibility: 'hidden'}}>
                      <Tiles
                        icon={<Icon24LifebuoyOutline width={36} height={36} style={{color: '#4BB34B'}} />}>
                          Поддержка
                      </Tiles>
                      </div>
                      <div style={{visibility: 'hidden'}}>
                      <Tiles
                        icon={<Icon24LifebuoyOutline width={36} height={36} style={{color: '#4BB34B'}} />}>
                          Поддержка
                      </Tiles>
                      </div>
                      </>}
                      
                  </div>
                  
                </Group>
                {/* <Group>
                    <PullToRefresh onRefresh={() => {this.setState({ fetching: true });this.Prepare_recomendations()}} isFetching={this.state.fetching}>
                        {this.props.recomndations ? (this.props.recomndations.length>0) ? this.props.recomndations.map((result, i) => 
                        <React.Fragment key={result.id}>
                            {(i === 0) || <Separator/>}
                            <RichCell
                                before={<Avatar size={56} src={result.avatar.url} />}
                                bottom={result.followers[2] &&
                                        <UsersStack
                                        photos={
                                            result.followers[2].map((user, i) => 
                                            "https://xelene.ru/road/php/images/avatars/" + user.avatar_name) 
                                        }>
                                            {result.followers[0] !== 0 ? 
                                            recog_number(result.followers[0]) + " " + enumerate(result.followers[0], ['подписчик', 'подписчика', 'подписчиков']) 
                                            : 'нет подписчиков'}
                                        </UsersStack>
                                }
                                onClick={() => this.props.this.goOtherProfile(result.id, true)}>
                                    <div style={{display: 'flex', }}>
                                    {result.nickname ? result.nickname : `Агент Поддержки #${result.id}`}
                                      <div className="top_moderator_name_icon">
                                        {result.flash ? 
                                        <Icon16Fire width={12} height={12} className="top_moderator_name_icon"/> : null}
                                      </div>
                                      <div className="top_moderator_name_icon">
                                        {result.donut ? 
                                        <Icon16StarCircleFillYellow width={12} height={12} className="top_moderator_name_icon" /> : null}
                                      </div>
                                      <div className="top_moderator_name_icon_ver">
                                        {result.verified ? 
                                        <Icon16Verified className="top_moderator_name_icon_ver"/>  : null }
                                      </div>
                                    </div>
                                </RichCell>
                            </React.Fragment>)
                        :
                        <Placeholder 
                            icon={<Icon56Stars3Outline />}>
                          Рекомендации пусты. Как только тут кто-то появится — обязательно подпишитесь на агента.
                      </Placeholder>
                      :
                      <PanelSpinner />
                        }
                    {this.props.recomndations_helper ? this.props.recomndations_helper.length === 20 ? 
                    <PanelSpinner />
                    : this.props.recomndations ?
                    (this.props.recomndations.length === 0) ? 
                    null : 
                    <Footer>{this.props.recomndations.length} {enumerate(this.props.recomndations.length, [' агент', ' агента', ' агентов'])} всего</Footer>
                    : null :
                    null}
                    </PullToRefresh>
                    
                </Group> */}
                <Group header={<Header>Рекомендации</Header>}>
                  {this.props.recomndations ? (this.props.recomndations.length>0) ? this.props.recomndations.map((result, i) => 
                  <React.Fragment key={result.id}>
                      {(i === 0) || <Separator/>}
                      <RichCell
                        before={<Avatar size={56} src={result.avatar.url} />}
                        bottom={result.followers[2] &&
                                <UsersStack
                                photos={
                                    result.followers[2].map((user, i) => 
                                    "https://xelene.ru/road/php/images/avatars/" + user.avatar_name) 
                                }>
                                    {result.followers[0] !== 0 ? 
                                    recog_number(result.followers[0]) + " " + enumerate(result.followers[0], ['подписчик', 'подписчика', 'подписчиков']) 
                                    : 'нет подписчиков'}
                                </UsersStack>
                        }
                        onClick={() => this.props.this.goOtherProfile(result.id, true)}>
                            <div style={{display: 'flex', }}>
                            {result.nickname ? result.nickname : `Агент Поддержки #${result.id}`}
                              <div className="top_moderator_name_icon">
                                {result.flash ? 
                                <Icon16Fire width={12} height={12} className="top_moderator_name_icon"/> : null}
                              </div>
                              <div className="top_moderator_name_icon">
                                {result.donut ? 
                                <Icon16StarCircleFillYellow width={12} height={12} className="top_moderator_name_icon" /> : null}
                              </div>
                              <div className="top_moderator_name_icon_ver">
                                {result.verified ? 
                                <Icon16Verified className="top_moderator_name_icon_ver"/>  : null }
                              </div>
                            </div>
                        </RichCell>
                  </React.Fragment>
                  )
                  :
                  <Placeholder 
                  icon={<Icon56Stars3Outline />}>
                      Рекомендации пусты. Как только тут кто-то появится — обязательно подпишитесь на агента.
                  </Placeholder>
                  :
                  <PanelSpinner />}
                </Group>
            </Panel>
            )
            }
        }
  