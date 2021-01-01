import React from 'react';

import { 
    Group,
    Div,
    SimpleCell,
    Placeholder,
    PullToRefresh,
    Button,
    Footer,
    List,
    PanelSpinner,
    MiniInfoCell,
    Separator,
    Link,
    Snackbar,
    Avatar


    } from '@vkontakte/vkui';
import Icon24Spinner                      from '@vkontakte/icons/dist/24/spinner';
import Icon56InboxOutline                 from '@vkontakte/icons/dist/56/inbox_outline';
import Icon16CheckCircle                  from '@vkontakte/icons/dist/16/check_circle';
import Icon20CancelCircleFillRed          from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon20ArticleOutline               from '@vkontakte/icons/dist/20/article_outline';
import Icon20UserOutline                  from '@vkontakte/icons/dist/20/user_outline';
import Icon20ServicesOutline              from '@vkontakte/icons/dist/20/services_outline';

function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }

  const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default class Verification extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.Prepare_questions = propsbi.Prepare_questions;
            this.setSnack = propsbi.setSnack;
        }
        approveVerification(id_request, index){
            fetch(this.props.api_url + "method=admin.approveVerificationRequest&" + window.location.search.replace('?', ''),
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
            fetch(this.props.api_url + "method=admin.denyVerificationRequest&" + window.location.search.replace('?', ''),
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
        componentDidMount(){
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <>
                <Group>
                <PullToRefresh onRefresh={() => {props.setState({fetching: true});props.Prepare_verification()}} isFetching={props.state.fetching}>
                
                  <List>
                    {this.props.verification ? (this.props.verification.length>0) ? this.props.verification.map((result, i) => 
                      <React.Fragment key={result.id}>
                        {(i === 0) || <Separator/>}
                          <SimpleCell disabled multiline>{result.title}</SimpleCell>
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
                            stretched
                            onClick={() => {
                              this.approveVerification(result.id, i)
                            }}>Принять</Button>
                            <Button size="m" 
                            stretched
                            mode="secondary" 
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              this.denyVerification(result.id, i)
                            }}>Отклонить</Button>
                          </Div>
                      </React.Fragment>
                    ) : <Placeholder 
                    icon={<Icon56InboxOutline />}>
                        Заявок нет
                    </Placeholder> : <PanelSpinner />}
                  </List>
                
                
                {this.props.verification_helper ? this.props.verification_helper.length === 20 ? 
                <Div>
                    <Button size="l" 
                    stretched
                    level="secondary" 
                    before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                    onClick={() => {this.setState({ fetching: true });props.Prepare_verification(true)}}>Загрузить ещё</Button>
                </Div>
                : this.props.verification ?
                (this.props.verification.length === 0) ? null : <Footer>{this.props.verification.length} {enumerate(this.props.verification.length, [' заявка', ' заявки', ' заявок'])} всего</Footer>
                : null :
                null}
              </PullToRefresh>
              </Group></>
              
            )
            }
        }
  