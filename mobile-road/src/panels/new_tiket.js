import React from 'react';

import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import PanelHeaderButton from '@vkontakte/vkui/dist/components/PanelHeaderButton/PanelHeaderButton';
import FormLayout from '@vkontakte/vkui/dist/components/FormLayout/FormLayout';
import FormLayoutGroup from '@vkontakte/vkui/dist/components/FormLayoutGroup/FormLayoutGroup';
import Input from '@vkontakte/vkui/dist/components/Input/Input';
import Textarea from '@vkontakte/vkui/dist/components/Textarea/Textarea';
import Button from '@vkontakte/vkui/dist/components/Button/Button';


import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

    class Reader extends React.Component {
        constructor(props) {
            super(props);
        }

        render() {
            var props = this.props.this; // для более удобного использования.
            return (
                <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                    <PanelHeaderButton onClick={() => window.history.back()}> 
                    <Icon24BrowserBack/>
                    </PanelHeaderButton>
                    }>
                Новый вопрос
                </PanelHeader>
                <FormLayout>
                    <FormLayoutGroup top={props.state.title_new_tiket === null ? "Суть проблемы (0/30). Не менее 5 символов" : "Суть проблемы (" + props.state.title_new_tiket.length + "/80). Не менее 5 символов"}>
                        <Input maxLength="80" type="text" name="title_new_tiket" value={props.state.title_new_tiket} onChange={(e) => props.onChange(e)}/>
                    </FormLayoutGroup>
                    <Textarea maxLength="2020" name="text_new_tiket" top={props.state.text_new_tiket === null ? "Подробнее о проблеме (0/2020). Не менее 5 символов" : "Подробнее о проблеме (" + props.state.text_new_tiket.length + "/2020). Не менее 5 символов"} onChange={(e) => props.onChange(e)}>
                        <Input value={props.state.text_new_tiket} maxLength="2020" type="text"  name="text_new_tiket" onChange={(e) => props.onChange(e)}/>
                    </Textarea>
                    <Button 
                    size="xl" 
                    level="secondary" 
                    stretched 
                    disabled={!Boolean(props.state.text_new_tiket.length > 5) || !Boolean(props.state.title_new_tiket.length > 5)}
                    onClick={
                        () => {
                            props.sendNewTiket();
                        }
                    }>Отправить</Button>
                </FormLayout>
            </Panel>
            )
            }
        }
  
export default Reader;