"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoCell = void 0;
const react_1 = __importDefault(require("react"));
require("./infoCell.css");
const InfoCell = ({ children, name }) => {
    return (<div className='InfoCell'>
            <div className='InfoCell_name'>
                {name}  
            </div>
            <div className='InfoCell_children'>
                {children}
            </div>
        </div>);
};
exports.InfoCell = InfoCell;
