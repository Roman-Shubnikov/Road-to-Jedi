"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IconManager = void 0;
const react_1 = __importDefault(require("react"));
function iconClass(fragments) {
    let res = '';
    for (let i = 0; i < fragments.length; i++) {
        res += ' ' + fragments[i];
    }
    return res;
}
const IconManager = props => {
    const { style, size = 28, width = size, height = size, viewBox, className = '' } = props.settings;
    const styles = Object.assign({}, style);
    const Classes = iconClass(['vkuiIcon', `vkuiIcon--${size}`, `Icon--w-${width}`, `Icon--h-${height}`, className]);
    return (<div ref={props.getRootRef} style={styles} className={Classes}>
            <svg width={width} height={height} viewBox={viewBox} style={{ fill: 'currentcolor', color: 'inherit' }} xmlns="http://www.w3.org/2000/svg">
                {props.children}
            </svg>
        </div>);
};
exports.IconManager = IconManager;
