import React from 'react';
import $ from 'jquery';
import bridge from '@vkontakte/vk-bridge';

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
    Div,
    Banner,
    Footer,
    ScreenSpinner,
    Group,
    List,
    SimpleCell,
    FixedLayout,
    PromoBanner,
    
    
    } from '@vkontakte/vkui';

import Icon56InboxOutline           from '@vkontakte/icons/dist/56/inbox_outline';
import Icon28WriteSquareOutline     from '@vkontakte/icons/dist/28/write_square_outline';
// import Icon28SyncOutline from '@vkontakte/icons/dist/28/sync_outline';
import Icon16StarCircleFillYellow   from '@vkontakte/icons/dist/16/star_circle_fill_yellow';


import BannerAvatarPC from '../../../images/question_banner_pc.jpg'
import BannerAvatarMobile from '../../../images/question_banner_mobile.png'

const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }
var loadingContent = false;
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
            this.componentDidMount = this.componentDidMount.bind(this)
        }
        Prepare_questions(need_offset=false, needPopout=false){
            loadingContent = true
            if(needPopout){
                this.setPopout(<ScreenSpinner />)
            }
            this.props.this.getQuestions(need_offset)
            setTimeout(() => {
                this.setState({ fetching: false });
                loadingContent = false
                if(needPopout){
                    this.setPopout(null)
                }
              }, 500);
        }
        componentDidMount() {
            this.setPopout(null)
            if(!this.props.account['donut']) {
                    bridge.send('VKWebAppGetAds')
                .then((promoBannerProps) => {
                    this.setState({ promoBannerProps });
                })
            }
            $(window).on('scroll.detectautoload', () => {
                if($(window).scrollTop() + $(window).height() + 400 >= $(document).height() && !loadingContent && this.props.tiket_all_helper && this.props.tiket_all_helper.length === 20){
                    this.Prepare_questions(true)
                }
            })
        }
        componentWillUnmount(){
            $(window).off('scroll.detectautoload')
            
        }

        render() {
            var props = this.props.this; // Для более удобного использования.
            
            return (
                <Panel id={this.props.id}> 
                <PanelHeader
                left={<>
                {(this.props.tiket_all && this.props.tiket_all.length > 0) ? 
                <PanelHeaderButton onClick={() => this.props.this.getRandomTiket()}>
                    <Icon28WriteSquareOutline/>
                </PanelHeaderButton> : null}
                {/* {platformname ? null : <PanelHeaderButton onClick={() => this.Prepare_questions(false, true)}><Icon28SyncOutline/></PanelHeaderButton>} */}
                </>}
                >
                Вопросы
                </PanelHeader>
                
                {(this.state.ShowBanner && this.props.first_start) ? 
                <Group>
                    <Banner
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
                        actions={
                        <Button mode="overlay_primary" href="https://vk.com/@jedi_road-checking-responses" target="_blank" rel="noopener noreferrer" size="l">Читать</Button>
                    }
                    />
                </Group>
                
                 : null}
                {this.props.account.special ? 
                <Group>
                    <Div>
                        <Button onClick={() => props.goPanel('new_ticket')}
                        size="l" 
                        mode="outline" 
                        stretched>Новый вопрос</Button>
                    </Div>
                </Group>
                 : null}
                <Group>
                    <PullToRefresh onRefresh={() => {this.setState({ fetching: true });this.Prepare_questions()}} isFetching={this.state.fetching}>
                        
                            <List>
                                {this.props.tiket_all ? this.props.tiket_all.length > 0 ? this.props.tiket_all.map((result, i) => 
                                <React.Fragment key={i}>
                                    {(i === 0) || <Separator />}
                                    <SimpleCell
                                        multiline
                                        expandable
                                        onClick={() => {this.setState({tiket_all: null});props.goTiket(result['id'])}}
                                        description={result['status'] === 0 ? "На рассмотрении" : result['status'] === 1 ? "Есть ответ" : "Закрыт" } 
                                        before={<Avatar src={result['author']['photo_200']} size={48}/>}
                                    >
                                        <div style={{display:"flex"}}>
                                            {result['title']}
                                            <div className='questionsIcons'>
                                                <div className='icon_donut_questions'>
                                                    {result['donut'] ? <Icon16StarCircleFillYellow width={12} height={12} className="top_moderator_name_icon" /> : null}
                                                </div>
                                            </div>
                                        </div>
                                    </SimpleCell>
                                </React.Fragment>
                                ) : <Placeholder 
                                icon={<Icon56InboxOutline />}>
                                    Упс, кажется вопросы закончились
                                </Placeholder>
                                : <PanelSpinner />}
                            </List>
                        
                        
                    {this.props.tiket_all_helper ? this.props.tiket_all_helper.length === 20 ? 
                    <PanelSpinner />
                    : this.props.tiket_all ?
                    (this.props.tiket_all.length === 0) ? 
                    null : 
                    <Footer>{this.props.tiket_all.length} {enumerate(this.props.tiket_all.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
                    : null :
                    null}
                </PullToRefresh>
            </Group>
            { this.state.promoBannerProps && this.state.ShowBanner && 
                <FixedLayout vertical='bottom'>
                  <PromoBanner onClose={() => {this.setState({ShowBanner: false})}} bannerData={ this.state.promoBannerProps } />
                </FixedLayout> }
            </Panel>
            )
            }
        }
  