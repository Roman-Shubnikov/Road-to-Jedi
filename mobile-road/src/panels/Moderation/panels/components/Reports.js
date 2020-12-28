import React from 'react';

import { 
    Group,
    Div,
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
import Icon28TargetOutline                from '@vkontakte/icons/dist/28/target_outline';
import Icon20CommentOutline               from '@vkontakte/icons/dist/20/comment_outline';
import Icon20CommunityName                from '@vkontakte/icons/dist/20/community_name';

function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }

  const blueBackground = {
    backgroundColor: 'var(--accent)'
  };

const reasons = {
  1 : 'Оскорбление',
  2 : 'Порнография',
  3 : 'Введение в заблуждение',
  4 : 'Реклама',
  5 : 'Вредоносные ссылки',
  6 : 'Сообщение не по теме',
  7 : 'Издевательство',
  8 : 'Другое',
}
const types = [
  'Комментарий спец. агента',
  'Профиль агента',
  'Ответ агента',
  'Вопрос от генератора',
]
export default class Reports extends React.Component {
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
        approve(id_request){
            fetch(this.props.api_url + "method=reports.approveReport&" + window.location.search.replace('?', ''),
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
                this.props.this.Prepare_reports()
                  this.setSnack(
                  <Snackbar
                    layout="vertical"
                    onClose={() => this.setSnack(null)}
                    before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                  >
                    Жалоба принята
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
          deny(id_request){
            fetch(this.props.api_url + "method=reports.denyReport&" + window.location.search.replace('?', ''),
            {method: 'post',
                  headers: {"Content-type": "application/json; charset=UTF-8"},
                  body: JSON.stringify({
                      'id_request': id_request,
                  })
            })
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.props.this.Prepare_reports()
                  this.setSnack(
                    <Snackbar
                    layout="vertical"
                    onClose={() => this.setSnack(null)}
                    before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                  >
                    Жалоба отклонена
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

        reasonConverter(reason_id){
          let out = '';
          try {
            out = reasons[reason_id];
          } catch (e) {
            out = 'Не знаю такой причины'
          }
          return out;
        }

        typeReportConverter(type_rep){
          let out = '';
          try {
            out = types[type_rep - 1];
          } catch (e) {
            out = 'Не знаю такой причины'
          }
          return out;
        }
        componentDidMount(){
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <>
                <Group>
                <PullToRefresh onRefresh={() => {props.setState({fetching: true});props.Prepare_reports()}} isFetching={props.state.fetching}>
                  <List>
                    {this.props.reports ? (this.props.reports.length>0) ? this.props.reports.map((result, i) => 
                      <React.Fragment key={result.id}>
                        {(i === 0) || <Separator/>}
                          <MiniInfoCell
                          textWrap='full'
                          before={<Icon20CommentOutline />}
                          >
                            {result.comment || "Без комментария"}

                          </MiniInfoCell>
                          {result.materials ? <MiniInfoCell
                          textWrap='full'
                          before={<Icon20ArticleOutline />}
                          >
                            {result.materials}

                          </MiniInfoCell> :null}

                          {result.vk_id ? <MiniInfoCell
                          mode='base'
                          before={<Icon20UserOutline/>}>
                            <Link href={'https://vk.com/id' + result.vk_id}
                            target="_blank" rel="noopener noreferrer">1 Страница ВКонтакте</Link>
                          </MiniInfoCell> : null}
                          <MiniInfoCell
                          mode='base'
                          before={<Icon20ServicesOutline/>}>
                            <Link href={'https://vk.com/jedi_road_app#agent_id=' + result.aid}
                            target="_blank" rel="noopener noreferrer">1 Профиль в приложении</Link>
                          </MiniInfoCell>
                          {result.vk_id ? <MiniInfoCell
                          mode='base'
                          textWrap='full'
                          before={<Icon20UserOutline/>}>
                            <Link href={'https://vk.com/id' + result.vk_id_reporting}
                            target="_blank" rel="noopener noreferrer">2 ВКонтакте</Link>
                          </MiniInfoCell> : null}
                          <MiniInfoCell
                          mode='base'
                          before={<Icon20ServicesOutline/>}>
                            <Link href={'https://vk.com/jedi_road_app#agent_id=' + result.id_reporting}
                            target="_blank" rel="noopener noreferrer">2 Профиль в приложении</Link>
                          </MiniInfoCell>
                          <MiniInfoCell
                          mode='base'
                          before={<Icon28TargetOutline height={20} width={20} />}>
                            {this.reasonConverter(result.name)}
                          </MiniInfoCell>
                          <MiniInfoCell
                          textWrap='full'
                          before={<Icon20CommunityName />}
                          >
                            {this.typeReportConverter(result.type)}

                          </MiniInfoCell>
                          <Div style={{ display: 'flex' }}>
                            <Button size="m"
                            onClick={() => {
                              this.approve(result.id)
                            }}>Принять</Button>
                            <Button size="m"
                            mode="secondary" 
                            style={{ marginLeft: 8 }}
                            onClick={() => {
                              this.deny(result.id)
                            }}>Отклонить</Button>
                          </Div>
                      </React.Fragment>
                    ) : <Placeholder 
                    icon={<Icon56InboxOutline />}>
                        Жалоб нет
                    </Placeholder> : <PanelSpinner />}
                  </List>
                
                
                {this.props.reports_helper ? this.props.reports_helper.length === 20 ? 
                <Div>
                    <Button size="xl" 
                    level="secondary" 
                    before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                    onClick={() => {this.setState({ fetching: true });props.Prepare_reports(true)}}>Загрузить ещё</Button>
                </Div>
                : this.props.reports ?
                (this.props.reports.length === 0) ? null : <Footer>{this.props.reports.length} {enumerate(this.props.reports.length, [' жалоба', ' жалоб', ' жалобы'])} всего</Footer>
                : null :
                null}
              </PullToRefresh>
              </Group></>
            )
            }
        }
  