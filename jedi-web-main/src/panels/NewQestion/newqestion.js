import React from 'react';

import './newqestion.css'

export default class NewQestion extends React.Component {
    NewQestion( title, description ) {
        let data = this.props.this.sendRequest( 'ticket.add', `title=${encodeURIComponent(title)}&text=${encodeURIComponent(description)}`);
        data.then(( data ) => {
            document.getElementById('title_new_question').value = "";
            document.getElementById('description_new_question').value = "";
            
            this.props.this.openTicket( data.response.ticket_id );
        })
    }

    sendQuestion() {
        let title = document.getElementById('title_new_question').value;
        let description = document.getElementById('description_new_question').value;

        this.NewQestion( title, description );
    }

    render() {
        return (
            <div className='wrapper_new_question'>
                <div className='wrapper_new_question_center'>
                    <h2 className='wrapper_question_h2'>Задать вопрос</h2>
                    <div className='wrapper_question_description'>Здесь Вы можете задать любой вопрос о ВКонтакте.</div>

                    <div className='input_title'>
                        <input id='title_new_question' placeholder='Опишите проблему в двух словах...' />
                    </div>
                    <div className='input_description'>
                        <textarea id='description_new_question' placeholder='Опишите проблему подробнее...' />
                    </div>

                    <div className='question_button'>
                        <button onClick={() => this.sendQuestion()}>Отправить</button>
                    </div>
                </div>
            </div>
        )
    }
};