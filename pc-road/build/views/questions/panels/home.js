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
exports.Home = void 0;
const react_1 = __importStar(require("react"));
const vkui_1 = require("@vkontakte/vkui");
const soket_1 = require("../../../context/soket");
const react_redux_1 = require("react-redux");
const main_1 = require("../../../store/main");
const TICKETS_PER_PAGE = 100;
const Home = props => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { tickets, myTickets } = (0, react_redux_1.useSelector)(main_1.ticketSelector);
    const socket = (0, react_1.useContext)(soket_1.SocketContext);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    (0, react_1.useEffect)(() => {
        socket.on('TICKETS_CURR', (tickets) => {
            dispatch(main_1.ticketActions.setTickets(tickets.tickets));
            console.log(tickets);
        });
        socket.on('TICKETS_MY_REVIEW', (tickets) => {
            dispatch(main_1.ticketActions.setMyTickets(tickets));
        });
        socket.emit('TICKETS_GET', { offset: (currentPage - 1) * TICKETS_PER_PAGE });
        socket.emit('TICKETS_MY_REVIEW');
        return () => {
            socket.off('TICKETS_CURR');
        };
    }, [socket, dispatch, currentPage]);
    return (<vkui_1.Panel id={props.id}>
            {myTickets && !!myTickets.length && <vkui_1.Group>
                <TicketsList tickets={myTickets}/>
            </vkui_1.Group>}
            <vkui_1.Group>
                <TicketsList tickets={tickets}/>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                    <vkui_1.Pagination currentPage={currentPage} onChange={setCurrentPage} totalPages={(tickets === null || tickets === void 0 ? void 0 : tickets.count) ? Math.ceil(tickets.count / TICKETS_PER_PAGE) : 1}/>
                </div>
            </vkui_1.Group>

        </vkui_1.Panel>);
};
exports.Home = Home;
const TicketsList = ({ tickets }) => {
    return (<vkui_1.List>
            {!tickets && <vkui_1.PanelSpinner />}
            {tickets && !tickets.length &&
            <vkui_1.Placeholder>
                Здесь пока пусто
            </vkui_1.Placeholder>}
            {!!(tickets === null || tickets === void 0 ? void 0 : tickets.length) && tickets.map(v => <TicketPreview key={v.id} status={v.status} id={v.id}>
                    {v.title}
                </TicketPreview>)}
        </vkui_1.List>);
};
const TicketPreview = ({ id, children, status }) => {
    const getIconTicketByStatus = (status) => {
        switch (status) {
            case 0:
                return;
            case 1:
                return;
            case 2:
                return;
            case 3:
                return;
            case 4:
                return;
            case 5:
                return;
            default:
                return;
        }
    };
    return (<vkui_1.SimpleCell>
            {children}
        </vkui_1.SimpleCell>);
};
