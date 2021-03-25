import React from 'react';

import { 
    SimpleCell,
    Avatar,

    } from '@vkontakte/vkui';

import {
  Icon16FireVerified,
  Icon16Fire,
  Icon16Verified,
  Icon16StarCircleFillYellow,
  Icon28DiamondOutline,

} from '@vkontakte/icons'
function enumerate (num, dec) {
    if (num > 100) num = num % 100;
    if (num <= 20 && num >= 10) return dec[2];
    if (num > 20) num = num % 10;
    return num === 1 ? dec[0] : num > 1 && num < 5 ? dec[1] : dec[2];
  }

export default props => {
  const {disabled,special, nickname, good_answers, bad_answers, key, id, avatar, flash,donut,verified,diamond, onClick, change_color_donut} = props;
  return (
    <SimpleCell
        disabled={disabled ? disabled : !onClick}
        key={key || id}
        onClick={!disabled ? onClick : undefined}
        description={
            special ? 
          <div className="top_moderator_desc">
            {good_answers + enumerate(good_answers, [' оценённый ответ', ' оценённых ответа', ' оценённых ответов'])}
          </div>
          :
          <div className="top_moderator_desc">
            {good_answers + enumerate(good_answers, [' хороший ответ, ', ' хороших ответа, ', ' хороших ответов, ']) 
            + bad_answers + enumerate(bad_answers, [' плохой ответ', ' плохих ответа', ' плохих ответов'])}
          </div>
        }
            before={diamond ?
                <div style={{position:'relative', marginRight: 10}}><Avatar src={avatar.url} style={{position: 'relative'}} />
                <Icon28DiamondOutline width={16} height={16} className='Diamond_top' />
                </div> : <Avatar src={avatar.url} style={{position: 'relative'}} /> }
          >
        <div className="top_moderator_name" style={{color: (donut && change_color_donut) ? "var(--top_moderator_name_donut)" : "var(--top_moderator_name)"}}>
        {nickname ? nickname : `Агент Поддержки #${id}`}
          <div className="top_moderator_name_icon">
          {flash && verified && 
            <Icon16FireVerified width={12} height={12} className="top_moderator_name_icon"/>}
          {flash && !verified && 
            <Icon16Fire width={12} height={12} className="top_moderator_name_icon"/>}
          </div>
          <div className="top_moderator_name_icon">
            {donut ? 
            <Icon16StarCircleFillYellow width={12} height={12} className="top_moderator_name_icon" /> : null}
          </div>
          <div className="top_moderator_name_icon_ver">
            {verified && !flash &&  
            <Icon16Verified className="top_moderator_name_icon_ver"/>}
          </div>
        </div>
        </SimpleCell>
    )
}