import React from 'react';

import { 
    Group,
    Div,
    FormStatus,
    SimpleCell,
    Placeholder,
    InfoRow,
    Progress,
    PullToRefresh,
    Button,
    Footer,
    List,
    PanelSpinner,

    } from '@vkontakte/vkui';
import Icon24Spinner                        from '@vkontakte/icons/dist/24/spinner';
import Icon28RecentOutline                  from '@vkontakte/icons/dist/28/recent_outline';
import Icon56InboxOutline                   from '@vkontakte/icons/dist/56/inbox_outline';
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
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.Prepare_questions = propsbi.Prepare_questions
        }

        componentDidMount(){
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <>
                {(this.props.account['marked'] !== null && this.props.account['marked'] !== undefined) ? 
                <Group>
                  <Div>
                    <FormStatus onClick={() => this.setActiveModal('answers')}>
                        <div style={{textAlign: 'center', color: "var(--text_profile)", marginBottom: 15}}>
                            Вы оценили <span style={{color:'var(--header_text)'}}>{this.props.account['marked']} {enumerate(this.props.account['marked'], ['ответ', 'ответа', 'ответов'])}</span> Агентов Поддержки
                        </div>
                        <InfoRow>
                            <Progress 
                            value={this.props.account['marked'] ? this.props.account['marked'] / 150 * 100 : 0} />
                            <div style={{textAlign: 'right', color: "var(--text_profile)", marginTop: 10, fontSize: 13}}>150</div>
                        </InfoRow>
                        {(this.props.account['marked'] >= 150) ? <div style={{textAlign: 'center', color: "var(--text_profile)", marginBottom: 5}}>
                            Но это не значит, что нужно расслабляться!
                        </div> : null}
                    </FormStatus>
                  </Div> 
                </Group>
                
                  : null}
                <><PullToRefresh onRefresh={() => {props.setState({fetching: true});this.Prepare_questions()}} isFetching={props.state.fetching}>
                  <Group>
                    <List>
                        {this.props.questions ? (this.props.questions.length>0) ? this.props.questions.map((result, i) => 
                        <React.Fragment key={result.id}>
                          <SimpleCell
                          onClick={() => props.props.this.goTiket(result.id)}
                          expandable
                          before={<Icon28RecentOutline className={(props.colorHandler(result.count_unmark)[1] === 3) ? 'blink2' : ''} width={34} height={34} style={props.colorHandler(result.count_unmark)[0]} />}
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
                      <Button size="l" 
                      stretched
                      level="secondary" 
                      before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                      onClick={() => {props.setState({ fetching: true });this.Prepare_questions(true)}}>Загрузить ещё</Button>
                  </Div>
                  : this.props.questions ?
                  (this.props.questions.length === 0) ? null : <Footer>{this.props.questions.length} {enumerate(this.props.questions.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
                  : null :
                  null}
                </PullToRefresh></>
                </>
            )
            }
        }
  