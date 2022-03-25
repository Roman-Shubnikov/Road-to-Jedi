import React from 'react';

function iconClass(fragments) {
    let res = '';
    for (let i = 0; i < fragments.length; i++) {
        res += ' ' + fragments[i];
    }
    return res;
  }

export const IconManager = props => {
    const {style, size=28, width=size, height=size, viewBox, className=''} = props.settings
    const styles = {width, height, ...style}
    const Classes = iconClass(['vkuiIcon', `vkuiIcon--${size}`, `Icon--w-${width}`, `Icon--h-${height}`, className])
    return(
        <div
        style={styles}
        className={Classes}>
            <svg 
            width={width} 
            height={height}
            viewBox={viewBox} style={{fill: 'currentcolor', color: 'inherit'}} xmlns="http://www.w3.org/2000/svg">
                {props.children}
            </svg>
        </div>
    
    )
}