import React from 'react';
import './infoCounter.css';


export const InfoCounter = ({value, caption}: {value: string, caption: string}) => {
    return (
        <div className="infoCounter">
            <div className="infoCounter_counter">
                {value}
            </div>
            <div className="infoCounter_caption">
                {caption}
            </div>
        </div>
    )
}