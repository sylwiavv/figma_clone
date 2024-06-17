"use client";

import {LiveCursorProps} from "@/types/type";
import {Cursor} from "@/app/components/cursror/Cursor";
import {COLORS} from "@/constants";

export const LiveCursors = ({others}: LiveCursorProps) => {
    return others.map(({connectionId, presence}) => {
        if (!presence?.cursor) {
            return null
        }

        return <Cursor key={connectionId} color={COLORS[Number(connectionId) % COLORS.length]} x={presence.cursor.x}
                       y={presence.cursor.y}         message={presence.message}
        />
    })
}