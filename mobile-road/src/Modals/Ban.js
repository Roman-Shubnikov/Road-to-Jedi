import React from 'react';
import { 
    ModalCard, 
    Select,
    Input,
    Avatar,
    ScreenSpinner,
    FormLayout,
    FormItem,
    Button,
    FormLayoutGroup,
    CustomSelectOption,
  } from '@vkontakte/vkui';


export default class Ban extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            time_val: '',
            time_num: 'sec',
            ban_reason: '',
            ban_infinit: true,

        }
        var propsbi = this.props.this;
        this.setPopout = propsbi.setPopout;
        this.showErrorAlert = propsbi.showErrorAlert;
        this.showAlert = propsbi.showAlert;
        this.setActiveModal = propsbi.setActiveModal;
        this.onChange = (event) => {
            var name = event.currentTarget.name;
            var value = event.currentTarget.value;
            this.setState({ [name]: value });
          }

    }
    timeConvert(val, num){
        let time = 0;
        if(num === 'sec'){
            time = Number(val);
        }else if(num === 'min'){
            time = val * 60;
        }else if(num === 'day'){
            time = val * 24 * 60 * 60;
        }
        return time
    }
    userBan(user_id, text, time) {
        this.setPopout(<ScreenSpinner/>)
        fetch(this.state.api_url + "method=account.ban&" + window.location.search.replace('?', ''),
        {method: 'post',
        headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
        body: JSON.stringify({
          'agent_id': user_id,
          'timeban': time,
          'reason': text,
  
      })
        })
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            this.setActiveModal(null);
            this.showAlert('Успех', 'Пользователь забанен');
            this.setPopout(null);
          }else {
            this.showErrorAlert(data.error.message)
          }
        })
        .catch(err => {
          this.changeData('activeStory', 'disconnect')
        })
      }
    render() {
        return (
              <ModalCard
                id='ban_user'
                onClose={this.props.onClose}
                icon={<Avatar src={this.props.other_profile ? this.props.other_profile['avatar']['url'] : null} size={72} />}
                header="Забанить пользователя"
                actions={
                  <Button mode='secondary' 
                  stretched size='l' 
                  onClick={() => {
                    this.userBan(this.props.other_profile ? this.props.other_profile['id'] : 0, this.state.ban_reason, this.timeConvert(this.state.time_val, this.state.time_num))
                  }}>Заблокировать</Button>
                }
              >
                <FormLayout>
                  <FormItem>
                    <Input disabled 
                    value={this.props.other_profile ? (this.props.other_profile['id'] < 0) ? -this.props.other_profile['id'] : this.props.other_profile['id'] : null}/>
                  </FormItem>
                  
                  <FormLayoutGroup mode='horizontal'>
                    <FormItem>
                      <Input maxLength="100"
                        type='number' 
                        name="time_val" 
                        onChange={(e) => this.onChange(e)} placeholder="Число" 
                        value={this.state.time_val} />
                    </FormItem>
                    <FormItem
                    status={this.state.time_num ? 'valid' : 'error'}
                    bottom={this.state.time_num ? '' : 'А где время'}>
                      <Select
                      defaultValue='sec'
                      options={[{label: 'sec', value: 'sec'},{label: 'min', value: 'min'}, {label: 'day', value: 'day'}]}
                      renderOption={({ option, ...restProps }) => (
                        <CustomSelectOption {...restProps} />
                      )}
                      onChange={e => {console.log(e.currentTarget.value); this.setState({time_num: e.currentTarget.value})}}
                      />
                    </FormItem>
                  </FormLayoutGroup>

                  <FormItem>
                    <Input maxLength="100" name="ban_reason" onChange={(e) => this.onChange(e)} placeholder="Введите причину бана" value={this.state.ban_reason} />
                  </FormItem>
                </FormLayout>
                
                
                
              </ModalCard>
        )
    }
}