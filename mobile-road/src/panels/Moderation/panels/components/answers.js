import React, { useEffect, useState } from 'react';

import { 
    Group,
    Div,
    FormStatus,
    SimpleCell,
    Placeholder,
    InfoRow,
    Progress,
    PullToRefresh,
    Button,
    Footer,
    List,
    PanelSpinner,

    } from '@vkontakte/vkui';
import {
  Icon24Spinner,
  Icon56InboxOutline,
  Icon28RecentOutline,
} from '@vkontakte/icons';
import { useSelector } from 'react-redux';
import { enumerate } from '../../../../Utils';
import { SPECIAL_NORM } from '../../../../config';
import { GreenCard } from '../../../../components/GreenCard';
import { useNavigation } from '../../../../hooks';

export const Answers = props => {
  
  const [fetching, setFetching] = useState(false);
  const {
    account
  } = useSelector((state) => state.account);
  const { answers } = useSelector((state) => state.moderation.moderationData);
  const { getInfo, goTiket } = props.callbacks;
  const { setActiveModal } = useNavigation();

  const colorHandler = (num) => {
    let styles = {};
    let num_style = 1
    if (num > 0 && num <= 5) {
      styles = {
        color: 'var(--clock_support_green)',
      };
      num_style = 1
    } else if (num >= 6 && num <= 10) {
      styles = {
        color: 'var(--dynamic_orange)',
      };
      num_style = 2
    } else if (num >= 11) {
      styles = {
        color: 'var(--dynamic_red)',
      };
      num_style = 3
    }
    return [styles, num_style];
  }
  useEffect(() => {
    if (!answers.data){
      getInfo('answers')
    }
    
    // eslint-disable-next-line
  }, [])

  return (
    <>
      {(account.marked !== null && account.marked !== undefined) ?
        <Group>
          <Div>
            <FormStatus onClick={() => setActiveModal('answers')}>
              <div style={{ textAlign: 'center', color: "var(--text_profile)", marginBottom: 15 }}>
                Вы оценили <span style={{ color: 'var(--header_text)' }}>{account.marked} {enumerate(account.marked, ['ответ', 'ответа', 'ответов'])}</span> Агентов Поддержки
              </div>
              <InfoRow>
                <Progress
                  value={account.marked ? account.marked / SPECIAL_NORM * 100 : 0} />
                <div style={{ textAlign: 'right', color: "var(--text_profile)", marginTop: 10, fontSize: 13 }}>{SPECIAL_NORM}</div>
              </InfoRow>
            </FormStatus>
          </Div>
          <Div style={{paddingTop: 0}}>
            <GreenCard header='Обратите внимание'>
              Ответы, что Вы прочтете ниже вызывают приступы тошноты, кровотечения из глаз, делая ваше лицо сложнее,
                чем ребусы, которые составляли ногами японские монахи под дагестанским гашишем
            </GreenCard>
          </Div>
          

        </Group>

        : null}
      <>
      <PullToRefresh onRefresh={() => { setFetching(true); getInfo('answers'); setTimeout(() => setFetching(false), 500) }} isFetching={fetching}>
        <Group>
          <List>
            {answers.data ? (answers.data.length > 0) ? answers.data.map((result, i) =>
              <React.Fragment key={result.id}>
                <SimpleCell
                  onClick={() => goTiket(result.id)}
                  expandable
                  before={<Icon28RecentOutline className={(colorHandler(result.count_unmark)[1] === 3) ? 'blink2' : ''} width={34} height={34} style={colorHandler(result.count_unmark)[0]} />}
                  subtitle={result.count_unmark + " " + enumerate(result.count_unmark, [' неоценённый ответ', ' неоценённых ответа', ' неоценённых ответов'])}>
                  Вопрос #{result.id}
                </SimpleCell>
              </React.Fragment>
            ) : <Placeholder
              icon={<Icon56InboxOutline />}>
              Нет ни одного ответа
                      </Placeholder> : <PanelSpinner />}
          </List>
        </Group>

        {answers.data_helper ? answers.data_helper.length === 20 ?
          <Div>
            <Button size="l"
              stretched
              level="secondary"
              before={fetching ? <Icon24Spinner width={28} height={28} className='Spinner__self' /> : null}
              onClick={() => { setFetching(true); getInfo('answers', true); setTimeout(() => setFetching(false), 500) }}>Загрузить ещё</Button>
          </Div>
          : answers.data ?
            (answers.data.length === 0) ? null : <Footer>{answers.data.length} {enumerate(answers.data.length, [' вопрос', ' вопроса', ' вопросов'])} всего</Footer>
            : null :
          null}
      </PullToRefresh></>
    </>
  )
}