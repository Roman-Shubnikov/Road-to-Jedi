import React from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Button,
    Group,
    Alert,
    Avatar,
    Placeholder,
    Separator,
    PullToRefresh,
    PanelSpinner,
    InfoRow,
    Header,
    Counter,
    SimpleCell,
    PromoBanner,
    FixedLayout,
    Cell,
    Div,
    HorizontalScroll,
    View,
    Switch,
    ScreenSpinner,
    } from '@vkontakte/vkui';

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';

let month = "";
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

    class myQuestions extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                myQuestions:[],
                fetching: false,
            }
            this.myQuestions = () => {
                fetch(this.props.this.state.api_url + "method=tickets.getByModeratorAnswers" + "&" + window.location.search.replace('?', ''))
                  .then(res => res.json())
                  .then(data => {
                    if(data.result) {
                      this.setState({myQuestions: data.response})
                      setTimeout(() => {
                          this.setState({fetching: false});
                    }, 500)
                      
                    }
                  })
                  .catch(err => {
                    this.props.this.showErrorAlert()
          
                  })
              }
        }

        
        componentDidMount(){
            this.myQuestions()
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
            <PanelHeader 
                left={<PanelHeaderButton onClick={() => window.history.back()}><Icon24BrowserBack/></PanelHeaderButton>}
            >
                Мои вопросы
                </PanelHeader>
                <PullToRefresh onRefresh={() => {this.setState({fetching: true});this.myQuestions()}} isFetching={this.state.fetching}>
                    {this.state.myQuestions.length > 0 ?
                    this.state.myQuestions.map((result, i) => 
                    <> 
                    <SimpleCell
                        key={i}
                        onClick={() => props.goTiket(result['id'])}
                        description={new Date(result['time'] * 1e3).getDate() + " " + months[new Date(result['time'] * 1e3).getMonth()] + " " + new Date(result['time'] * 1e3).getFullYear() + " в " 
                        + fix_time(new Date(result['time'] * 1e3).getHours()) + ":" + fix_time(new Date(result['time'] * 1e3).getMinutes())}
                        size="l"
                        before={<Avatar src={result['author']['id'] === 526444378 ? "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png" : result['author']['photo_200']} />}
                    >
                        {result['title']}
                    </SimpleCell>
                    <Separator style={{width: "90%"}} />
                    </>
                    ) :
                    <Placeholder 
                    stretched
                    icon={<Icon56InboxOutline />}>
                        Упс, кажется здесь нет ваших вопросов.
                    </Placeholder>
                    }
                </PullToRefresh>
            </Panel>
            )
            }
        }
  
export default myQuestions;