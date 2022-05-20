import React, { useCallback, useState } from 'react';

import { 
    Panel,
    PanelHeader,
    ScreenSpinner,
    PanelHeaderBack,
    FormLayout,
    Radio,
    Textarea,
    Button,
    FormItem,
    Group,
    Alert,

    } from '@vkontakte/vkui';
import { API_URL } from '../config';
import { useDispatch, useSelector } from 'react-redux';
import { viewsActions } from '../store/main';

const reasons = [
    "Оскорбление",
    "Порнография",
    "Введение в заблуждение",
    "Реклама",
    "Вредоносные ссылки",
    "Сообщение не по теме",
    "Издевательство",
    "Другое",
]
export default props => {
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const [typeReport, setTyperep] = useState('');
    const {source: sourceReport, type_rep: nameReport} = useSelector(state => state.Reports)
    
    const setActiveStory = useCallback((story) => dispatch(viewsActions.setActiveStory(story)), [dispatch])
    const { setPopout, showErrorAlert } = props.callbacks;
    const sendReport = () => {
        setPopout(<ScreenSpinner />)
        fetch(API_URL + "method=reports.send&" + window.location.search.replace('?', ''),
            {method: 'post',
                headers: {"Content-type": "application/json; charset=UTF-8"},
                    // signal: controllertime.signal,
                body: JSON.stringify({
                    'type': nameReport, // Место нахождение материала
                    'name': Number(typeReport), // Причина
                    'id_rep': sourceReport, 
                    'comment': comment,
                })
                })
                .then(res => res.json())
                .then(data => {
                if(data.result) {
                    setPopout(<Alert 
                        actionsLayout="horizontal"
                        actions={[{
                            title: 'Закрыть',
                            autoclose: true,
                            mode: 'cancel'
                        }]}
                        onClose={() => window.history.back()}
                        header="Принято!"
                        text="Ваша жалоба будет рассмотрена модераторами в ближайшее время."
                    />)
                }else{
                    showErrorAlert(data.error.message)
                }
                })
                .catch(err => {
                    setActiveStory('disconnect')
                })
        }
        const validateComment = (title) => {
            if(title.length > 0){
              let valid = ['error', 'Текст должен быть не больше 200 и не меньше 6 символов' ];
              if(title.length <= 2000 && title.length > 5){
                if(/^[a-zA-ZА-Яа-я0-9_ё .,"':!?*+=-]*$/ui.test(title)){
                  valid = ['valid', '']
                }else{
                  valid = ['error', 'Текст не должен содержать спец. символы'];
                }
              }

              return valid
            }else{
                if(typeReport === "8") return ['error', 'При указании причины "Другое", обязательно укажите комментарий']
            }
            return ['default', '']

          }
    return (
        <Panel id={props.id}>
        <PanelHeader 
            left={
                <PanelHeaderBack onClick={() => window.history.back()}></PanelHeaderBack>
            }>
                Жалоба
        </PanelHeader>
        <Group>
            <FormLayout>
                {reasons.map((res, i) => 
                    <Radio name="typerep"
                    key={i}
                        onChange={(e) => setTyperep(e.currentTarget.value)}
                        defaultChecked={i === 0}
                        value={String(i + 1)}>{res}</Radio>
                )}

                <FormItem 
                top='Комментарий модератору'
                bottom={validateComment(comment)[1]}
                status={validateComment(comment)[0]}>
                    <Textarea  
                    name='comment' 
                    placeholder='Комментарий...'
                    maxLength="200"
                    onChange={(e) => {setComment(e.currentTarget.value)}} 
                    value={comment} />
                </FormItem>
                <FormItem>
                    <Button 
                    disabled={(validateComment(comment)[0] === 'error') ||
                     (comment === "" && typeReport === "8") || 
                     (typeReport !== "8" ? false : validateComment(comment)[0] !== 'valid')}
                    size='l'
                    stretched
                    type='submit'
                    onClick={() => {
                        sendReport()
                    }}>
                        Отправить жалобу
                    </Button>
                </FormItem>
            </FormLayout>
        </Group>  
    </Panel>
    )
}