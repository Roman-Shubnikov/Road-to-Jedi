import React from 'react';
import bridge from '@vkontakte/vk-bridge'; // VK Brige
import { 
    Panel,
    PanelHeader,
    Header,
    PanelHeaderBack,
    FormLayout,
    Input,
    Button,
    Snackbar,
    Avatar,
    PanelHeaderButton,
    FormItem,
    Group
    } from '@vkontakte/vkui';


import Icon20CancelCircleFillRed    from '@vkontakte/icons/dist/20/cancel_circle_fill_red';
import Icon16CheckCircle            from '@vkontakte/icons/dist/16/check_circle';
import Icon28ScanViewfinderOutline  from '@vkontakte/icons/dist/28/scan_viewfinder_outline';

const queryString = require('query-string');
const hash = queryString.parse(window.location.hash);

const greenBackground = {
    backgroundColor: 'var(--dynamic_green)'
  };
const platformname = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

var ignore_promo = false;
export default class Promocodes extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            api_url: "https://xelene.ru/road/php/index.php?",
            promo: '',
            snackbar: null,


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
        this.setSnack = (value) => {
            this.setState({snackbar: value})
          }
    }
    checkPromocode(promo){
        fetch(this.state.api_url + "method=shop.checkPromo&" + window.location.search.replace('?', ''),
        {method: 'post',
        headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
        body: JSON.stringify({
            'promocode': promo,
        })
          })
        .then(res => res.json())
        .then(data => {
          if(data.result) {
            this.setSnack(
                <Snackbar
                  layout="vertical"
                  onClose={() => this.setSnack(null)}
                  before={<Avatar size={24} style={greenBackground}><Icon16CheckCircle fill="#fff" width={14} height={14} /></Avatar>}
                >
                  Промокод действителен
                </Snackbar>
              )
            setTimeout(() => {
              this.props.this.ReloadProfile();
            }, 4000)
          } else {
            this.setSnack(
                <Snackbar
                layout="vertical"
                onClose={() => this.setSnack(null)}
                before={<Icon20CancelCircleFillRed width={24} height={24} />}
              >
                {data.error.message}
              </Snackbar>)
          }
        })
        .catch(err => {
          this.props.this.changeData('activeStory', 'disconnect')
        })
    }
    activatePromocode(promo){
        fetch(this.state.api_url + "method=shop.activatePromo&" + window.location.search.replace('?', ''),
        {method: 'post',
        headers: {"Content-type": "application/json; charset=UTF-8"},
            // signal: controllertime.signal,
        body: JSON.stringify({
            'promocode': promo,
        })
          })
        .then(res => res.json())
        .then(data => {
          if(data.result) {
              this.props.setMoneyPromo(data.response.cost)
              this.setActiveModal('valid_qr');
            setTimeout(() => {
              this.props.this.ReloadProfile();
            }, 4000)
          } else {
              if(data.error.error_code === 1015){
                this.setActiveModal('invalid_qr');
              }else{
                this.setSnack(
                    <Snackbar
                    layout="vertical"
                    onClose={() => this.setSnack(null)}
                    before={<Icon20CancelCircleFillRed width={24} height={24} />}
                >
                    {data.error.message}
                </Snackbar>)
              }
          }
        })
        .catch(err => {
          this.props.this.changeData('activeStory', 'disconnect')
        })
    }
    validatePromo(promo){
        let valid = ['default', '']
        if(promo.length >= 1){
            if(/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/ui.test(promo)){
                valid = ['valid', 'Промокод введён верно']
            }else{
                valid = ['error', 'Промокод введён неверно']
            }
        }
        return valid;
    }
    componentDidMount(){
        if(hash.promo && !ignore_promo){
            if(/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/ui.test(hash.promo)){
                this.setState({promo: hash.promo})
            }else{
                this.setSnack(
                    <Snackbar
                    layout="vertical"
                    onClose={() => this.setSnack(null)}
                    before={<Icon20CancelCircleFillRed width={24} height={24} />}
                  >
                    Некорректный QR-код
                  </Snackbar>)
            }
        }
    }

    render() {
        return(
            <Panel id={this.props.id}>
                <PanelHeader 
                    left={
                        <>
                        <PanelHeaderBack onClick={() => window.history.back()} />
                        {platformname ? <PanelHeaderButton onClick={() => {
                            setTimeout(() => {
                                bridge.send("VKWebAppOpenCodeReader")
                                .then(data => {
                                    data = data['code_data']
                                    if(/vk.com\/jedi_road_app/.test(data) && /#.*/.test(data)){
                                        let parse = queryString.parse(data.match(/#(.*)/)[1]);
                                        if(/^[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}$/ui.test(parse.promo)){
                                            this.setState({promo: parse.promo})
                                        }else{
                                            this.setSnack(
                                                <Snackbar
                                                layout="vertical"
                                                onClose={() => this.setSnack(null)}
                                                before={<Icon20CancelCircleFillRed width={24} height={24} />}
                                              >
                                                Некорректный QR-код
                                              </Snackbar>)
                                        }
                                        
                                        // this.setState({})
                                    }else{
                                        this.setSnack(
                                            <Snackbar
                                            layout="vertical"
                                            onClose={() => this.setSnack(null)}
                                            before={<Icon20CancelCircleFillRed width={24} height={24} />}
                                          >
                                            Некорректный QR-код
                                          </Snackbar>)
                                    }
                                    
                                })
                                .catch(err => {
                                    if(err.error_type){
                                        this.setSnack(
                                            <Snackbar
                                            layout="vertical"
                                            onClose={() => this.setSnack(null)}
                                            before={<Icon20CancelCircleFillRed width={24} height={24} />}
                                          >
                                            Вначале просканируйте QR-код
                                          </Snackbar>)
                                    }else{
                                    this.setSnack(
                                        <Snackbar
                                        layout="vertical"
                                        onClose={() => this.setSnack(null)}
                                        before={<Icon20CancelCircleFillRed width={24} height={24} />}
                                      >
                                        {err.error_data}
                                      </Snackbar>)
                                    }
                                })
                            })
                            
                        }}><Icon28ScanViewfinderOutline /></PanelHeaderButton> : null}
                        </>
                }>
                    Активация
                </PanelHeader>
                <Group header={<Header>Активировать промокод</Header>}>
                  <FormLayout>
                    <FormItem>
                      <Input 
                      top='Введите промокод и получите монетки, которые можно потратить на товары в магазине.'
                      maxLength="14" 
                      name="promo"
                      status={this.validatePromo(this.state.promo)[0]}
                      bottom={this.validatePromo(this.state.promo)[1]}
                      onChange={(e) => this.onChange(e)} 
                      placeholder="XXXX-XXXX-XXXX" 
                      value={this.state.promo} />
                    </FormItem>
                    <FormItem>
                      <Button size='l'
                      stretched
                      type='submit'
                      mode='primary'
                      onClick={() => {
                          this.activatePromocode(this.state.promo);
                      }} 
                      disabled={!(this.validatePromo(this.state.promo)[0] === 'valid')}
                      >Активировать</Button>
                    </FormItem>
                  </FormLayout>
                </Group>
                <Group header={<Header>Проверить промокод</Header>}>
                  <FormLayout>
                    <FormItem>
                      <Input 
                      top='Введите промокод и проверьте его. Если он действителен, то любой пользователь может его ввести.'
                      maxLength="14" 
                      name="promo"
                      status={this.validatePromo(this.state.promo)[0]}
                      bottom={this.validatePromo(this.state.promo)[1]}
                      onChange={(e) => this.onChange(e)} 
                      placeholder="XXXX-XXXX-XXXX" 
                      value={this.state.promo} />
                    </FormItem>
                    <FormItem >
                      <Button size='l'
                      mode='secondary'
                      type='submit'
                      stretched
                      onClick={() => {
                          this.checkPromocode(this.state.promo);
                      }} 
                      disabled={!(this.validatePromo(this.state.promo)[0] === 'valid')}
                      >Проверить</Button>
                    </FormItem>
                  </FormLayout>
                </Group>
                
                
                {this.state.snackbar}
            </Panel>
        )
    }
}
