import React from 'react';

import { 
    SimpleCell,
    Avatar,
    Counter,

    } from '@vkontakte/vkui';

import { enumerate, NicknameMenager } from '../Utils';
import { ProfileTags } from './ProfileTags';

const Forms = {
  good_answers: ['хороший ответ', 'хороших ответа', 'хороших ответов'],
  marked_answers: ['оценённый ответ', 'оценённых ответа', 'оценённых ответов'],
  bad_answers: ['плохой ответ', 'плохих ответа', 'плохих ответов'],
}

export default props => {
  const {disabled, description, nickname, good_answers, bad_answers, key, id, avatar, flash,donut,verified, onClick, change_color_donut, position, permissions} = props;
  return (
    <SimpleCell
        disabled={disabled ? disabled : !onClick}
        key={key || id}
        onClick={!disabled ? onClick : undefined}
        subtitle={
          description ? description :
          <div>
            {good_answers + " " + enumerate(good_answers, Forms.good_answers) + ", " 
            + bad_answers + " " + enumerate(bad_answers, Forms.bad_answers)}
          </div>
        }
            before={<Avatar shadow={false} src={avatar.url} alt='ava' style={{position: 'relative'}}>
              {position && <Counter style={{boxShadow: '0 2px 4px rgb(0 0 0 / 12%)',
                position: 'absolute', right: -2, bottom: -2, backgroundColor: 'var(--vkui--color_text_primary)', color: 'black'}}>{position}</Counter>}
              </Avatar> }
          >
        <div className="top_moderator_name" style={{color: (donut && change_color_donut) ? "var(--top_moderator_name_donut)" : "var(--top_moderator_name)"}}>
          <NicknameMenager 
          nickname={nickname}
          agent_id={id}
          perms={permissions} />
          <ProfileTags
          size='m'
          verified={verified}
          flash={flash}
          donut={donut} />
        </div>
        </SimpleCell>
    )
}