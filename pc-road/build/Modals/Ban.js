"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalBan = void 0;
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const react_2 = require("react");
const config_1 = require("../config");
const Utils_1 = require("../Utils");
const react_redux_1 = require("react-redux");
const main_1 = require("../store/main");
const ModalBan = props => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const setActiveStory = (story) => dispatch(main_1.viewsActions.setActiveStory(story));
    const [time_val, setTimeVal] = (0, react_2.useState)('');
    const [time_num, setTimeNum] = (0, react_2.useState)('sec');
    const [reason, setReason] = (0, react_2.useState)('');
    const OtherProfileData = (0, react_redux_1.useSelector)((state) => (state.account.other_profile));
    const { setPopout, showErrorAlert, setActiveModal, showAlert } = props.callbacks;
    const userBan = (user_id, text, time) => {
        setPopout(<vkui_1.ScreenSpinner />);
        fetch(config_1.API_URL + "method=account.ban&" + window.location.search.replace('?', ''), {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'agent_id': user_id,
                'timeban': time,
                'reason': text,
            })
        })
            .then(res => res.json())
            .then(data => {
            if (data.result) {
                setActiveModal(null);
                showAlert('Успех', 'Пользователь забанен');
                setPopout(null);
            }
            else {
                showErrorAlert(data.error.message);
            }
        })
            .catch(err => {
            setActiveStory('disconnect');
        });
    };
    return (<vkui_1.ModalCard id='ban_user' onClose={props.onClose} icon={<vkui_1.Avatar src={OtherProfileData ? OtherProfileData['avatar']['url'] : null} size={72}/>} header="Забанить пользователя" actions={<vkui_1.Button mode='secondary' stretched size='l' onClick={() => {
                userBan(OtherProfileData ? OtherProfileData['id'] : 0, reason, (0, Utils_1.timeConvertVal)(time_val, time_num));
            }}>Заблокировать</vkui_1.Button>}>
      <vkui_1.FormLayout>
        <vkui_1.FormItem>
          <vkui_1.Input disabled value={OtherProfileData ? (OtherProfileData['id'] < 0) ? -OtherProfileData['id'] : OtherProfileData['id'] : null}/>
        </vkui_1.FormItem>

        <vkui_1.FormLayoutGroup mode='horizontal'>
          <vkui_1.FormItem>
            <vkui_1.Input maxLength="100" type='number' name="time_val" onChange={(e) => setTimeVal(e.currentTarget.value)} placeholder="Число" value={time_val}/>
          </vkui_1.FormItem>
          <vkui_1.FormItem status={time_num ? 'valid' : 'error'} bottom={time_num ? '' : 'А где время'}>
            <vkui_1.Select value={time_num} defaultValue='sec' options={[{ label: 'sec', value: 'sec' }, { label: 'min', value: 'min' }, { label: 'day', value: 'day' }]} renderOption={(_a) => {
            var { option } = _a, restProps = __rest(_a, ["option"]);
            return (<vkui_1.CustomSelectOption {...restProps}/>);
        }} onChange={e => { setTimeNum(e.currentTarget.value); }}/>
          </vkui_1.FormItem>
        </vkui_1.FormLayoutGroup>

        <vkui_1.FormItem>
          <vkui_1.Input maxLength="100" name="ban_reason" onChange={(e) => setReason(e.currentTarget.value)} placeholder="Введите причину бана" value={reason}/>
        </vkui_1.FormItem>
      </vkui_1.FormLayout>



    </vkui_1.ModalCard>);
};
exports.ModalBan = ModalBan;
