import React, { useState} from 'react';
import { 
    Avatar,
    Button,
    FormItem,
    FormLayout,
    Group,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Snackbar,
    Textarea,
    CustomSelectOption,
    Checkbox,
    CustomSelect

} from '@vkontakte/vkui';

import { API_URL, JediIcons28 } from '../../../../config';
import { Icon16CheckCircle } from '@vkontakte/icons';
import { useSelector } from 'react-redux';
const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default props => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [snackbar, setSnackbar] = useState(null);
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [category_id, setCategory_id] = useState('');
    const { categories } = useSelector((state) => state.Faq)
    const { showErrorAlert, setActiveStory } = props.callbacks;
    const addQuestion = () => {
        fetch(API_URL + "method=faq.addQuestion&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'category_id': category_id,
                'question': question,
                'answer': answer,
                'ismarkable': check2,
                'support_need': check1,
            })
          })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setQuestion('')
                setAnswer('')
                setCategory_id('')
                
                setSnackbar(
                    <Snackbar
                      layout="vertical"
                      onClose={() => setSnackbar(null)}
                      before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                    >
                        Вопрос успешно добавлен
                        </Snackbar>
                  )
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(err => {
                setActiveStory('disconnect')

            })
    }
    return(
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Создай вопрос
            </PanelHeader>

            <Group>
                <FormLayout>
                    <FormItem top="Вопрос">
                        <Input value={question} onChange={(e) => {setQuestion(e.currentTarget.value)}} />
                    </FormItem>
                    <FormItem top="Ответ">
                        <Textarea value={answer} onChange={(e) => {setAnswer(e.currentTarget.value)}} />
                    </FormItem>
                    
                    <FormItem>
                        <CustomSelect
                            placeholder="Не выбрана" 
                            options={categories.map((res, i) => ({label: res.title, value: res.id, icon_id: res.icon_id, color_icon: res.color}))}
                            renderOption={({ option, ...restProps }) => {
                                let Icon = JediIcons28[option.icon_id]
                                return(<CustomSelectOption {...restProps} before={<Icon style={{color: option.color_icon}} />} />)
                            }}
                            value={category_id}
                            onChange={(e) => {setCategory_id(e.currentTarget.value)}}
                         />
                    </FormItem>
                    <Checkbox checked={check2} onChange={() => setCheck2(prev => !prev)}>
                        Разрешить оценивать вопрос
                    </Checkbox>
                    <Checkbox checked={check1} onChange={() => setCheck1(prev => !prev)}>
                        Добавить в вопрос кнопку обращения в поддержку
                    </Checkbox>
                    <FormItem>
                        <Button size='l'
                        mode='primary'
                        type='submit'
                        stretched
                        onClick={() => {
                            addQuestion()
                        }}
                        >Добавить</Button>
                    </FormItem>
                </FormLayout>
            </Group>
            {snackbar}
        </Panel>
    )
}