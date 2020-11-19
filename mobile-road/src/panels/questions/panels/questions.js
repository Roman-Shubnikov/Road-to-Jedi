import React from 'react';

import { 
    Panel,
    PanelHeader,
    PanelHeaderButton,
    Avatar,
    Button,
    Placeholder,
    Separator,
    PullToRefresh,
    PanelSpinner,
    Cell,
    Div,
    Banner,
    Footer,
    ScreenSpinner
    
    } from '@vkontakte/vkui';

import Icon56InboxOutline from '@vkontakte/icons/dist/56/inbox_outline';
import Icon28CubeBoxOutline from '@vkontakte/icons/dist/28/cube_box_outline';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';
import Icon24Spinner from '@vkontakte/icons/dist/24/spinner';

import BannerAvatarPC from '../../../images/question_banner_pc.jpg'
import BannerAvatarMobile from '../../../images/question_banner_mobile.png'

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));


export default class Questions extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                api_url: "https://xelene.ru/road/php/index.php?",
                fething: false,
                offset: 0,
                ShowBanner: true,

            }
            var propsbi = this.props.this;
            this.setPopout = propsbi.setPopout;
            this.showErrorAlert = propsbi.showErrorAlert;
            this.setActiveModal = propsbi.setActiveModal;
            this.Prepare_questions = this.Prepare_questions.bind(this);
        }
        Prepare_questions(need_offset=false, needPopout=false){
            if(needPopout){
                this.setPopout(<ScreenSpinner />)
            }
            this.props.this.getQuestions(need_offset)
            setTimeout(() => {
                this.setState({ fetching: false });
                if(needPopout){
                    this.setPopout(null)
                }
              }, 500);
        }
        componentDidMount() {
            this.setPopout(null)
            // this.Prepare_questions()
            // setTimeout(() => {
            //     if(this.props.account.is_first_start){
            //         // this.props.this.playAudio()
            //         this.setActiveModal('start');
            //     }
            //     this.setPopout(null)
            // }, 1000) //4000
        }

        render() {
            var props = this.props.this; // Для более удобного использования.
            
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                left={<>
                {(this.props.tiket_all && this.props.tiket_all.length > 0) ? 
                <PanelHeaderButton onClick={() => this.props.this.getRandomTiket()}>
                    <Icon28CubeBoxOutline/>
                </PanelHeaderButton> : null}
                {/* {platformname ? null : <PanelHeaderButton onClick={() => this.Prepare_questions(false, true)}><Icon28SyncOutline/></PanelHeaderButton>} */}
                </>}
                >
                Вопросы
                </PanelHeader>
                {(this.state.ShowBanner && this.props.first_start) ? <><Banner
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
                <PullToRefresh onRefresh={() => {this.setState({ fetching: true });this.Prepare_questions()}} isFetching={this.state.fetching}>
                    {this.props.tiket_all ? this.props.tiket_all.length > 0 ? this.props.tiket_all.map((result, i) => 
                    <React.Fragment key={i}>
                        <Cell
                            className="pointer"
                            onClick={() => {this.setState({tiket_all: null});props.goTiket(result['id'])}}
                            description={result['status'] === 0 ? "На рассмотрении" : result['status'] === 1 ? "Есть ответ" : "Закрыт" } 
                            asideContent={<Avatar src={result['author']['photo_200']} size={56}/>}
                        >
                        {result['title']}

                        </Cell>
                        <Separator style={{width: "90%"}} />
                    </React.Fragment>
                    ) : <Placeholder 
                    icon={<Icon56InboxOutline />}>
                        Упс, кажется вопросы закончились
                    </Placeholder>
                     : <PanelSpinner />}
                {this.props.tiket_all_helper ? this.props.tiket_all_helper.length === 20 ? 
                <Div>
                    <Button size="xl" 
                    level="secondary" 
                    before={this.state.fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
                    onClick={() => {this.setState({ fetching: true });this.Prepare_questions(true)}}>Загрузить ещё</Button>
                </Div>
                : this.props.tiket_all ?
                (this.props.tiket_all.length === 0) ? null : <Footer>{this.props.tiket_all.length} вопрос(а) всего</Footer>
                 : null :
                null}
                {/* {this.state.tiket_all ? this.state.tiket_all.length === 0 ? 
                <Placeholder 
                icon={<Icon56InboxOutline />}>
                    Упс, кажется вопросы закончились
                </Placeholder>
                : null : <PanelSpinner />} */}
            </PullToRefresh>
            </Panel>
            )
            }
        }
  