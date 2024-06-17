import React from 'react';
import CursorSVG from "@/public/assets/CursorSVG";

type Props = {
    color: string, x: number, y: number, message: string
}

export const Cursor = ({color, x, y, message}: Props) => {
    console.log(message, color);
    return (
        <div className="pointer-events-none absolute top-0 left-0"
             style={{transform: `translateX(${x}px) translateY(${y}px)`}}>
            <CursorSVG color={color}/>

            {message && (<div><p className="text-white">{message}</p></div>)}

        </div>

    );
}