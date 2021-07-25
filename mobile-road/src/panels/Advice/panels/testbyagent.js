import React, { useState } from 'react';

import { 
    Button,
    Div,
    FormLayout,
    Group,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    SimpleCell,
    Text,
    ScreenSpinner,
    Title,
    FormStatus,
    Headline,

    } from '@vkontakte/vkui';
import { useDispatch } from 'react-redux';
import { API_URL } from '../../../config';
import { viewsActions } from '../../../store/main';
import { normalizeTime } from '../../../Utils/Helpers';

import Blockquote from '../../../components/Blockquote'

var timer_interval = null;

export default props => {
    const dispatch = useDispatch();
    const [currPage, setpage] = useState(0);
    const [currQuestion, setQuestion] = useState(0);
    const [anim, setAnim] = useState(false);
    const [answers, setAnswers] = useState({})
    const [finishPage, setFinishPage] = useState([false, '']);
    const [testData, setTestData] = useState(null);
    const [last_time, setLastTime] = useState(0);
    const { setPopout, showErrorAlert } = props.callbacks;
    const timer_menager = () => {
        let minutes = 0;
        let seconds = 0;
        minutes = Math.floor(last_time / 60);
        seconds = last_time % 60;
        return String(normalizeTime(minutes)) + ":" + String(normalizeTime(seconds));
    }
    const getQuestions = () => {
        setPopout(<ScreenSpinner />)
        fetch(API_URL + "method=tests.startTest&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'test_id': 1,
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setTestData(data.response.questions)
                    setpage(1);
                    setLastTime(data.response.time_test);
                    setPopout(null);
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                dispatch(viewsActions.setActiveStory('disconnect'))
            })
    }
    const sendAnswers = () => {
        setPopout(<ScreenSpinner />)
        fetch(API_URL + "method=tests.sendAnswers&" + window.location.search.replace('?', ''),
            {
                method: 'post',
                headers: { "Content-type": "application/json; charset=UTF-8" },
                body: JSON.stringify({
                    'answers': answers,
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.result) {
                    setFinishPage([data.response.passed, data.response.reason]);
                    setLastTime(0);
                    setpage(2);
                    setPopout(null);
                } else {
                    showErrorAlert(data.error.message)
                }
            })
            .catch(err => {
                dispatch(viewsActions.setActiveStory('disconnect'))
            })
    }
    const FixAnswer = (question, variant) => {
        setAnswers(prev => {prev[question] = variant;return prev});
        setAnim(true)
        if(currQuestion + 1 >= testData.length){
            sendAnswers();
            
        }else{
            setTimeout(() => {
                setQuestion(prev => prev + 1)
                setAnim(false)
            }, 1000)
        }
        
        
    }
    const getPage = () => {
        let greeting1 = "Хотите задавать вопросы сами для приложения?\n" +
        "Верный шаг! Но для начала Вам необходимо пройти тестирование.\n" +
        "На прохождение теста из 5 вопросов, даётся 10 минут. После нажатия кнопки «Пройти тест» у вас не будет возможности поставить время на паузу или что-то подобное.\n";
        let greeting2 = "Примерное оставшееся время будет показано на таймере ниже, но старайтесь пройти тест как можно быстрее.\n" +
                        "Если вы провалите тест, то сможете пересдать его только через 3 дня.\n" +
                        "Ну что, готовы? Тогда начинаем.";
        if(currPage === 0){
            return(
                <Group>
                    <Blockquote>
                        <p style={{marginTop:0}}>
                            {greeting1}
                        </p>
                        <p>
                            {greeting2}
                        </p>
                    </Blockquote>
                    <Div>
                        <Button
                        stretched
                        mode='primary'
                        size='l'
                        onClick={() => {
                            getQuestions();
                            timer_interval = setInterval(() => {
                                setLastTime(prev => {
                                    if(prev > 0){
                                        prev = prev - 1
                                    }else {
                                        prev = 0
                                        if(timer_interval !== null){
                                            clearInterval(timer_interval);
                                        }
                                    }
                                    return prev;
                                })
                            }, 1000)
                            
                        }}>
                            Пройти тест
                        </Button>
                    </Div>
                    
                </Group>
            )
        }else if(currPage === 1){
            return(
            <Group>
                <FormLayout className={anim && 'anim'} style={{transition: 'all 1s'}}>
                    <Div>
                        <Title level="3" weight="bold">
                            {currQuestion + 1}. {testData[currQuestion].question}
                        </Title>
                    </Div>
                    {testData[currQuestion].variants.map((res, i) => 
                    <SimpleCell onClick={() => FixAnswer(testData[currQuestion].id, res.id)}
                    disabled={anim}
                    multiline
                    key={i}>
                        {res.name}
                    </SimpleCell>
                    )}
                    
                </FormLayout>
                
            </Group>
            )
            
        }else if(currPage === 2){
            return(
            <Group>
                <Div>
                    <FormStatus mode={finishPage[0] ? 'default' : 'error'}>
                        {finishPage[1]}
                    </FormStatus>
                    {!finishPage[0] && <Text style={{whiteSpace: "pre-wrap", marginTop: 10}} weight='regular'>
                        Кажется, вы не справились с тестом. Не огорчайтесь! Приходите через 3 дня и пробуйте свои силы вновь.
                    </Text>}
                </Div>  
            </Group>
            )
        }
        
    }

    return(
        <Panel id={props.id}>
            <PanelHeader
                    left={<PanelHeaderBack onClick={() => window.history.back()} />}>Тестирование</PanelHeader>


            {getPage()}
            <Group>
                <Div 
                style={{textAlign: 'center', color: (last_time < 30) ? "var(--dynamic_red)" : "var(--dynamic_green)"}}
                className={(last_time < 30 && last_time > 0) ? 'blink2' : ''}>
                    <Headline>{timer_menager()}</Headline>
                </Div>
            </Group>
            
                
        </Panel>
    )
}