"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoCounter = void 0;
const react_1 = __importDefault(require("react"));
require("./infoCounter.css");
const InfoCounter = ({ value, caption }) => {
    return (<div className="infoCounter">
            <div className="infoCounter_counter">
                {value}
            </div>
            <div className="infoCounter_caption">
                {caption}
            </div>
        </div>);
};
exports.InfoCounter = InfoCounter;
