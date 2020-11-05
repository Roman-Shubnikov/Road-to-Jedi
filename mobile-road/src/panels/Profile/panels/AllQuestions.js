import React from 'react';

import { 
    Panel,
    PanelHeader,
    Button,
    Placeholder,
    Separator,
    PullToRefresh,
    Cell,
    Div,
    PanelHeaderBack,
    Tabs,
    TabsItem,
    Search,
    } from '@vkontakte/vkui';

import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';
import Icon28WarningTriangleOutline from '@vkontakte/icons/dist/28/warning_triangle_outline';
function fix_time(time) {
    if(time < 10) {
        return "0" + time
    } else {
        return time
    }
  }

  var months = [
    'янв',
    'фев',
    'мар',
    'апр',
    'мая',
    'июн',
    'июл',
    'авг',
    'сен',
    'окт',
    'ноя',
    'дек',
];

export default class myQuestions extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                myQuestions:[],
                fetching: false,
                activeTab: 'positive',
                search: '',
                limiter: 20
            }
            
        }
        getFiltresQuestions(questions){
            if(this.state.activeTab === 'positive'){
                return questions.filter(({mark}) => mark === 1);
            }else{
                return questions.filter(({mark}) => mark === 0);
            }
        }
        getFilterSearch(questions) {
            const search = this.state.search.toLowerCase();
            return questions.filter(({text}) => text.toLowerCase().indexOf(search) > -1);
        }

        limiter(questions){
            return questions.slice(0, this.state.limiter)
        }
        prepare_questions(){
            this.props.this.myQuestions()
            setTimeout(() => {
                this.setState({ fetching: false });
              }, 500);
        }
        componentDidMount(){
            // this.prepare_questions()
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            var questions = this.getFiltresQuestions(this.props.myQuestions);
            var searched = this.getFilterSearch(questions);
            var limiter_search = this.limiter(searched);
            return (
                <Panel id={this.props.id}>
            <PanelHeader separator={false}
                left={<PanelHeaderBack onClick={() => window.history.back()} />}
            >
                Мои ответы
                </PanelHeader>
                <Search value={this.state.search}
                    onChange={(e) => {
                        this.setState({search: e.target.value})
                    }} />
                <Tabs>
                <TabsItem
                    onClick={() => this.setState({ activeTab: 'positive' })}
                    selected={this.state.activeTab === 'positive'}
                >
                    Положительные
                </TabsItem>
                <TabsItem
                    onClick={() => this.setState({ activeTab: 'negative' })}
                    selected={this.state.activeTab === 'negative'}
                >
                    Отрицательные
                </TabsItem>
                </Tabs>
                <PullToRefresh onRefresh={() => {this.setState({fetching: true});this.prepare_questions()}} isFetching={this.state.fetching}>
                    {questions.length > 0 ?
                    searched.length > 0 ?
                    <>
                    {limiter_search.map((result, i) => 
                    <React.Fragment key={result.id}> 
                    <Cell
                        key={i}
                        onClick={() => props.goTiket(result['ticket_id'])}
                        description={new Date(result['time'] * 1e3).getDate() + " " + months[new Date(result['time'] * 1e3).getMonth()] + " " + new Date(result['time'] * 1e3).getFullYear() + " в " 
                        + fix_time(new Date(result['time'] * 1e3).getHours()) + ":" + fix_time(new Date(result['time'] * 1e3).getMinutes())}
                        size="l"
                        // before={<Avatar src={result['author']['id'] === 526444378 ? "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png" : result['author']['photo_200']} />}
                    >
                        {result['text']}
                    </Cell>
                    <Separator style={{width: "90%"}} />
                    </React.Fragment>
                    )}
                    {(limiter_search < searched) ? 
                    <Div>
                        <Button 
                        mode='secondary' 
                        size='xl' 
                        stretched
                        onClick={() => this.setState({limiter: this.state.limiter + 10})}
                        >Показать ещё 10 ответов</Button>
                    </Div> : null}
                    </> :
                    <Placeholder 
                    icon={<Icon28WarningTriangleOutline width={56} height={56} />}>
                        По вашему запросу ничего не найдено.
                    </Placeholder> :
                    <Placeholder 
                    icon={<Icon56InboxOutline />}>
                        Упс, кажется здесь нет ваших ответов.
                    </Placeholder>
                    }
                </PullToRefresh>
            </Panel>
            )
            }
        }
  