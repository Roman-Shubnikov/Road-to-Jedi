import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import Button from '@vkontakte/vkui/dist/components/Button/Button';
import Div from '@vkontakte/vkui/dist/components/Div/Div';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';
import Link from '@vkontakte/vkui/dist/components/Link/Link';

import Icon24Filter from '@vkontakte/icons/dist/24/filter';
import Icon24Add from '@vkontakte/icons/dist/24/add';

    class Home extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            var props = this.props.this; // Для более удобного использования.
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                left={<PanelHeaderButton onClick={() => props.setActiveModal("settings")}><Icon24Filter/></PanelHeaderButton>}
                >
                Вопросы
                </PanelHeader>
                <div id="animation" className="floatingbutton" onClick={() => props.goNew_Tiket()}>
                    <Icon24Add className="floatingbutton_icon"/>
                </div>
                {/* <Div>
                    <Button size="l" style={{ marginLeft: 8, width: "95%" }} >Новый вопрос</Button>
                </Div> */}
                {props.state.tiket_all.map(function(result, i) {
                    return (
                        <div key={i}>
                        <Cell
                          key={i}
                          onClick={() => props.goTiket(result['id'])}
                          description={result['status'] === 0 ? "На рассмотрении" : result['status'] === 1 ? "Есть ответ" : "Закрыт" } 
                          asideContent={<Avatar src={result['author']['id'] === 526444378 ? "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png" : result['author']['photo_200']} size={56}/>}
                        >
                        {result['title']}

                        </Cell>
                        <Separator style={{width: "90%"}}></Separator>
                        </div>
                    )
                })}
                {props.state.tiket_all_helper.length === 20 ? 
                <Div>
                    <Button size="xl" level="secondary" onClick={() => props.Others()}>Загрузить ещё</Button>
                </Div>
            : null}
            {props.state.tiket_all.length === 0 ? 
             <div>
                <div style={{marginTop: "300px"}} className="help_title_profile">Упс, вопросы закончились.</div>
             </div>
            : null}
                  
            </Panel>
            )
            }
        }
  
export default Home;