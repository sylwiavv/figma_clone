"use client";

import {useOthers} from "@liveblocks/react/suspense";
import {LiveCursors} from "@/app/components/cursror/LiveCursors";
import {useMyPresence} from "@/app/liveblocks.config";
import React, {useCallback} from "react";

export const Live = () => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any

    // handlePointerMove --------------------------------------------------------
    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault()

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor: {x, y}})

    }, [])

    // handlePointerLeave --------------------------------------------------------
    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        event.preventDefault()

        updateMyPresence({cursor: null, message: null})
    }, [])

    // handlePointerDown --------------------------------------------------------
    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        event.preventDefault()

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor: {x, y}})
    }, [])
    return (
        <div onPointerMove={handlePointerMove}
             onPointerDown={handlePointerDown}
             onPointerLeave={handlePointerLeave}
             className="border-2 border-green-500 h-[100vh] w-full flex justify-center items-center text-center">
            <h1 className="text-2xl text-white">Liveblock fimga clone</h1>

            <LiveCursors others={others} />

        </div>
    );
}