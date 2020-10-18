import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import Avatar from '@vkontakte/vkui/dist/components/Avatar/Avatar';
import Cell from '@vkontakte/vkui/dist/components/Cell/Cell';
import Separator from '@vkontakte/vkui/dist/components/Separator/Separator';

import Icon12Fire from '@vkontakte/icons/dist/12/fire';
import Icon16Done from '@vkontakte/icons/dist/16/done';

    class Reader extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader>
                Топ
                </PanelHeader>                    

                  {props.state.top_agents.map(function(result, i) {
                    console.log(result)
                    return (
                    result['banned'] ? null :
                      <div key={i}>
                    <Cell
                  onClick={() => props.goOtherProfile(result['id'], true)}
                  description={
                    <div className="top_moderator_desc">
                    {result['good_answers'] +  " хороших ответов, " + result['bad_answers'] + " плохих ответов"}
                    </div>
                  }
                  size="l"
                  before={<Avatar src={result['avatar']['url']} size={56}/>}
                >
                  <div className="top_moderator_name">
                  {isFinite(result['nickname']) ? `Агент Поддержки #${result['nickname']}` : result['nickname'] ? result['nickname'] : `Агент Поддержки #${result['id']}`}
                    <div className="top_moderator_name_icon">{result['flash'] === true ? <Icon12Fire onClick={() => props.setActiveModal('prom')} className="top_moderator_name_icon"/> : result['verified'] === true ? <Icon16Done width={12} height={12} className="top_moderator_name_icon_ver"/>  : null }</div>
                  </div>
                    
                  </Cell>
                 <Separator></Separator>
                    
                    </div>
                    )
                  })}
            </Panel>
            )
            }
        }
  
export default Reader;