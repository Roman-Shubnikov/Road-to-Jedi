import React from 'react';
import { 
  Panel,
  PanelHeader,
  Tabs,
  TabsItem,
  HorizontalScroll,
  Group,
  } from '@vkontakte/vkui';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';
import Answers from './components/answers'
import Questions from './components/questions';
import Verification from './components/verification';
import Reports from './components/Reports';
const admins = [413636725, 526444378,585981539]

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
export default class ConstructPanel extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
              api_url: "https://xelene.ru/road/php/index.php?",
              fetching: false,
              activeTab: 'answers',
              snackbar: null,
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.changeQuest = propsbi.changeQuest;
            this.changeData = propsbi.changeData;
            this.setReport = propsbi.setReport;
            this.Prepare_answers = this.Prepare_answers.bind(this)
            this.Prepare_questions = this.Prepare_questions.bind(this)
            this.Prepare_verification = this.Prepare_verification.bind(this)
            this.colorHandler = this.colorHandler.bind(this)
            this.setSnack = (value) => {
              this.setState({snackbar: value})
            }
        }
        
        Prepare_questions(need_offset=false) {
          this.props.this.getQuestions(need_offset)
          setTimeout(() => {
            this.setState({fetching: false});
          }, 500)
        }
        Prepare_answers(need_offset=false) {
          this.props.this.getAnswers(need_offset)
          setTimeout(() => {
            this.setState({fetching: false});
          }, 500)
        }
        Prepare_verification(need_offset=false) {
          this.props.this.getAnswers(need_offset)
          setTimeout(() => {
            this.setState({fetching: false});
          }, 500)
        }
        Prepare_reports(need_offset=false) {
          this.props.this.getReports(need_offset)
          setTimeout(() => {
            this.setState({fetching: false});
          }, 500)
        }
        colorHandler(num){
          let styles = {};
          let num_style = 1
          if(num > 0 && num <= 5){
            styles = {
              color: 'var(--dynamic_green)',
            };
            num_style = 1
          }else if(num >= 6 && num <= 10){
            styles = {
              color: 'var(--dynamic_orange)',
            };
            num_style = 2
          }else if(num >= 11){
            styles = {
              color: 'var(--dynamic_red)',
            };
            num_style = 3
          }
          return [styles, num_style];
        }
        getActualPage(activeTab){
          let data;
          if(activeTab === 'answers'){
               data = <Questions 
                this={this}
                account={this.props.account}
                questions={this.props.questions} 
                questions_helper={this.props.questions_helper}  />
          }else if(activeTab === 'questions'){
                data = <Answers 
                 this={this}
                 api_url={this.state.api_url}
                account={this.props.account}
                 answers={this.props.answers} 
                  answers_helper={this.props.answers_helper}/>
          }else if(activeTab === 'verification'){
                data = <Verification 
                this={this}
                 api_url={this.state.api_url}
                 account={this.props.account}
                verification={this.props.verification}
                verification_helper={this.props.verification_helper} />
          }else if(activeTab === 'reports'){
            data = <Reports 
            this={this}
             api_url={this.state.api_url}
             account={this.props.account}
            reports={this.props.reports}
            reports_helper={this.props.reports_helper} />
      }
          return data
        }
        componentDidMount(){
        }
        render() {
            return (
                <Panel id={this.props.id}>
                <PanelHeader
                separator={!platformname}
                >
                    Модерация
                </PanelHeader>
                <Group>
                  <Tabs>
                    <HorizontalScroll>
                        <TabsItem
                            onClick={() => this.setState({ activeTab: 'answers' })}
                            selected={this.state.activeTab === 'answers'}
                        >
                            Ответы
                        </TabsItem>
                        <TabsItem
                            onClick={() => this.setState({ activeTab: 'questions' })}
                            selected={this.state.activeTab === 'questions'}
                        >
                            Вопросы
                        </TabsItem>
                        {!(admins.indexOf(this.props.account['vk_id']) === -1) ? <TabsItem
                            onClick={() => this.setState({ activeTab: 'reports' })}
                            selected={this.state.activeTab === 'reports'}
                        >
                            Жалобы
                        </TabsItem> : null}
                        {!(admins.indexOf(this.props.account['vk_id']) === -1) ? <TabsItem
                            onClick={() => this.setState({ activeTab: 'verification' })}
                            selected={this.state.activeTab === 'verification'}
                        >
                            Верификация
                        </TabsItem> : null}
                    </HorizontalScroll>
                  </Tabs>
                  
                </Group>
                
                {this.getActualPage(this.state.activeTab)}
                {this.state.snackbar}
            </Panel>
            )
            }
        }
  