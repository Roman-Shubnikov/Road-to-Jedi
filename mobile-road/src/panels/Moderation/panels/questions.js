import React from 'react';
import { 
  Panel,
  PanelHeader,
  Div,
  PullToRefresh,
  SimpleCell,
  Cell,
  PanelSpinner,
  FormStatus,
  InfoRow,
  Progress,
  Footer,
  Button,
  Placeholder,
  Tabs,
  TabsItem,
  HorizontalScroll,
  Separator,
  Group,
  Snackbar,
  Avatar,
  List,
  MiniInfoCell,
  Link,

  
  } from '@vkontakte/vkui';
import Icon24Spinner                      from '@vkontakte/icons/dist/24/spinner';
import Icon28RecentOutline                from '@vkontakte/icons/dist/28/recent_outline';
import Icon56InboxOutline                 from '@vkontakte/icons/dist/56/inbox_outline';
import Icon16CheckCircle                  from '@vkontakte/icons/dist/16/check_circle';
import Icon20CancelCircleFillRed          from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon20ArticleOutline               from '@vkontakte/icons/dist/20/article_outline';
import Icon20UserOutline                  from '@vkontakte/icons/dist/20/user_outline';
import Icon20ServicesOutline              from '@vkontakte/icons/dist/20/services_outline';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';


// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
const blueBackground = {
  backgroundColor: 'var(--accent)'
};
function enumerate (num, dec) {
  if (num > 100) num = num % 100;
  if (num <= 20 && num >= 10) return dec[2];
  if (num > 20) num = num % 10;
  return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
}
export default class Questions extends React.Component {
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
        nofinc(){
          return
        }
        addNewTicket(id_ticket, index){
          fetch(this.state.api_url + "method=special.approveModerationTicket&" + window.location.search.replace('?', ''),
          {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'id_ans': id_ticket,
                })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.props.this.changeQuest('answers', [...this.props.answers.slice(0, index), ...this.props.answers.slice(index + 1)])
                this.setSnack(
                <Snackbar
                  layout="vertical"
                  onClose={() => this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  Вопрос одобрен
                </Snackbar>
              )
            } else {
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
        approveVerification(id_request, index){
          fetch(this.state.api_url + "method=special.approveVerificationRequest&" + window.location.search.replace('?', ''),
          {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'id_request': id_request,
                })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.props.this.changeQuest('verification', [...this.props.verification.slice(0, index), ...this.props.verification.slice(index + 1)])
                this.setSnack(
                <Snackbar
                  layout="vertical"
                  onClose={() => this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  Профиль верифицирован
                </Snackbar>
              )
            } else {
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
        denyVerification(id_request, index){
          fetch(this.state.api_url + "method=special.denyVerificationRequest&" + window.location.search.replace('?', ''),
          {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'id_request': id_request,
                })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.props.this.changeQuest('verification', [...this.props.verification.slice(0, index), ...this.props.verification.slice(index + 1)])
                this.setSnack(
                  <Snackbar
                  layout="vertical"
                  onClose={() => this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  В верификации отказано
                </Snackbar>
              )
            } else {
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
        delNewTicket(id_ticket,index){
          fetch(this.state.api_url + "method=special.delModerationTicket&" + window.location.search.replace('?', ''),
          {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'id_ans': id_ticket,
                })
          })
          .then(res => res.json())
          .then(data => {
            if(data.result) {
              this.props.this.changeQuest('answers', [...this.props.answers.slice(0, index), ...this.props.answers.slice(index + 1)])
                this.setSnack(
                <Snackbar
                  layout="vertical"
                  onClose={() => this.setSnack(null)}
                  before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  Вопрос удалён
                </Snackbar>
              )
            } else {
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
        componentDidMount(){
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
        render() {
            return (
                <Panel id={this.props.id}>
                <PanelHeader
                separator={false}
                // left={<PanelHeaderBack onClick={() => window.history.back()} />}
                >
                    Модерация
                </PanelHeader>
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
                      <TabsItem
                          onClick={() => this.setState({ activeTab: 'verification' })}
                          selected={this.state.activeTab === 'verification'}
                      >
                          Верификация
                      </TabsItem>
                  </HorizontalScroll>
                </Tabs>
                {(this.state.activeTab === "answers") || (this.state.activeTab === "questions") ? (this.state.activeTab === "answers") ? <>
                {(this.props.account['marked'] !== null && this.props.account['marked'] !== undefined) ? <Div>
                            <FormStatus onClick={() => this.setActiveModal('answers')}>
                                <div style={{textAlign: 'center', color: "var(--text_profile)", marginBottom: 15}}>
                                    Вы оценили <span style={{color:'var(--header_text)'}}>{this.props.account['marked']} {enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов'])}</span> Агентов Поддержки
                                </div>
                                <InfoRow>
                                    <Progress 
                                    value={this.props.account['marked'] ? Math.floor(this.props.account['marked'] / 150 * 100) : 0} />
                                    <div style={{textAlign: 'right', color: "var(--text_profile)", marginTop: 10, fontSize: 13}}>150</div>
                                </InfoRow>
                                {(this.props.account['marked'] >= 150) ? <div style={{textAlign: 'center', color: "var(--text_profile)", marginBottom: 5}}>
                                    Но это не значит, что нужно расслабляться!
                                </div> : null}
                            </FormStatus>
                        </Div> : null}
                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.Prepare_questions()}} isFetching={this.state.fetching}>
                  <Group>
                    <List>
                        {this.props.questions ? (this.props.questions.length>0) ? this.props.questions.map((result, i) => 
                        <React.Fragment key={result.id}>
                          <SimpleCell
                          onClick={() => this.props.this.goTiket(result.id)}
                          expandable
                          before={<Icon28RecentOutline className={(this.colorHandler(result.count_unmark)[1] === 3) ? 'blink2' : ''} width={34} height={34} style={this.colorHandler(result.count_unmark)[0]} />}
                          description={result.count_unmark + " " + enumerate(result.count_unmark, [' неоценённый ответ', ' неоценённых ответа', ' неоценённых ответов'])}>
                            Вопрос #{result.id}
                          </SimpleCell>
                        </React.Fragment>
                      ) : <Placeholder 
                      icon={<Icon56InboxOutline />}>
                          Можешь отдохнуть. Ответов больше не писали
                      </Placeholder> : <PanelSpinner />}
                    </List>
                  </Group>
                  
                  {this.props.questions_helper ? this.props.questions_helper.length === 20 ? 
                  <Div>
                      <Button size="xl" 
                      level="secondary" 
                      before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                      onClick={() => {this.setState({ fetching: true });this.Prepare_questions(true)}}>Загрузить ещё</Button>
                  </Div>
                  : this.props.tiket_all ?
                  (this.props.questions.length === 0) ? null : <Footer>{this.props.questions.length} {enumerate(this.props.questions.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
                  : null :
                  null}
                </PullToRefresh></>
                </> : <>



                {(this.props.account['bad_answers'] !== null && this.props.account['bad_answers'] !== undefined) ? <Div>
                            <FormStatus>
                                <div style={{textAlign: 'center', color: "var(--text_profile)"}}>
                                    Вы оценили <span style={{color:'var(--header_text)'}}>{this.props.account['bad_answers']} {enumerate(this.props.account['bad_answers'], ['ответ', 'ответа', 'ответов'])}</span> Генераторов
                                </div>
                            </FormStatus>
                        </Div> : null}
                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.Prepare_answers()}} isFetching={this.state.fetching}>
                  <Group>
                    <List>
                      {this.props.answers ? (this.props.answers.length>0) ? this.props.answers.map((result, i) => 
                        <React.Fragment key={result.id}>
                          <Separator/>
                          <Cell
                          multiline
                          disabled
                          size='l'
                          description={result.description}
                          bottomContent={
                            <div style={{ display: 'flex' }}>
                              <Button size="m"
                              onClick={() => {
                                this.addNewTicket(result.id, i)
                              }}>Принять</Button>
                              <Button size="m" 
                              mode="secondary" 
                              style={{ marginLeft: 8 }}
                              onClick={() => {
                                this.delNewTicket(result.id, i)
                              }}>Отклонить</Button>
                            </div>
                          }>
                            {result.title}
                          </Cell>
                        </React.Fragment>
                      ) : <Placeholder 
                      icon={<Icon56InboxOutline />}>
                          Можешь отдохнуть. Вопросов больше не придумали
                      </Placeholder> : <PanelSpinner />}
                    </List>
                  </Group>
                  
                  {this.props.answers_helper ? this.props.answers_helper.length === 20 ? 
                  <Div>
                      <Button size="xl" 
                      level="secondary" 
                      before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                      onClick={() => {this.setState({ fetching: true });this.Prepare_answers(true)}}>Загрузить ещё</Button>
                  </Div>
                  : this.props.tiket_all ?
                  (this.props.answers.length === 0) ? null : <Footer>{this.props.answers.length} {enumerate(this.props.answers.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
                  : null :
                  null}
                </PullToRefresh></>
                </> : 



                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.Prepare_verification()}} isFetching={this.state.fetching}>
                <Group>
                  <List>
                    {this.props.verification ? (this.props.verification.length>0) ? this.props.verification.map((result, i) => 
                      <React.Fragment key={result.id}>
                        <Separator/>
                        <Group>
                          <SimpleCell multiline>{result.title}</SimpleCell>
                          <MiniInfoCell
                          textWrap='full'
                          before={<Icon20ArticleOutline />}
                          >
                            {result.description}

                          </MiniInfoCell>
                          {result.vk_id ? <MiniInfoCell
                          mode='base'
                          before={<Icon20UserOutline/>}>
                            <Link href={'https://vk.com/id' + result.vk_id}
                            target="_blank" rel="noopener noreferrer">Страница ВКонтакте</Link>
                          </MiniInfoCell> : null}
                          <MiniInfoCell
                          mode='base'
                          before={<Icon20ServicesOutline/>}>
                            <Link href={'https://vk.com/jedi_road_app#agent_id=' + result.aid}
                            target="_blank" rel="noopener noreferrer">Профиль в приложении</Link>
                          </MiniInfoCell>
                          <Div style={{ display: 'flex' }}>
                            <Button size="m"
                            onClick={() => {
                              this.approveVerification(result.id, i)
                            }}>Принять</Button>
                            <Button size="m" 
                            mode="secondary" 
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              this.denyVerification(result.id, i)
                            }}>Отклонить</Button>
                          </Div>
                        </Group>
                        {/* <Cell
                        multiline
                        disabled
                        size='l'
                        description={result.description}
                        bottomContent={
                          <div style={{ display: 'flex' }}>
                            <Button size="m"
                            onClick={() => {
                              this.addNewTicket(result.id, i)
                            }}>Принять</Button>
                            <Button size="m" 
                            mode="secondary" 
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              this.delNewTicket(result.id, i)
                            }}>Отклонить</Button>
                          </div>
                        }>
                          {result.title}
                        </Cell> */}
                      </React.Fragment>
                    ) : <Placeholder 
                    icon={<Icon56InboxOutline />}>
                        Можешь отдохнуть. Вопросов больше не придумали
                    </Placeholder> : <PanelSpinner />}
                  </List>
                </Group>
                
                {this.props.verification_helper ? this.props.verification_helper.length === 20 ? 
                <Div>
                    <Button size="xl" 
                    level="secondary" 
                    before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                    onClick={() => {this.setState({ fetching: true });this.Prepare_verification(true)}}>Загрузить ещё</Button>
                </Div>
                : this.props.verification ?
                (this.props.verification.length === 0) ? null : <Footer>{this.props.verification.length} {enumerate(this.props.verification.length, [' заявка', ' заявки', ' заявок'])} всего</Footer>
                : null :
                null}
              </PullToRefresh></>
                }
                {this.state.snackbar}
            </Panel>
            )
            }
        }
  