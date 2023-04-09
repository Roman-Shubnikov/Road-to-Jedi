import { Tappable, classNames } from '@vkontakte/vkui';
import React, { useEffect, useRef } from 'react';
import style from './icon.module.css';


export const PurchasedIcon = ({ icon_url, onClick, selected }: {icon_url: string, onClick: VoidFunction, selected: boolean}) => {
    const svgRef = useRef<null | HTMLDivElement>(null);
    useEffect(() => {
        fetch(icon_url)
        .then(r => r.text())
        .then(text => {
            const parser = new DOMParser();
            const svg = parser.parseFromString(text, "text/xml").getElementsByTagName('svg')[0];
            svg.setAttribute('color', 'var(--vkui--color_icon_accent)');
            if(svgRef.current){
                svgRef.current.appendChild(svg)
            }
            
        })
        .catch(() => {});
    }, [])
    return (
        <div className={style.icon__tap_zone}>
            <Tappable onClick={onClick} className={classNames(selected && style.selected)}>
                <div className={style.icon} ref={svgRef}></div>
            </Tappable>
        </div>
        
    )
}