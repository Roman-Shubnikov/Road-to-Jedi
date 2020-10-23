import React from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Avatar,
    Button,
    Group,
    Alert,
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
    Banner,
    Footer
    
    } from '@vkontakte/vkui';

import Icon24Filter from '@vkontakte/icons/dist/24/filter';
import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';


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
                {/* <div id="animation" className="floatingbutton" onClick={() => props.goNew_Tiket()}>
                    <Icon24Add className="floatingbutton_icon"/>
                </div> */}
                
                {props.state.ShowBanner ? <><Banner
                mode="image"
                size="m"
                onDismiss={() => {
                    props.setState({ShowBanner: false});
                }}
                header="Когда отвечать на вопросы - это твой профиль"
                subheader={<span>Отвечайте на вопросы пользователей ВКонтакте и учавствуйте в рейтинге</span>}
                background={
                <div
                    style={{
                    backgroundColor: '#5b9be6',
                    backgroundImage: 'url(https://sun9-31.userapi.com/PQ4UCzqE_jue9hAINefBMorYCdfGXvcuV5nSjA/eYugcFYzdW8.jpg)',
                    backgroundPosition: 'right bottom',
                    backgroundSize: '110%',
                    backgroundRepeat: 'no-repeat',
                    }}
                />
                }
                    asideMode="dismiss"
                    actions={<Button mode="overlay_primary" href="https://vk.com/@jedi_road-checking-responses" target="_blank" rel="noopener noreferrer" size="l">Подробнее</Button>}
                /><Separator /></> : null}
                <Div>
                    <Button onClick={() => props.goNew_Tiket()}
                    size="xl" 
                    mode="outline" 
                    stretched>Новый вопрос</Button>
                </Div>
                {props.state.tiket_all.map((result, i) => 
                <>
                    <Cell
                        key={i}
                        onClick={() => props.goTiket(result['id'])}
                        description={result['status'] === 0 ? "На рассмотрении" : result['status'] === 1 ? "Есть ответ" : "Закрыт" } 
                        asideContent={<Avatar src={result['author']['id'] === 526444378 ? "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png" : result['author']['photo_200']} size={56}/>}
                    >
                    {result['title']}

                    </Cell>
                    <Separator style={{width: "90%"}} />
                </>
                )}
                {props.state.tiket_all_helper.length === 20 ? 
                <Div>
                    <Button size="xl" level="secondary" onClick={() => props.Others()}>Загрузить ещё</Button>
                </Div>
            : 
            (props.state.tiket_all.length === 0) ? null : <Footer>{props.state.tiket_all.length} вопрос(а) всего</Footer>}
            {props.state.tiket_all.length === 0 ? 
            //  <div>
            //     <div style={{marginTop: "300px"}} className="help_title_profile">Упс, вопросы закончились.</div>
            //  </div>
            <Placeholder 
            icon={<Icon56InboxOutline />}>
                Упс, кажется вопросы закончились
            </Placeholder>
            : null}
                  
            </Panel>
            )
            }
        }
  
export default Home;