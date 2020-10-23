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
    } from '@vkontakte/vkui';

import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import Icon24SmileOutline from '@vkontakte/icons/dist/24/smile_outline';
import Icon24Report from '@vkontakte/icons/dist/24/report';
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
                {props.state.myQuestions.length > 0 ?
                props.state.myQuestions.map((result, i) => 
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
                action={<Button size="l" onClick={() => {
                    props.goNew_Tiket()
                }}>Задать вопрос</Button>}
                icon={<Icon56InboxOutline />}>
                    Упс, кажется здесь нет ваших вопросов. Давайте зададим новый.
                </Placeholder>
                }
            </Panel>
            )
            }
        }
  
export default myQuestions;