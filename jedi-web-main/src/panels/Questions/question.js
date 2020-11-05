import React from 'react';


import './question.css'

import Question from '../components/question'

import Icon20HomeOutline from '@vkontakte/icons/dist/20/home_outline';
import Icon24RecentOutline from '@vkontakte/icons/dist/24/recent_outline';
import Icon28AddCircleOutline from '@vkontakte/icons/dist/28/add_circle_outline';

import moment from 'moment';

window.declensions = function(number = 0, titles) {  
    var cases = [ 2, 0, 1, 1, 1, 2 ];  
    return titles[
        (number % 100 > 4 && number % 100 < 20) ? 2 : cases[ (number % 10 < 5) ? number % 10 : 5 ] 
    ];  
}

export default class Questions extends React.Component {
    openRandomQuestion() {
        let data = this.props.this.sendRequest('ticket.getRandom');
        data.then(( data ) => {
            this.props.this.openTicket(data.response.id)
        });
    }

    changeTab( e ) {
        let name = e.currentTarget.children[1].innerHTML;
        let tab_home = document.getElementById( 'tab_home' );
        let tab_unresponse = document.getElementById( 'tab_unresponse' );
        let tab_name = name === 'Все' ? 'all' : 'no_request';
        this.props.this.setState({activeTabQuestion: tab_name});
        localStorage.setItem('TabQuestions', tab_name);
    
        tab_unresponse.class = name === 'Все' ? 'tab_unresponse' : 'tab_unresponse_selected';
        tab_home.class = name === 'Все' ? 'tab_home_selected' : 'tab_home';
    }

    render() {
        let props = this.props;
        return (
            <div className='wrapper'>
                <div className='tabs'>
                    <div id='tab_home' onClick={( e ) => this.changeTab( e )} className={`${props.this.state.activeTabQuestion === 'all' ? 'tab_home_selected' : 'tab_home'}`}>
                        <Icon20HomeOutline style={{marginRight: 9}}/>
                        <span>Все</span>
                    </div>
                    <div id='tab_unresponse' onClick={( e ) => this.changeTab( e )} className={`${props.this.state.activeTabQuestion !== 'all' ? 'tab_unresponse_home_selected' : 'tab_unresponse'}`}>
                        <Icon24RecentOutline style={{marginRight: 9}}/>
                        <span>Неотвеченные</span>
                    </div>
                    <div className='hr'></div>
                    <div className='tab_random' onClick={() => this.openRandomQuestion()}>
                        <Icon28AddCircleOutline style={{marginRight: 9}} width={24} height={24}/>
                        <span>Случайный вопрос</span>
                    </div>
                </div>
                <div className='list_questions'>
                    {props.this.state.activeTabQuestion === 'all' ? 
                    props.this.state.allQuestions.all.length > 0 ?
                    props.this.state.allQuestions.all.map(function(result, i) {
                        return (
                            <Question profile_id={result['profile']['id']} key={i} onClick={() => props.this.openTicket( result['id'] )} title={result['title']} answers={result['message_count']} time={moment(result['time'] * 1e3 + 10800).startOf().fromNow()} name={result['profile']['name']}/>
                        )
                    })
                    :
                    <div className='error_wrapp'>Вопросы закончились <span rel='emoji'>😡</span></div>
                    : 
                    props.this.state.allQuestions.no_answers.length > 0 ?
                    props.this.state.allQuestions.no_answers.map(function(result, i) {
                        return (
                            <Question profile_id={result['profile']['id']} key={i} onClick={() => props.this.openTicket( result['id'] )} title={result['title']} answers={result['message_count']} time={moment(result['time'] * 1e3).startOf('hour').fromNow()} name={result['profile']['name']}/>
                        )
                    })
                    :
                    <div className='error_wrapp'>На все вопросы уже ответили <span rel='emoji'>😐</span></div>
                    }
                </div>
            </div>
        )
    }
}