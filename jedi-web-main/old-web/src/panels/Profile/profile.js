import React from 'react';

import './profile.css'

// import Icon28ArrowLeftOutline from '@vkontakte/icons/dist/28/arrow_left_outline';
import {Icon28GlobeOutline, Icon28MoneySendOutline, Icon16Fire, Icon16FireVerified, Icon16Verified, Icon28Profile} from '@vkontakte/icons';

import vkQr from '@vkontakte/vk-qr';

const moneys = ['монетка', 'монетки', 'монеток'];

function generateQr( text ) {
    return vkQr.createQR(text, {
        qrSize: 70,
        isShowLogo: false
    });
}

const Profile = props => (
    <div className='profile_wrapper'>
        <div className='profile_avatar'>
            <img alt='' src={`https://jedi.xelene.me/v1${props.this.state.profile.avatar.url}`}/>
        </div>
        <div className='titles_profile'>
            <div style={{margin: 'auto', display: 'flex', alignItems: 'center'}}>
                <div className='profile_title'>{isFinite(props.this.state.profile['nickname']) ? `Агент Поддержки #${props.this.state.profile['nickname']}` : props.this.state.profile['nickname'] ? props.this.state.profile['nickname'] : `Агент Поддержки #${props.this.state.profile['id']}`} {props.this.state.profile['flash']}</div>
                <div className='flash' style={{marginBottom: '-2px'}}>{props.this.state.profile.verified && props.this.state.profile.flash ? <Icon16FireVerified style={{marginBottom: 4}} width={22} height={22}/> : props.this.state.profile.verified ? <Icon16Verified style={{color: '#398DF7'}} width={22} height={22}/> : props.this.state.profile.flash ? <Icon16Fire width={22} height={22}/> : null}</div>
            </div>
        </div>
        <div className='profile_owner_block'>
            {props.this.state.profile.id === props.this.state.myProfile.id 
            ?
            <div className='profile_owner_first'>
                <div className='profile_balance'>
                    <div className='profile_owner_balance_title'>Баланс</div>
                    <div className='profile_owner_balance'>{props.this.state.profile.balance} {window.declensions(props.this.state.profile.balance, moneys)}</div>
                    <div className='profile_owner_icons'>
                        <div className='profile_owner_icon' onClick={() => props.this.changeTab( true, 'shop' )}>
                            <Icon28Profile className='profile_icon' width={36} height={36}/>
                            Поменять аватарку
                        </div>
                        {/* <div className='profile_owner_icon'>
                            <Icon28ArrowLeftOutline className='profile_icon' width={36} height={36}/> 
                            Сбросить статистику
                        </div> */}
                        <div className='profile_owner_icon' onClick={() => props.this.changeTab( true, 'shop' )}>
                            <Icon28GlobeOutline className='profile_icon' width={36} height={36}/>
                            Сменить номер
                        </div>
                        <div className='profile_owner_icon' onClick={() => props.this.changeTab( true, 'shop' )}>
                            <Icon28MoneySendOutline className='profile_icon' width={36} height={36}/>
                            Перевести
                        </div>
                    </div>
                </div>
            </div>
            : 
            <div className='profile_owner_second'>
                <div className='profile_money_send_wrapper clickable' onClick={() => props.this.changeTab( true, 'shop' )}>
                    <div className='title_special_profile_wrapp' >Перевести монетки</div>
                    <div className='desc_special_profile_wrapp'>Баланс Агента: {`${props.this.state.profile.balance} ${window.declensions(props.this.state.profile.balance, moneys)}`}</div>
                </div>
                <div className='profile_money_achievements_wrapper up_fix'>
                    <div className='title_special_profile_wrapp'>Достижения</div>
                    <div className='desc_special_profile_wrapp'>0 из 0</div>
                </div>
            </div>
        }
            <div className='profile_owner_second'>
                <div className='profile_qr_wrapper'>
                    <div className='profile_qr' dangerouslySetInnerHTML={{__html: generateQr(`https://vk.com/app7409818#agent_id=${props.this.state.profile.id}`)}}/>
                    <div className='profile_qr_title'>Отсканируйте QR-код!</div>
                </div>
                <div className='profile_answers'>
                    <div className='profile_answer'>
                        <div style={{margin: 'auto'}}>
                            <div className='profile_count'>{props.this.state.profile.bad_answers}</div>
                            <div className='profile_under_count'>Отрицательных</div>   
                        </div>
                    </div>
                    <div className='profile_response'>
                        <div style={{margin: 'auto'}}>
                            <div className='profile_count'>{props.this.state.profile.good_answers}</div>
                            <div className='profile_under_count'>Положительных</div>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export default Profile;