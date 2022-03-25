import React, {useEffect, useState} from 'react';
import { 
    Icon28AddOutline,
    Icon56AdvertisingOutline,
    Icon28EditOutline,
    Icon56DocumentOutline,

} from '@vkontakte/icons';
import {
    Button,
    Cell,
    CellButton,
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    PanelSpinner,
    Placeholder,
    Search,
    SimpleCell,

} from '@vkontakte/vkui';

import { useDispatch, useSelector } from 'react-redux';
import { API_URL, JediIcons28, LINKS_VK, PERMISSIONS } from '../../../../config';
import { faqActions } from '../../../../store/main';
let lastTypingTime;
let typing = false;
let searchval = '';

export const FaqMain = props => {
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState(false);
    const { categories, searchResult } = useSelector((state) => state.Faq)
    const setCategories = (categories) => dispatch(faqActions.setCategories(categories))
    const setSearchResult = (questions) => dispatch(faqActions.setSearchResultQuestions(questions))
    const { showErrorAlert, goPanel } = props.callbacks;
    const { account } = useSelector((state) => state.account)
    const { goDisconnect } = props.navigation;
    const { activeStory } = useSelector((state) => state.views)
    const permissions = account.permissions;
    const moderator_permission = permissions >= PERMISSIONS.admin;

    const getCategories = () => {
        fetch(API_URL + "method=faq.getCategories&" + window.location.search.replace('?', ''))
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setCategories(data.response)
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(goDisconnect)
    }
    const delCategory = (id) => {
        fetch(API_URL + "method=faq.delCategory&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'category_id': id
            })
          })
        .then(res => res.json())
        .then(data => {
        if (data.result) {
            getCategories()
        } else {
            showErrorAlert(data.error.message)
        }
        })
        .catch(goDisconnect)
    }
    const getSearchQuestions = () => {
        if(searchval.length <= 0) return;
        fetch(API_URL + "method=faq.getQuestionByName&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'name': searchval
            })
          })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setSearchResult(data.response)
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(goDisconnect)
    }
    const updateTyping = () => {
        if(!typing){
            typing = true;
            
        }
        lastTypingTime = (new Date()).getTime();
        setTimeout(() => {
            const typingTimer = (new Date()).getTime();
            const timeDiff = typingTimer - lastTypingTime;
            if (timeDiff >= 400 && typing) {
                typing = false;
                if(searchval.length === 0) {setSearchResult(null); return;}
                if(searchval.length <= 0) return;
                getSearchQuestions()
            }
        }, 600)

    }
    const goCategory = (id) => {
        dispatch(faqActions.setActiveCategory(id))
        goPanel(activeStory, 'faqQuestions', true)

    }
    const goQuestion = (id) => {
        dispatch(faqActions.setActiveQuestion(id))
        goPanel(activeStory, 'faqQuestion', true)
    }
    const Searched = () => {
        if(!searchResult) return <PanelSpinner />
        if(searchResult.length > 0){
            return searchResult.map((res, i) => 
            <SimpleCell
            expandable
            multiline
            key={res.id}
            onClick={() => goQuestion(res.id)}
            >
                {res.question}
            </SimpleCell>)
        }else{
            return <Placeholder
            icon={<Icon56DocumentOutline />}
            header="Вопрос не найден"
            action={
            <Button href={LINKS_VK.support_jedi} 
            target="_blank"
            rel="noopener noreferrer">
                Задать вопрос
            </Button>}>
                Внимательно изучите свой вопрос на корректность, иногда могут прокрасться орфографические ошибки.
            </Placeholder>
        }
    }

    const Categories = () => {
        if(!categories) return <PanelSpinner />
        if(categories.length > 0){
            let category_render = [];
            categories.forEach((item, i) => {
                let Icon = JediIcons28[item.icon_id]
                category_render.push(
                    <Cell
                    expandable
                    multiline
                    removable={editing}
                    onRemove={() => {
                        delCategory(item.id)
                    }}
                    key={item.id}
                    onClick={() => goCategory(item.id)}
                    before={<Icon style={{color: item.color}} />}
                    >
                        {item.title}
                    </Cell>
                )
            });
            return category_render;
        }else{
            return <Placeholder
            icon={<Icon56AdvertisingOutline />}>
                Пока данный раздел пустует. Мы уверены, скоро тут появятся вопросы.
            </Placeholder>
        }
    }

    useEffect(() => {
        getCategories()
        // eslint-disable-next-line
    },[])

    return(
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Поддержка
            </PanelHeader>
            <Group>
                <Search value={search} placeholder='Поиск вопроса'
                onChange={(e) => {updateTyping();
                            searchval = e.currentTarget.value
                            setSearch(e.currentTarget.value)}} />
                {moderator_permission && <><CellButton before={<Icon28AddOutline />}
                    onClick={() => goPanel(activeStory, 'faqCreateCategory', true)}>
                        Добавить категорию
                </CellButton>
                
                <CellButton before={<Icon28AddOutline />}
                onClick={() => goPanel(activeStory, 'faqCreateQuestion', true)}>
                    Добавить вопрос
                </CellButton>
                <CellButton before={<Icon28EditOutline />}
                    onClick={() => setEditing(pv => !pv)}>
                        {editing ? "Готово" : "Редактировать"}
                </CellButton></>}
                {search.length > 0 ? Searched() : Categories()}
                
            </Group>
            
        </Panel>
    )
}