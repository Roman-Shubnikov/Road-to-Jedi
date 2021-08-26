import { Icon16CheckCircle } from '@vkontakte/icons';
import { 
    Avatar,
    Button,
    CustomSelect,
    CustomSelectOption,
    FormItem,
    FormLayout,
    Group,
    Input,
    Panel,
    PanelHeader,
    PanelHeaderBack,
    Snackbar,

} from '@vkontakte/vkui';
import React, {useState} from 'react';
import { API_URL, JediIcons28 } from '../../../../config';
const blueBackground = {
    backgroundColor: 'var(--accent)'
  };
export default props => {
    const [color, setColor] = useState('');
    const [category, setCategory] = useState('');
    const [icon_select, setIcon] = useState('');
    const [snackbar, setSnackbar] = useState(null);
    const { showErrorAlert } = props.callbacks;
    const { goDisconnect } = props.navigation;
    
    const getItemsIcons = () => {
        let items = [];
        for(let key in JediIcons28){
            items.push({label: '', value: key, icon_id: key})
        }
        return items
    }
    const addCategory = () => {
        fetch(API_URL + "method=faq.addCategory&" + window.location.search.replace('?', ''),
        {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
              'title': category,
              'icon_id': icon_select,
              'color': color,
            })
          })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setColor('');
                setIcon('');
                setCategory('');
                setSnackbar(
                    <Snackbar
                      layout="vertical"
                      onClose={() => setSnackbar(null)}
                      before={<Avatar size={24} style={blueBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                    >
                      Категория успешно добавлена
                        </Snackbar>
                  )
            } else {
                showErrorAlert(data.error.message)
            }
            })
            .catch(goDisconnect)
    }
    return(
        <Panel id={props.id}>
            <PanelHeader left={<PanelHeaderBack onClick={() => window.history.back()} />}>
                Создай категорию
            </PanelHeader>
            <Group>
                <FormLayout>
                    <FormItem top="Категория">
                        <Input value={category} onChange={(e) => {setCategory(e.currentTarget.value)}} />
                    </FormItem>
                    <FormItem top="Введи цвет в HEX формате">
                        <Input value={color} onChange={(e) => {setColor(e.currentTarget.value)}} /> 
                    </FormItem>
                    <FormItem top="Выбери иконку">
                        <CustomSelect
                            placeholder="Не выбрана" 
                            options={getItemsIcons()}
                            renderOption={({ option, ...restProps }) => {
                                let Icon = JediIcons28[option.icon_id]
                                return(<CustomSelectOption {...restProps} before={<Icon style={{color: 'var(--accent)'}} />} />)
                            }}
                            value={icon_select}
                            onChange={(e) => {setIcon(e.currentTarget.value)}}
                         />
                    </FormItem>
                    <FormItem>
                        <Button size='l'
                        mode='primary'
                        type='submit'
                        stretched
                        onClick={() => {
                            addCategory()
                        }}
                        disabled={
                            !(category.length > 0 && color.length > 3)
                        }
                        >Добавить</Button>
                    </FormItem>
                    
                </FormLayout>
            </Group>
            {snackbar}
        </Panel>
    )
}