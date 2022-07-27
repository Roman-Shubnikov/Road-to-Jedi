"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSearch = void 0;
const react_1 = require("react");
const useSearch = (callback) => {
    const typing = (0, react_1.useRef)(false);
    const lastTypingTime = (0, react_1.useRef)(0);
    const searchval = (0, react_1.useRef)('');
    const [search, setSearchRaw] = (0, react_1.useState)('');
    const setSearch = (text) => {
        updateTyping();
        searchval.current = text;
        setSearchRaw(text);
    };
    const updateTyping = () => {
        if (!typing.current) {
            typing.current = true;
        }
        lastTypingTime.current = (new Date()).getTime();
        setTimeout(() => {
            const typingTimer = (new Date()).getTime();
            const timeDiff = typingTimer - lastTypingTime.current;
            if (timeDiff >= 400 && typing.current) {
                typing.current = false;
                if (searchval.current.length === 0) {
                    callback(searchval.current);
                    return;
                }
                if (searchval.current.length <= 0)
                    return;
                callback(searchval.current);
            }
        }, 600);
    };
    return {
        setSearch,
        search,
    };
};
exports.useSearch = useSearch;
