"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalTransferCardNotify = exports.ModalTransferCard = exports.ModalTransfers = void 0;
const react_1 = __importStar(require("react")); // React
const vkui_1 = require("@vkontakte/vkui");
const icons_1 = require("@vkontakte/icons");
const config_1 = require("../config");
const ModalTransfers = ({ id, onClick, setActiveModal, reloadProfile, setPopout, goDisconnect, showErrorAlert, setTransfers }) => {
    const [comment, setComment] = (0, react_1.useState)('');
    const [to_agent, setAgent] = (0, react_1.useState)('');
    const [count, setCount] = (0, react_1.useState)('');
    const sendMoney = () => {
        setPopout(<vkui_1.ScreenSpinner />);
        fetch(config_1.API_URL + 'method=transfers.send&' + window.location.search.replace('?', ''), {
            method: 'post',
            headers: { "Content-type": "application/json; charset=UTF-8" },
            body: JSON.stringify({
                'summa': count,
                'send_to': to_agent,
                'comment': comment
            })
        })
            .then(data => data.json())
            .then(data => {
            if (data.result) {
                setTimeout(() => {
                    reloadProfile();
                    setPopout(null);
                    setTransfers(data.response);
                    setActiveModal("transfer_card");
                }, 2000);
            }
            else {
                showErrorAlert(data.error.message);
            }
        })
            .catch(goDisconnect);
    };
    const validateInputs = (title) => {
        if (title.length > 0) {
            let valid = ['error', 'Заполните это поле'];
            if (/^[a-zA-ZА-Яа-я0-9_ .,"'!?\-=+]*$/ui.test(title)) {
                valid = ['valid', ''];
            }
            else {
                valid = ['error', 'Поле не должно содержать спец. символы'];
            }
            return valid;
        }
        return ['default', ''];
    };
    return (<vkui_1.ModalCard id={id} onClose={onClick} icon={<icons_1.Icon56MoneyTransferOutline />} header="Сделать перевод">
          <vkui_1.FormLayout>
            <vkui_1.FormLayoutGroup mode='horizontal'>
              <vkui_1.FormItem status={validateInputs(to_agent)[0]} bottom={validateInputs(to_agent)[1]}>
                <vkui_1.Input maxLength="15" onChange={(e) => setAgent(e.currentTarget.value)} placeholder="Получатель" value={to_agent}/>
              </vkui_1.FormItem>
              <vkui_1.FormItem>
                <vkui_1.Input maxLength="5" type='number' onChange={(e) => setCount(e.currentTarget.value)} placeholder="Сумма" value={count}/>
              </vkui_1.FormItem>
            </vkui_1.FormLayoutGroup>
            
            <vkui_1.FormItem status={validateInputs(comment)[0]} bottom={validateInputs(comment)[1]}>
              <vkui_1.Input maxLength="100" name="money_transfer_comment" onChange={(e) => { setComment(e.currentTarget.value); console.log(e.currentTarget.value); }} placeholder="Комментарий" value={comment}/>
            </vkui_1.FormItem>
            <vkui_1.FormItem>
              <vkui_1.Button disabled={!to_agent || !count} size='l' stretched mode='secondary' type='submit' onClick={() => {
            setActiveModal(null);
            sendMoney();
        }}>Отправить</vkui_1.Button>
            </vkui_1.FormItem>
          </vkui_1.FormLayout>
        
      </vkui_1.ModalCard>);
};
exports.ModalTransfers = ModalTransfers;
const ModalTransferCard = ({ id, onClick, Transfers, setTransfers, setActiveModal }) => {
    return (<vkui_1.ModalCard id={id} onClose={onClick} icon={<vkui_1.Avatar src={Transfers ? Transfers.avatar : null} size={72}/>} header={Transfers ? "Ваш баланс: " + Transfers.money : null} subheader={Transfers ? Transfers.text : null} actions={<vkui_1.Button mode='secondary' size='l' stretched onClick={() => {
                setActiveModal(null);
                setTransfers(null);
            }}>Закрыть</vkui_1.Button>}>
      </vkui_1.ModalCard>);
};
exports.ModalTransferCard = ModalTransferCard;
const ModalTransferCardNotify = ({ id, onClick, Transfer }) => {
    return (<vkui_1.ModalCard id={id} onClose={onClick} icon={<vkui_1.Avatar src={Transfer.avatar} size={72}/>} header='Перевод ECoin' subheader={Transfer.comment} actions={<vkui_1.Button mode='secondary' stretched size='l' onClick={onClick}>Закрыть</vkui_1.Button>}/>);
};
exports.ModalTransferCardNotify = ModalTransferCardNotify;
