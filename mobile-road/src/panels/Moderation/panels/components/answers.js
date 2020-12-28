import React from 'react';

import { 
    Group,
    Div,
    FormStatus,
    Placeholder,
    PullToRefresh,
    Button,
    Footer,
    List,
    PanelSpinner,
    Separator,
    Snackbar,
    Avatar,
    RichCell


    } from '@vkontakte/vkui';
import Icon24Spinner                        from '@vkontakte/icons/dist/24/spinner';
import Icon56InboxOutline                   from '@vkontakte/icons/dist/56/inbox_outline';
import Icon16CheckCircle                    from '@vkontakte/icons/dist/16/check_circle';
import Icon20CancelCircleFillRed            from '@vkontakte/icons/dist/20/cancel_circle_fill_red';

function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }

  const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default class Answers extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.Prepare_questions = propsbi.Prepare_questions
            this.setSnack = propsbi.setSnack;
        }
        addNewTicket(id_ticket, index){
            fetch(this.props.api_url + "method=special.approveModerationTicket&" + window.location.search.replace('?', ''),
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
        delNewTicket(id_ticket,index){
            fetch(this.props.api_url + "method=special.delModerationTicket&" + window.location.search.replace('?', ''),
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

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <>
                
                {(this.props.account['bad_answers'] !== null && this.props.account['bad_answers'] !== undefined) ? 
                  <Group>
                    <Div>
                      <FormStatus>
                        <div style={{textAlign: 'center', color: "var(--text_profile)"}}>
                            Вы оценили <span style={{color:'var(--header_text)'}}>{this.props.account['bad_answers']} {enumerate(this.props.account['bad_answers'], ['ответ', 'ответа', 'ответов'])}</span> Генераторов
                        </div>
                      </FormStatus>
                    </Div>
                  </Group>
                : null}
                <Group>
                <><PullToRefresh onRefresh={() => {props.setState({fetching: true});props.Prepare_answers()}} isFetching={props.state.fetching}>
                  
                    <List>
                      {this.props.answers ? (this.props.answers.length>0) ? this.props.answers.map((result, i) => 
                        <React.Fragment key={result.id}>
                          {(i === 0) || <Separator/>}
                          <RichCell
                          multiline
                          disabled
                          caption={result.description}
                          actions={
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
                          </RichCell>
                        </React.Fragment>
                      ) : <Placeholder 
                      icon={<Icon56InboxOutline />}>
                          Можешь отдохнуть. Вопросов больше не придумали
                      </Placeholder> : <PanelSpinner />}
                    </List>
                  
                  
                  {this.props.answers_helper ? this.props.answers_helper.length === 20 ? 
                  <Div>
                      <Button size="xl" 
                      level="secondary" 
                      before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                      onClick={() => {props.setState({ fetching: true });props.Prepare_answers(true)}}>Загрузить ещё</Button>
                  </Div>
                  : this.props.answers ?
                  (this.props.answers.length === 0) ? null : <Footer>{this.props.answers.length} {enumerate(this.props.answers.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
                  : null :
                  null}
                </PullToRefresh></>
                </Group>
                </> 
            )
            }
        }
  