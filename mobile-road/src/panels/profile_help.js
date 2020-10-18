import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton'

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

import { ScreenSpinner } from '@vkontakte/vkui';
    class Reader extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
            }
        }

        Others() {
            this.setState({popout: <ScreenSpinner/>})
            fetch(this.state.api_url + "method=tickets.getMy&count=20&offset=" + this.props.this.state.offset_profile + "&" + window.location.search.replace('?', ''))
              .then(res => res.json())
              .then(data => {
                var sliyan = this.props.this.state.profile_help.concat(data.response)
                if(data.response) {
                    this.props.this.setState({
                        another_title: "Мои вопросы",
                        profile_help: sliyan,
                        offset_profile: this.props.this.state.offset_profile + 20,
                        profile_another_helper:  data.response,
                        activePanel: "profile_help",
                        history: [...this.props.this.state.history, "profile_help"]})
                }
              })
              .catch(err => {
                console.log(err)
              })
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                left={                    <PanelHeaderButton onClick={() => window.history.back()}> 
                <Icon24BrowserBack/></PanelHeaderButton>}
                >
                {props.state.title_another}
                </PanelHeader>
                    
                {props.state.profile_help.map(function(result, i) {
                    return (
                        <div key={i}>
                        <Cell
                          key={i}
                          onClick={() => props.goTiket(result['id'])}
                          description={result['status'] === 0 ? "На рассмотрении" : result['status'] === 1 ? "Есть ответ" : "Закрыт" } 
                          asideContent={<Avatar src={result['author']['photo_200']} size={56}/>}
                        >
                        {result['title']}

                        </Cell>
                        <Separator style={{width: "85%"}}></Separator>
                        </div>
                    )
                })}
                {props.state.profile_another_helper.length === 20 ? 
                <Div>
                    <Button size="xl" level="secondary" onClick={() => props.Dop()}>Загрузить ещё</Button>
                </Div>
            : null}
             {props.state.profile_help.length === 0 ? 
             <div>
                <div style={{marginTop: "300px"}} className="help_title_profile">У вас нет вопросов в поддержку.</div>
             </div>
            : null}
                  
            </Panel>
            )
            }
        }
  
export default Reader;