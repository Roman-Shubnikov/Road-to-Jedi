import React, {useEffect, useState} from 'react';
import {
    CellButton,
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelSpinner,
    Placeholder,
    Cell,

} from '@vkontakte/vkui';
import { 
    Icon56AdvertisingOutline,
    Icon28EditOutline

} from '@vkontakte/icons';
import { useDispatch, useSelector } from 'react-redux';
import { faqActions } from '../../../../store/main';
import { API_URL, PERMISSIONS } from '../../../../config';
export const QuestionsList = props => {
    const dispatch = useDispatch();
    const { activeCategory, questions } = useSelector((state) => state.Faq)
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const setQuestions = (questions) => dispatch(faqActions.setQuestions(questions));
    const { showErrorAlert, goPanel } = props.callbacks;
    const { account } = useSelector((state) => state.account)
    const { activeStory } = useSelector((state) => state.views)
    const { goDisconnect } = props.navigation;
    const permissions = account.permissions;
    const moderator_permission = permissions >= PERMISSIONS.admin;
    const goQuestion = (id) => {
        dispatch(faqActions.setActiveQuestion(id))
        goPanel(activeStory, 'faqQuestion', true)
    }
    const getQuestions = () => {
        fetch(API_URL + "method=faq.getQuestionsByCategory&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'category_id': activeCategory,
            })
          })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setQuestions(data.response)
                setLoading(false)
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(goDisconnect)
    }
    useEffect(() => {
        if(activeCategory !== null){
            getQuestions()
        }
        // eslint-disable-next-line
    }, [activeCategory])
    const delQuestion = (id) => {
        fetch(API_URL + "method=faq.delQuestion&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'question_id': id
            })
          })
        .then(res => res.json())
        .then(data => {
        if (data.result) {
            getQuestions()
        } else {
            showErrorAlert(data.error.message)
        }
        })
        .catch(goDisconnect)
    }
    const Questions = () => {
        if(!questions || loading) return <PanelSpinner />
        if(questions.length > 0){
            return <Group>{questions.map((res, i) => 
            <Cell
            multiline
            expandable
            removable={editing}
            onRemove={() => {
                delQuestion(res.id)
            }}
                    key={res.id}
                    onClick={() => goQuestion(res.id)}
                    >
                        {res.question}
                    </Cell>
            )}</Group>
        }else{
            return <Placeholder
            icon={<Icon56AdvertisingOutline />}>
                Пока данный раздел пустует. Мы уверены, скоро тут появятся вопросы.
            </Placeholder>
        }
    }
    return(
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Вопросы
            </PanelHeader>
            {moderator_permission && <Group>
                <CellButton before={<Icon28EditOutline />}
                    onClick={() => setEditing(pv => !pv)}>
                        {editing ? "Готово" : "Редактировать"}
                </CellButton>
            </Group>}
            
            {Questions()}
            
        </Panel>
    )
}