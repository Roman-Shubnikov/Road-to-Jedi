import React from 'react';

import './shop.css';

const avatars = [
    'shop/1.jpg',
    'shop/2.jpg',
    'shop/3.jpg',
    'shop/4.jpg',
    'shop/5.jpg',
    'shop/6.jpg',
    'shop/7.jpg',
    'shop/8.jpg',
    'shop/9.jpg',
    'shop/10.jpg',
    'shop/11.jpg',
    'shop/12.jpg',
    'shop/13.jpg',
    'shop/14.jpg',
    'shop/15.jpg',
    'shop/16.jpg',
    'shop/17.jpg',
    'shop/18.jpg',
    'shop/19.jpg',
    'shop/20.jpg',
    'shop/21.jpg',
    'shop/22.jpg',
    'shop/23.jpg',
    'shop/24.jpg',
    'shop/25.jpg',
    'shop/26.jpg',
    'shop/27.jpg',
];

export default class Shop extends React.Component {
    ChangeAvatar( offset ) {
        let data = this.props.this.sendRequest(`shop.changeAvatar&avatar_id=${offset + 1}`, '', true);
        data.then((data) => {
            this.props.this.loadMyProfile()
            this.props.this.setState({snackbar: { success: true, text: 'Вы успешно купили новый аватар'}})
            setTimeout(() => {
                window.scrollTo(0, 0)
                this.props.this.showSnackBar()
            }, 2000);
        })
    }

    ChangeId() {
        let number = document.getElementById('change_id').value;
        let data = this.props.this.sendRequest(`shop.changeId&change_id=${number}`, '', true);
        data.then(( data ) => {
            this.props.this.setState({snackbar: { success: true, text: 'Вы успешно сменили id'}})
            this.props.this.showSnackBar();

            let myProfile = this.props.this.state.myProfile;
            myProfile.nickname = number;
            myProfile.balance = data.response.balance;

            document.getElementById('change_id').value = '';
        })
    }

    TransferSend() {
        let summ_transfer = document.getElementById('summ_transfer').value;
        let send_to = document.getElementById('send_to').value;
        let data = this.props.this.sendRequest(`transfers.send&send_to=${send_to}&summa=${summ_transfer}`, '', true);
        data.then(( data ) => {
            this.props.this.setState({snackbar: { success: true, text: 'Вы успешно перевели монетки пользователю.'}})
            this.props.this.showSnackBar();

            this.props.this.state.myProfile.balance = data.response.balance;

            document.getElementById('summ_transfer').value = '';
            document.getElementById('send_to').value = '';
        })
    }


    render() {
        let global = this;
        return (
            <div className='wrapper_shop'>
                <div className='wrapper_functions'>
                    <div className='wrapper_change_number'>
                        <h2 className='wrapper_change_title'>Сменить номер</h2>
                        <div className='wrapper_change_number-input'>
                            <input id='change_id' placeholder='Введите новый номер...'/>
                            <button onClick={() => this.ChangeId()}>Сменить <span>200</span></button>
                        </div>
                    </div>
                    <div className='wrapper_send_money'>
                        <div className='send_money_title'>
                            Перевести монетки
                        </div>
                        <div className='send_money_inputs'>
                            <input id='summ_transfer' placeholder='Сумма...'/>
                            <input id='send_to' placeholder='Никнейм...'/>
                            <button onClick={() => this.TransferSend()}>Перевести</button>
                        </div>
                    </div>
                </div>
                <h2 className='avatars'>Аватарки <span style={{opacity: '0.3'}}>300</span></h2>
                <div className='wrapper_avatars'>
                    {avatars.map(function(result, i) {
                        return (
                            <img key={i} onClick={() => global.ChangeAvatar( i )} id={`avatar_${i}`} alt='avatar' src={`http://jedi.xelene.me/v1/images/${result}`} />
                        )
                    })}
                    <br/><br/><br/>
                </div>
            </div>
        )
    }
};