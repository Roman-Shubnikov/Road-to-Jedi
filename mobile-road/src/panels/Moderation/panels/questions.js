import React from 'react';
import { 
  Panel,
  PanelHeader,
  Div,
  PullToRefresh,
  SimpleCell,
  PanelSpinner,
  FormStatus,
  InfoRow,
  Progress,
  Footer,
  Button,
  Placeholder,
  
  } from '@vkontakte/vkui';
import Icon24Spinner from '@vkontakte/icons/dist/24/spinner';
import Icon28RecentOutline from '@vkontakte/icons/dist/28/recent_outline';
import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';


// const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

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
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
        }
        Prepare_questions(need_offset=false) {
          this.props.this.getQuestions(need_offset)
          setTimeout(() => {
            this.setState({fetching: false});
          }, 500)
        }
        nofinc(){
          return
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
                // left={<PanelHeaderBack onClick={() => window.history.back()} />}
                >
                    Модерация
                </PanelHeader>
                {!this.props.account['special'] ? <Div>
                    <FormStatus header="Внимание! Важная информация" mode="default">
                    Сервис не имеет отношения к Администрации ВКонтакте, а также их разработкам.
                    </FormStatus>
                </Div> : null}

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
                                    Но это не значит что нужно расслабляться!
                                </div> : null}
                            </FormStatus>
                        </Div> : null}
                <><PullToRefresh onRefresh={() => {this.setState({fetching: true});this.Prepare_questions()}} isFetching={this.state.fetching}>
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
            </Panel>
            )
            }
        }
  