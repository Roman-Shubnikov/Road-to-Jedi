import React from 'react';
import { 
  Panel,
  PanelHeader,
  Avatar,
  Separator,
  PullToRefresh,
  SimpleCell,
  } from '@vkontakte/vkui';

import Icon16Fire from '@vkontakte/icons/dist/16/fire';
import Icon16Verified from '@vkontakte/icons/dist/16/verified';

    class Reader extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              api_url: "https://xelene.ru/road/php/index.php?",
              fetching: false,
              top_agents: null,
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
        }
        getTopUsers(){
          fetch(this.state.api_url + "method=users.getTop&" + window.location.search.replace('?', ''))
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.setState({top_agents: data.response})
              setTimeout(() => {
                this.setState({fetching: false});
              }, 500)
            }
          })
          .catch(err => {
            this.showErrorAlert(err)

          })
        }
        componentDidMount(){
          this.getTopUsers()
        }
        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader>
                Топ
                </PanelHeader>              
                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.getTopUsers()}} isFetching={this.state.fetching}>
                  {this.state.top_agents ? this.state.top_agents.map((result, i) => 
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
                    <div className="top_moderator_name_icon">
                      {result['flash'] === true ? <Icon16Fire width={12} height={12} onClick={() => this.setActiveModal('prom')} className="top_moderator_name_icon"/> : null}
                    </div>
                    <div className="top_moderator_name_icon_ver">
                      {result['verified'] === true ? <Icon16Verified className="top_moderator_name_icon_ver"/>  : null }
                    </div>
                  </div>
                  </SimpleCell>
                 <Separator/>
                 </React.Fragment>
                  ) : null}
                </PullToRefresh></>
            </Panel>
            )
            }
        }
  
export default Reader;