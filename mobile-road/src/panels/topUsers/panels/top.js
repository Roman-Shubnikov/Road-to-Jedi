import React from 'react';
import { 
  Panel,
  PanelHeader,
  Div,
  Separator,
  PullToRefresh,
  PanelSpinner,
  FormStatus,
  ScreenSpinner,
  PanelHeaderContent,
  PanelHeaderContext,
  Cell,
  List,
  Group,

  } from '@vkontakte/vkui';

import Icon16Dropdown             from '@vkontakte/icons/dist/16/dropdown';
import Icon24Done                 from '@vkontakte/icons/dist/24/done';
import Icon28UserOutline          from '@vkontakte/icons/dist/28/user_outline';
import Icon28EmployeeOutline      from '@vkontakte/icons/dist/28/employee_outline';
import UserTopC from '../../../components/userTop';

// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';


// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

    class Reader extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              api_url: "https://xelene.ru/road/php/index.php?",
              fetching: false,
              contextOpened: false,
              mode: false,
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.toggleContext = () =>  {
              this.setState({ contextOpened: !this.state.contextOpened });
            }
            this.select = (e) => {
              const mode = Boolean(Number(e.currentTarget.dataset.mode));
              this.setState({ mode });
              requestAnimationFrame(this.toggleContext);
              this.props.this.getTopUsers(mode);
            }
        }
        Prepare_top(needPopout=false, mode=false) {
          if(needPopout){
            this.setPopout(<ScreenSpinner />)
          }
          this.props.this.getTopUsers(mode)
          setTimeout(() => {
            this.setState({fetching: false});
            if(needPopout){
              this.setPopout(null)
          }
          }, 500)
        }
        nofinc(){
          return
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
                  {this.props.account['special'] ? <PanelHeaderContent
                    aside={<Icon16Dropdown style={{ transition: '0.3s',transform: `rotate(${this.state.contextOpened ? '180deg' : '0'})` }} />}
                    onClick={this.toggleContext}
                  >
                    Пантеон
                  </PanelHeaderContent> 
                  :
                    "Пантеон" }
                
                </PanelHeader>
                <PanelHeaderContext opened={this.state.contextOpened} onClose={this.toggleContext}>
                  <List>
                    <Cell
                      before={<Icon28UserOutline />}
                      asideContent={!this.state.mode ? <Icon24Done fill="var(--accent)" /> : null}
                      onClick={this.select}
                      data-mode={0}
                    >
                      Пользователи
                    </Cell>
                    <Cell
                      before={<Icon28EmployeeOutline />}
                      asideContent={this.state.mode ? <Icon24Done fill="var(--accent)" /> : null}
                      onClick={this.select}
                      data-mode={1}
                    >
                      Сотрудники
                    </Cell>
                  </List>
                </PanelHeaderContext>
                <Group>
                {!this.props.account['special'] ? <Div>
                    <FormStatus header="Внимание! Важная информация" mode="default">
                    Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                    </FormStatus>
                </Div> : null}
                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.Prepare_top(false, this.state.mode)}} isFetching={this.state.fetching}>
                  {this.props.top_agents ? this.props.top_agents.map((result, i) => 
                    result['banned'] ? null :
                    <React.Fragment key={result.id}>
                      {(i === 0) || <Separator/>}

                    <UserTopC {...result}
                    onClick={() => {props.goOtherProfile(result['id'], true);this.setState({top_agents: null});}} />
                 
                 </React.Fragment>
                  ) : <PanelSpinner />}
                </PullToRefresh></>
                </Group>
            </Panel>
            )
            }
        }
  
export default Reader;