import React from 'react'; // React
import '@vkontakte/vkui/dist/vkui.css'; // Импортируем css
import './style.css'

import {Icon28Notifications, Icon28WriteSquareOutline, Icon16Dropdown} from '@vkontakte/icons';

import Question from './panels/Questions/question.js'
import Top from './panels/Top/top.js'
import Shop from './panels/Shop/shop.js'
import Profile from './panels/Profile/profile.js'
import NewQuestion from './panels/NewQestion/newqestion.js'
import Ticket from './panels/Ticket/ticket.js'

const queryString = require('query-string');
const parsedHash = queryString.parse(window.location.hash);

var user = window.detect.parse(navigator.userAgent);


console.warn = function() {}

function getPhotoNotification( object_type, image ) {
    let img, title;
    switch( object_type ) {
        case 'add_bad_answer':
            title = 'Ваш ответ был оценен отрицательно';
            img = 'https://sun1-15.userapi.com/c857032/v857032244/1d9570/XYn8bgUDcpc.jpg';
        break;
        
        case 'add_good_answer':
            title = 'Ваш ответ оценен положительно';
            img = 'https://sun1-14.userapi.com/c857032/v857032244/1d9577/-CXzcaY2spo.jpg';
        break;

        case 'comment_add':
            title = 'Специальный Агент оставил комментарий';
            img = `https://jedi.xelene.me/v1${image.replace('/jedi/images/', '/images/')}`;
        break;

        case 'reply_approve':
            title = 'Ваш ответ был одобрен';
            img = `https://jedi.xelene.me/v1${image.replace('/jedi/images/', '/images/')}`;
        break;

        case 'ticket_reply':
            title = 'На ваш вопрос ответили';
            img = `https://jedi.xelene.me/v1${image.replace('/jedi/images/', '/images/')}`;
        break;

        case 'money_transfer_send':
            title = 'Денежный перевод';
            img = `https://jedi.xelene.me/v1${image.replace('/jedi/images/', '/images/')}`;
        break;

        case 'money_transfer_give':
            title = 'Денежный перевод';
            img = `https://jedi.xelene.me/v1${image.replace('/jedi/images/', '/images/')}`;
        break;

        default:
            title = 'Неизвестное событие';
            img = 'https://sun1-97.userapi.com/VaLRxPZcSVKgNT6OY6tHO5U5KhCTl9w6_5es3Q/wED755NyjXo.jpg?ava=1';
    }

    return { title, img };
}

function isInteger(num) {
    return (num ^ 0) === num;
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active_owner_tab: '',
            activeTabQuestion: 'all',
            myProfile: {avatar: {url: ''}},
            profile: {avatar: {url: ''}, nickname: null, balance: 0},
            topUsers: [],
            isLoader: true,
            myPosition: 0,

            Ticket: {
                info: {
                    author: {id: 0, first_name: 'None', last_name: 'None', is_closed: true, photo_200: 'https://sun1-98.userapi.com/c855524/v855524979/24261d/Y1Ax1z0NgX8.jpg'},
                    status: 0,
                    title: 'Вопрос скрыт или еще не создан.'
                },
                messages: [{author: {}, text: 'Вернитесь на главную страницу.'}]
            },
            allQuestions: {all: [], no_answers: []},
            notifications: [],
            snackbar: {
                success: true,
                text: 'Перевод прошел успешно'
            }
        };
    }

    sendRequest( method, params = '', isNew = false ) {
        return new Promise((resolve, reject) => {
            let url_api = `https://jedi.xelene.me/${isNew ? 'v2' : 'v1'}/?`;
            var url = `${url_api}method=${method}&${window.location.search.replace('?', '')}`;
    
            var global = this;
            var xhr = new XMLHttpRequest();
            xhr.open( 'POST', url, true );
    
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = () => {
            if(xhr.status === 4) return;
            if ( xhr.status === 200 ) {
                if( typeof xhr.responseText !== 'undefined' && xhr.responseText !== '' && xhr.responseText.slice(-1) === '}') {
                    var data = JSON.parse(xhr.response);
                    if( data.response ) {
                        resolve( data );
                    } else {
                        global.showErrorAlert( `${data.error.error_msg || data.error.message}` );
                    }
                }
            }
            }
            
            xhr.send( params );
    
            xhr.onerror = ( error ) => {
                this.showErrorAlert( `Ошибка соединения с сервером` )
            }
        });
    } 

    showErrorAlert( error ) {
        this.setState({snackbar: { success: false, text: error}})
        this.showSnackBar()
    }

    changeTab( isChange = false, id ) {
        if( id === 'shop' || id === 'question' || id === 'top' ) {
            let owner_tab, tab, change;
            owner_tab = localStorage.getItem('active_owner_tab');
            tab = document.getElementById( owner_tab );
            change = tab;
            if( isChange && !owner_tab.includes('profile') && !owner_tab.includes('new_question') && !owner_tab.includes('ticket') ) {
                tab.children[0].remove();
            }
            if( isChange ) {
                change = document.getElementById( id );
            }
        
            let hr = document.createElement('div');
            hr.className = 'select_title';
            change && change.appendChild( hr );
            localStorage.setItem('active_owner_tab', id)
            this.setState({ active_owner_tab: id })
        }
        if( id.includes('profile') ) {
            this.openProfile( id )
        }
        if( id.includes('ticket') ) {
            this.openTicket( id.match(/\d+/) );
        }
        if( id === 'new_question' ) {
            this.setState({active_owner_tab: id})
        }
    }

    openTabProfile( isClose = false ) {
        let tab = document.getElementById('tab_menu');
        tab.style.display = isClose ? 'none' : 'flex';
        let drop_down = document.getElementById('drop_down');
        if( !isClose ) {
            drop_down.children[0].className = 'header_dropdown_open'
        } else {
            drop_down.children[0].className = ''
        }
        let all_wrapp = document.getElementsByTagName('html')[0];
        isClose ? all_wrapp.removeEventListener('click', () => this.openTabProfile( true ), false) : all_wrapp.addEventListener('click', () => this.openTabProfile( true ), false)
    }

    openNewQuestion() {
        var activeTab = localStorage.getItem('active_owner_tab');
        localStorage.setItem('active_owner_tab', 'new_question');
        this.setState({ active_owner_tab: 'new_question' })
        if ( activeTab === 'shop' || activeTab === 'question' || activeTab === 'top' ) {
            document.getElementById( activeTab ).children[0].remove();
        }
    }

    openTicket( id ) {
        this.setState({Ticket: {info: {author: {id: 0, first_name: '', last_name: '', is_closed: true, photo_200: ''},status: 0,title: ''},messages: [{author: {}, text: ''}]}});
        let data = this.sendRequest( `ticket.getById&ticket_id=${id}`, '', false );
        data.then(( data ) => {
            console.log(data)
            if( data !== [] ) {
                this.setState({Ticket: data.response})
                var activeTab = localStorage.getItem('active_owner_tab');
                localStorage.setItem('active_owner_tab', `ticket=${id}`);
                this.setState({ active_owner_tab: `ticket=${id}` })
                if ( activeTab === 'shop' || activeTab === 'question' || activeTab === 'top' ) {
                    document.getElementById( activeTab ).children[0].remove();
                }
            }
        })
    }

    closePopouts() {
    }

    openNotification( isClose = false) {
        let tab = document.getElementById('tab_menu_noti');
        tab.style.display = isClose ? 'none' : 'block';
        let all_wrapp = document.getElementsByClassName('all_wrapper')[0];
        isClose ? all_wrapp.removeEventListener('click', () => this.openNotification( true ), false) : all_wrapp.addEventListener('click', () => this.openNotification( true ), false)
    }

    openProfile( id, deleteTab = false ) {
        this.openTabProfile()
        let active_owner_tab = localStorage.getItem('active_owner_tab');
        if ( deleteTab && !active_owner_tab.includes('ticket') && !active_owner_tab.includes('profile') && !active_owner_tab.includes('new_question') ) {
            document.getElementById( localStorage.getItem('active_owner_tab') ).children[0].remove();
        }
        id = isInteger(id) ? id : id.match(/\d+/g);
        let profile = `profile=${id}`;
        this.loadProfile( id );
        localStorage.setItem('active_owner_tab', profile);
        this.setState({ active_owner_tab: profile })
        this.openTabProfile( true )
    }

    getQuestions() {
        let data = this.sendRequest('questions.get', '', true);
        data.then( data => {
            this.setState({ allQuestions: data.response })
        })
    }

    loadProfile( id ) {
        if( id > 0 ) {
            let data = this.sendRequest(`user.getById&id=${id}`);
            data.then( data => {
                this.setState({ profile: data.response })
            })
        } else {
            this.loadMyProfile()
        }
    }

    loadNotifications() {
        let data = this.sendRequest(`notifications.get`);
        data.then( data => {
            this.setState({ notifications: data.response })
        })
    }

    loadMyProfile() {
        let data = this.sendRequest('account.get');
        data.then( data => {
            this.setState({ profile: data.response, myProfile: data.response })
        })
    }

    loadTop() {
        let data = this.sendRequest('users.getTop');
        data.then( data => {
            let offset = '100+'
            let id = this.state.myProfile.id;
            let res = data.response;
            data.response.map(function(result, i) {
                result.position = i + 1;
                if( result.id === id ) {
                    offset = i + 1
                }
            })
            this.setState({ topUsers: res, myPosition: offset })
        })
    }

    componentDidMount() {
        localStorage.getItem('active_owner_tab') || localStorage.setItem('active_owner_tab', 'question')
        this.changeTab( false, localStorage.getItem('active_owner_tab') )
        console.group('Start Info');
        console.log('Browser Family: ' + user.browser.name);
        console.log('Device Family: ' + user.device.family)
        console.log('OS Name: ' + user.os.name);
        console.groupEnd();

        let home_tab_name = localStorage.getItem('TabQuestions');
        if( home_tab_name ) {
            this.setState({activeTabQuestion: home_tab_name})
        }

        let agent_id = parsedHash.agent_id;
        let ticket_id = parsedHash.ticket_id;
        if( agent_id ) {
            this.openProfile( agent_id );
        }
        if( ticket_id ) {
            this.openTicket( ticket_id ); 
        }
        
        this.loadMyProfile();
        this.getQuestions();
        this.loadNotifications();
        this.loadTop();
    }

    showSnackBar() {
        let snackbar = document.getElementById('custom_snackbar')
        snackbar.innerHTML = `<div class='custom_snackbar_wrapp'><img src=${!this.state.snackbar.success ? 'https://sun9-42.userapi.com/c857236/v857236244/1dcf24/bMUinEHKdxw.jpg' : 'https://sun9-22.userapi.com/c855016/v855016741/241b8d/bFCFtjbNx34.jpg'} /><div>${this.state.snackbar.text}</div></div>`;
        snackbar.style.transform = 'translate(-20px, 0px)';
        setTimeout(() => {
            snackbar.style.transform = 'translate(1000px, 0px)';
        }, 7000)
    }

    render() { 
        let global = this;
        return(
            <div className='all_wrapper' onClick={() => this.closePopouts()}>
                <div className='header'>
                    <div className='header_titles'>
                        <div id='question' onClick={( e ) => this.changeTab( true, e.target.id )} className='header_title'>
                            Вопросы
                        </div>
                        <div id='top' onClick={( e ) => this.changeTab( true, e.target.id )} className='header_title'>
                            Топ
                        </div>
                        <div id='shop' onClick={( e ) => this.changeTab( true, e.target.id )} className='header_title'>
                            Магазин
                        </div>
                    </div>
                    <div className='header_buttons'>
                        {this.state.active_owner_tab === 'shop' && <div className='header_balance'>Баланс: {this.state.myProfile.balance}</div>}
                        <div className='header_button' onClick={() => this.openNotification()}>
                            <Icon28Notifications className='header_icon' width={20} height={20}/>
                        </div>
                        <div className='header_button' onClick={() => this.openNewQuestion()}>
                            <Icon28WriteSquareOutline className='header_icon' width={20} height={20}/>
                        </div>
                        <div className='header_profile'>
                            <div className='header_image'>
                                <img alt='header_image' onClick={() => this.openProfile( 0, true )} src={`https://jedi.xelene.me/v1${this.state.myProfile.avatar.url}`}/>
                            </div>
                            <div className='header_dropdown' id='drop_down' onClick={() => this.openTabProfile()}>
                                {/* <Icon16Dropdown/> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div id='tab_menu' style={{display: 'none'}} className='header_profile_open'>
                    <div style={{width: '100%'}}>
                        <div className='header_profile_open_title' onClick={() => this.openProfile( 0, true )}>Мой профиль</div>
                        <div className='header_profile_open_title'>v1.0.0-alpha.5</div>
                    </div>
                </div>
                <div id='tab_menu_noti' style={{display: 'none'}} className='header_notification'>
                    <div style={{width: '100%'}}>
                        <div className='noti_title'>Уведомления</div>
                        <div className='all_wrapp_noti'>
                            {this.state.notifications.map(function(result, i) {
                                let object = getPhotoNotification(result['object']['type'], result['image']);
                                return (
                                    <div key={i} className='noti_wrapper' onClick={result['object']['object'] === 0 ? console.log('no result') : () => global.openTicket( result['object']['object'] )}>
                                        <div className='noti_near_wrapp'>
                                            <img alt='profile_photo' src={object.img}/>
                                            <div className='titles_wrapper_noti'>
                                                <div className='title_noti'>{object.title}</div>
                                                <div className='description_noti'>{result['text']}</div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div id='custom_snackbar' className='custom_snackbar'></div>
                <br/><br/><br/><br/>
                {this.state.active_owner_tab === 'question' && <Question this={this}/>}
                {this.state.active_owner_tab === 'top' && <Top this={this}/>}
                {this.state.active_owner_tab === 'shop' && <Shop this={this}/>}
                {this.state.active_owner_tab.includes('profile') && <Profile this={this}/>}
                {this.state.active_owner_tab === 'new_question' && <NewQuestion this={this}/>}
                {this.state.active_owner_tab.includes('ticket') && <Ticket this={this}/>}
            </div>
        );
    }
}

export default App;