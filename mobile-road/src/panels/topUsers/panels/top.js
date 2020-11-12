import React from 'react';
import { 
  Panel,
  PanelHeader,
  Div,
  Avatar,
  Separator,
  PullToRefresh,
  SimpleCell,
  PanelSpinner,
  FormStatus,
  ScreenSpinner,

  } from '@vkontakte/vkui';

import Icon16Fire from '@vkontakte/icons/dist/16/fire';
import Icon16Verified from '@vkontakte/icons/dist/16/verified';
import Icon16StarCircleFillYellow from '@vkontakte/icons/dist/16/star_circle_fill_yellow';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';


// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


    class Reader extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              api_url: "https://xelene.ru/road/php/index.php?",
              fetching: false,
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
        }
        Prepare_top(needPopout=false) {
          if(needPopout){
            this.setPopout(<ScreenSpinner />)
          }
          this.props.this.getTopUsers()
          setTimeout(() => {
            this.setState({fetching: false});
            if(needPopout){
              this.setPopout(null)
          }
          }, 500)
        }
        componentDidMount(){
          // this.Prepare_top()
        }
        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader
                // left={platformname ? null : <PanelHeaderButton onClick={() => this.Prepare_top(true)}><Icon28SyncOutline/></PanelHeaderButton>}
                >
                Топ
                </PanelHeader>
                <Div>
                    <FormStatus header="Внимание! Важная информация" mode="default">
                    Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                    </FormStatus>
                </Div>
                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.Prepare_top()}} isFetching={this.state.fetching}>
                  {this.props.top_agents ? this.props.top_agents.map((result, i) => 
                    result['banned'] ? null :
                    <React.Fragment key={result.id}>
                      <Separator/>
                    <SimpleCell
                      onClick={() => {props.goOtherProfile(result['id'], true);this.setState({top_agents: null});}}
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
                    <div className="top_moderator_name_icon">
                      {result['donut'] === true ? <Icon16StarCircleFillYellow width={12} height={12} className="top_moderator_name_icon" onClick={() => this.setActiveModal('donut')} /> : null}
                    </div>
                    <div className="top_moderator_name_icon_ver">
                      {result['verified'] === true ? <Icon16Verified className="top_moderator_name_icon_ver"/>  : null }
                    </div>
                  </div>
                  </SimpleCell>
                 
                 </React.Fragment>
                  ) : <PanelSpinner />}
                </PullToRefresh></>
            </Panel>
            )
            }
        }
  
export default Reader;