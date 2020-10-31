import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige


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
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline';

import BannerAvatarPC from '../../../images/question_banner_pc.jpg'
import BannerAvatarMobile from '../../../images/question_banner_mobile.png'

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


export default class Questions extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                fething: false,
                tiket_all: null,
                tiket_all_helper: null,
                offset: 0,
                ShowBanner: true,

            }
            var props = this.props.this;
            this.setPopout = props.setPopout;
            this.showErrorAlert = props.showErrorAlert;
            this.setActiveModal = props.setActiveModal;
            this.Prepare_questions = this.Prepare_questions.bind(this);
        }
        Prepare_questions(need_offset=false){
            this.setState({ fetching: true });
            fetch(this.state.api_url + "method=tickets.get&count=20&unanswered=1&offset=" + this.state.offset + "&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
              if(data.result) {
                this.setState({tiket_all: []})
                if(this.state.tiket_all){
                    var sliyan = data.response ? this.state.tiket_all.concat(data.response) : this.state.tiket_all;
                }
                
                this.setState({tiket_all: sliyan, tiket_all_helper: data.response})
                if(need_offset){
                    this.setState({ offset: this.state.offset + 20 })
                }
                setTimeout(() => {
                  this.setState({ fetching: false });
                }, 500);
              }else{
                this.showErrorAlert(data.error.message)
            }
            })
            .catch(err => {
              this.showErrorAlert(err)
            })
        }
        componentDidMount() {
            this.Prepare_questions()
            setTimeout(() => {
                if(this.props.account.is_first_start){
                    this.props.this.playAudio()
                    this.setActiveModal('start');
                }
                this.setPopout(null)
            }, 1000) //4000
        }

        render() {
            var props = this.props.this; // Для более удобного использования.
            
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                left={<PanelHeaderButton onClick={() => this.props.this.getRandomTiket()}><Icon28CubeBoxOutline/></PanelHeaderButton>}
                >
                Вопросы
                </PanelHeader>

                {this.state.ShowBanner && this.props.account.is_first_start ? <><Banner
                mode="image"
                size="m"
                onDismiss={() => {
                    this.setState({ShowBanner: false});
                }}
                header="С чего начать?"
                subheader='С прочтения статьи'
                background={
                <div
                    style={{
                    backgroundColor: '#5b9be6',
                    backgroundImage: platformname ? 'url(' + BannerAvatarMobile + ")" : 'url(' + BannerAvatarPC + ")",
                    backgroundPosition: 'right bottom',
                    backgroundSize: '100%',

                    backgroundRepeat: 'no-repeat',
                    }}
                />
                }
                    asideMode="dismiss"
                    actions={<Button mode="overlay_primary" href="https://vk.com/@jedi_road-checking-responses" target="_blank" rel="noopener noreferrer" size="l">Читать</Button>}
                /><Separator /></> : null}
                {this.props.account.special ? <Div>
                    <Button onClick={() => props.goPanel('new_ticket')}
                    size="xl" 
                    mode="outline" 
                    stretched>Новый вопрос</Button>
                </Div> : null}
                <PullToRefresh onRefresh={this.Prepare_questions} isFetching={this.state.fetching}>
                    {this.state.tiket_all ? this.state.tiket_all.length > 0 ? this.state.tiket_all.map((result, i) => 
                    <React.Fragment key={i}>
                        <Cell
                            onClick={() => props.goTiket(result['id'])}
                            description={result['status'] === 0 ? "На рассмотрении" : result['status'] === 1 ? "Есть ответ" : "Закрыт" } 
                            asideContent={<Avatar src={result['author']['id'] === 526444378 ? "https://cdn3.iconfinder.com/data/icons/avatars-15/64/_Ninja-2-512.png" : result['author']['photo_200']} size={56}/>}
                        >
                        {result['title']}

                        </Cell>
                        <Separator style={{width: "90%"}} />
                    </React.Fragment>
                    ) : null : null}
                
                    {this.state.tiket_all_helper ? this.state.tiket_all_helper.length === 20 ? 
                    <Div>
                        <Button size="xl" level="secondary" onClick={() => this.Prepare_questions(true)}>Загрузить ещё</Button>
                    </Div>
                : this.state.tiket_all ?
                (this.state.tiket_all.length === 0) ? null : <Footer>{this.state.tiket_all.length} вопрос(а) всего</Footer>
                 : null :
                null}
                {this.state.tiket_all ? this.state.tiket_all.length === 0 ? 
                <Placeholder 
                icon={<Icon56InboxOutline />}>
                    Упс, кажется вопросы закончились
                </Placeholder>
                : null : <PanelSpinner />}
            </PullToRefresh>
            </Panel>
            )
            }
        }
  