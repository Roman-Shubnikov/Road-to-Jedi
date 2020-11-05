import React from 'react';

import TopPosition from '../components/top/'

import './top.css'

const Top = props => (
    <div className='wrapper_top_owner'>
        <div className='wrapper_my_top'>
            <TopPosition onClick={() => props.this.openProfile( props.this.state.myProfile['id'], true )} id={props.this.state.myProfile['id']} flash={props.this.state.myProfile['flash']} verified={props.this.state.myProfile['verified']} title={isFinite(props.this.state.myProfile['nickname']) ? `Агент Поддержки #${props.this.state.myProfile['nickname']}` : props.this.state.myProfile['nickname'] ? props.this.state.myProfile['nickname'] : `Агент Поддержки #${props.this.state.myProfile['id']}`} position={props.this.state.myPosition} isMy={true} src={'https://jedi.xelene.me/v1' + props.this.state.myProfile['avatar']['url']} style={{borderRadius: '10px', boxShadow: '0px 1.34894px 35.747px rgba(0, 0, 0, 0.04)'}} bad={props.this.state.myProfile.bad_answers} all={props.this.state.myProfile.total_answers} good={props.this.state.myProfile.good_answers}/>
        </div>
        <div className='wrapper_others'>
            <div className='wrapper_other_owner'>
                {props.this.state.topUsers.map(function(result, i) {
                    let title = isFinite(result['nickname']) ? `Агент Поддержки #${result['nickname']}` : result['nickname'] ? result['nickname'] : `Агент Поддержки #${result['id']}`;
                    return (
                        <TopPosition onClick={() => props.this.openProfile( result['id'], true )} style={result['position'] === 1 ? {borderRadius: '10px 10px 0 0'} : null} flash={result['flash']} verified={result['verified']} id={result['id']} position={result['position']} key={i} title={title} good={result.good_answers} all={result.total_answers} bad={result.bad_answers} src={'https://jedi.xelene.me/v1' + result['avatar']['url']} />
                    )
                })}
            </div>
        </div>
    </div>
);

export default Top;