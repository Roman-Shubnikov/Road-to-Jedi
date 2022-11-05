import { useRef, useState } from "react"

export const useSearch = (callback) => {
    
    const typing = useRef(false);
    const lastTypingTime = useRef(0);
    const searchval = useRef('');
    
    const [search, setSearchRaw] = useState('');
    
    const setSearch = (text) => {
        updateTyping();
        searchval.current = text;
        setSearchRaw(text);
    }
    const updateTyping = () => {
        if(!typing.current){
            typing.current = true;
            
        }
        lastTypingTime.current = (new Date()).getTime();
        setTimeout(() => {
            const typingTimer = (new Date()).getTime();
            const timeDiff = typingTimer - lastTypingTime.current;
            if (timeDiff >= 400 && typing.current) {
                typing.current = false;
                if(searchval.current.length === 0) {
                    callback(searchval.current)
                    return;
                }
                if(searchval.current.length <= 0) return;
                callback(searchval.current)
            }
        }, 600)
    
    }
    return {
        setSearch,
        search,
        typing,
    }
}