"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketContext = exports.socket = void 0;
const react_1 = __importDefault(require("react"));
const socket_io_client_1 = __importDefault(require("socket.io-client"));
const config_1 = require("../config");
exports.socket = socket_io_client_1.default.connect(config_1.SOCKET_URL, {
    query: {
        url: window.location.search.replace('?', ''),
    }
});
exports.SocketContext = react_1.default.createContext();
