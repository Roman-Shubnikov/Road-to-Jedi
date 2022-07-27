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
exports.Answers = void 0;
const react_1 = __importStar(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const icons_1 = require("@vkontakte/icons");
const react_redux_1 = require("react-redux");
const main_1 = require("../../../store/main");
const Utils_1 = require("../../../Utils");
const hooks_1 = require("../../../hooks");
const unstable_1 = require("@vkontakte/vkui/dist/unstable");
const Answers = props => {
    const { fetchApi } = (0, hooks_1.useApi)();
    const { goTiket } = (0, hooks_1.useNavigation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const [activeTab, setActiveTab] = (0, react_1.useState)('moderation');
    const [searched, setSearched] = (0, react_1.useState)(null);
    const { myQuestions } = (0, react_redux_1.useSelector)((state) => state.account);
    const getMyQuestions = (0, react_1.useCallback)(() => {
        fetchApi("tickets.getByModeratorAnswers")
            .then(data => {
            dispatch(main_1.accountActions.setMyquestions(data));
        })
            .catch(e => { });
    }, [fetchApi, dispatch]);
    const tabClick = (tab) => {
        return {
            onClick: () => setActiveTab(tab),
            selected: activeTab === tab,
        };
    };
    const getFiltresQuestions = (0, react_1.useCallback)((questions) => {
        let filtredQuestions;
        if (!questions)
            return [];
        switch (activeTab) {
            case 'positive':
                filtredQuestions = questions.filter(({ mark }) => mark === 1);
                break;
            case 'negative':
                filtredQuestions = questions.filter(({ mark }) => mark === 0);
                break;
            case 'moderation':
                filtredQuestions = questions.filter(({ mark }) => mark === -1);
                break;
            default:
                filtredQuestions = questions.filter(({ mark }) => mark === 1);
        }
        return filtredQuestions;
    }, [activeTab]);
    const getIconsAnswers = (mark) => {
        switch (mark) {
            case 1:
                return <icons_1.Icon56CheckCircleOutline width={41} height={41} style={{ color: 'var(--clock_support_green)' }}/>;
            case 0:
                return <icons_1.Icon56ErrorTriangleOutline width={41} height={41} style={{ color: 'var(--warn)' }}/>;
            case -1:
                return <icons_1.Icon56RecentOutline width={41} height={41} style={{ color: 'var(--warn)' }}/>;
            default:
                return <icons_1.Icon56RecentOutline width={41} height={41}/>;
        }
    };
    (0, react_1.useEffect)(() => {
        setSearched(getFiltresQuestions(myQuestions));
    }, [myQuestions, getFiltresQuestions]);
    (0, react_1.useEffect)(() => {
        getMyQuestions();
    }, [getMyQuestions]);
    if (!searched)
        return (<vkui_1.Group>
            <vkui_1.PanelSpinner />
        </vkui_1.Group>);
    return (<vkui_1.Group>
            <vkui_1.Tabs>
                <vkui_1.TabsItem {...tabClick('moderation')}>
                    На модерации
                </vkui_1.TabsItem>
                <vkui_1.TabsItem {...tabClick('positive')}>
                    Положительные
                </vkui_1.TabsItem>
                <vkui_1.TabsItem {...tabClick('negative')}>
                    Отрицательные
                </vkui_1.TabsItem>
                <unstable_1.Dropdown content={<vkui_1.Calendar />}>
                    <vkui_1.IconButton className='gray' style={{ marginLeft: 'auto' }}>
                        <icons_1.Icon24CalendarOutline />
                    </vkui_1.IconButton>
                </unstable_1.Dropdown>
                
            </vkui_1.Tabs>
            <vkui_1.Separator className="sep-wide"/>
            <vkui_1.List>
            {searched.length > 0 ?
            searched.map((result, i) => <react_1.default.Fragment key={result.id}>
                    {(i === 0) || <vkui_1.Separator />}
                    <vkui_1.SimpleCell key={i} onClick={() => goTiket(result['ticket_id'])} description={'ответ добавлен ' + (0, Utils_1.getHumanyTime)(result.time).datetime} before={getIconsAnswers(result.mark)}>
                        Вы ответили на вопрос <vkui_1.Link disabled>№{result.id}</vkui_1.Link>
                    </vkui_1.SimpleCell>
                </react_1.default.Fragment>) :
            <vkui_1.Placeholder header='Отвечайте на вопросы' icon={<icons_1.Icon56ArchiveOutline />}>
                    Здесь будут отображаться ваши ответы после модерации. Через определенное время ответы уходят в архив
                </vkui_1.Placeholder>}
            </vkui_1.List>
        </vkui_1.Group>);
};
exports.Answers = Answers;
