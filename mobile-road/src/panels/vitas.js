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

    class Vitas extends React.Component {
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
                Обучение Витька
                </PanelHeader>
                <FormLayout>
                    <FormLayoutGroup top="Суть проблемы">
                        <Input maxLength="80" type="text" name="title_new_tiket" value={props.state.title_new_tiket} onChange={(e) => props.onChange(e)}/>
                    </FormLayoutGroup>
                    <Textarea maxLength="2020" name="text_new_tiket" top="Подробнее о проблеме" onChange={(e) => props.onChange(e)}>
                        <Input maxLength="2020" type="text"  name="text_new_tiket" onChange={(e) => props.onChange(e)}/>
                    </Textarea>
                    <Button size="xl" level="secondary" stretched onClick={() => props.sendNewVitya()}>Отправить</Button>
                </FormLayout>
            </Panel>
            )
            }
        }
  
export default Vitas;