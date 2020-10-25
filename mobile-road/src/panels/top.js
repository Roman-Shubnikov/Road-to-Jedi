import React from 'react';
import { 
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Button,
  Group,
  Alert,
  Avatar,
  Placeholder,
  Separator,
  PullToRefresh,
  PanelSpinner,
  InfoRow,
  Header,
  Counter,
  SimpleCell,
  PromoBanner,
  FixedLayout,
  Cell,
  Div,
  HorizontalScroll,
  View,
  Switch,
  ScreenSpinner,
  } from '@vkontakte/vkui';

import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon16Done from '@vkontakte/icons/dist/16/done';

    class Reader extends React.Component {
        constructor(props) {
            super(props);
            this.state = {

            }
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader>
                Топ
                </PanelHeader>              
                <><PullToRefresh onRefresh={() => {props.setState({fetching: true});props.getTopUsers()}} isFetching={props.state.fetching}>
                  {props.state.top_agents.map((result, i) => 
                    result['banned'] ? null :
                    <React.Fragment key={result.id}>
                    <SimpleCell
                      onClick={() => props.goOtherProfile(result['id'], true)}
                      description={
                        <div className="top_moderator_desc">
                        {result['good_answers'] +  " хороших ответов, " + result['bad_answers'] + " плохих ответов"}
                        </div>
                      }
                      size="l"
                      before={<Avatar src={result['avatar']['url']}/>}
                    >
                  <div className="top_moderator_name">
                  {isFinite(result['nickname']) ? `Агент Поддержки #${result['nickname']}` : result['nickname'] ? result['nickname'] : `Агент Поддержки #${result['id']}`}
                    <div className="top_moderator_name_icon">{result['flash'] === true ? <Icon12Fire onClick={() => props.setActiveModal('prom')} className="top_moderator_name_icon"/> : null}{result['verified'] === true ? <Icon16Done width={12} height={12} className="top_moderator_name_icon_ver"/>  : null }</div>
                  </div>
                  </SimpleCell>
                 <Separator/>
                 </React.Fragment>
                  )}
                </PullToRefresh></>
            </Panel>
            )
            }
        }
  
export default Reader;