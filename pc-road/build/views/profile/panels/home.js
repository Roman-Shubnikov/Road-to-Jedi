"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Home = void 0;
const react_1 = __importDefault(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const Utils_1 = require("../../../Utils");
const hooks_1 = require("../../../hooks");
const components_1 = require("../../../components");
const config_1 = require("../../../config");
const units_1 = require("../units");
const Home = props => {
    const { account } = (0, hooks_1.useUser)();
    return (<vkui_1.Panel id={props.id}>
            <vkui_1.Group>
                {account ? <>
                <vkui_1.Div style={{ paddingBottom: 0 }}>
                    <vkui_1.Title level="2" style={{ marginBottom: 5 }}>
                        <div style={{ display: "flex" }}>
                            <Utils_1.NicknameMenager nickname={account.nickname} agent_id={account.id} perms={account.permissions}/>
                            <components_1.ProfileTags size='m' flash={account.flash} donut={account.donut} verified={account.verified}/>
                        </div>
                    </vkui_1.Title>
                    <vkui_1.Subhead weight="2" style={{ marginBottom: 16 }}>
                        {account.publicStatus || "Играю в любимую игру"}
                    </vkui_1.Subhead>
                </vkui_1.Div>
                <vkui_1.Separator />
                <vkui_1.Div>
                    <components_1.InfoCell name={'Дата регистрации:'}>
                        {(0, Utils_1.getHumanyTime)(account.registered).date}
                    </components_1.InfoCell>
                    <components_1.InfoCell name={'Цифровой ID:'}>
                        {'#' + account.id}
                    </components_1.InfoCell>
                </vkui_1.Div>
                <vkui_1.Separator className='sep-wide'/>
                <components_1.InfoArrows special={account.permissions >= config_1.PERMISSIONS.special} good_answers={account.good_answers} bad_answers={account.bad_answers} total_answers={account.total_answers}/>
            </> : <vkui_1.PanelSpinner />}
            </vkui_1.Group>

            <units_1.Answers />

        </vkui_1.Panel>);
};
exports.Home = Home;
