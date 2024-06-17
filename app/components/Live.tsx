"use client";

import {LiveCursors} from "@/app/components/cursror/LiveCursors";
import React, {useCallback, useEffect, useState} from "react";
import {CursorChat} from "@/app/components/cursror/CursorChat";
import {CursorMode} from "@/types/type";
import {
    useMyPresence,
    useOthers,
} from "@liveblocks/react";

export const Live = () => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any

    const [cursorState, setCursorState] = useState({mode: CursorMode.Hidden})

    // handlePointerMove --------------------------------------------------------
    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault()

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor: {x, y}})

    }, [updateMyPresence])

    // handlePointerLeave --------------------------------------------------------
    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        // event.preventDefault()
        setCursorState({mode: CursorMode.Hidden})

        updateMyPresence({cursor: null, message: null})
    }, [updateMyPresence])

    // handlePointerDown --------------------------------------------------------
    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        event.preventDefault()

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor: {x, y}})
    }, [updateMyPresence])

    useEffect(() => {
        const onKeyUp = (e: React.KeyboardEvent) => {
            if (e.key === "/") {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ""
                })
            } else if (
                e.key === "Escape"
            ) {
                setCursorState({mode: CursorMode.Hidden})
                updateMyPresence({message: ""})
            }
        }

        const onKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "/") {
                e.preventDefault()
            }
        }

        window.addEventListener("keyup", onKeyUp)
        window.addEventListener("keydown", onKeyDown)

        return () => {
            window.removeEventListener("keyup", onKeyUp)
            window.removeEventListener("keydown", onKeyDown)
        }
    }, [updateMyPresence])

    return (
        <div onPointerMove={handlePointerMove}
             onPointerDown={handlePointerDown}
             onPointerLeave={handlePointerLeave}
             className="border-2 border-green-500 h-[100vh] w-full flex justify-center items-center text-center">
            <h1 className="text-2xl text-white">Liveblock fimga clone</h1>

            {cursor && (<CursorChat cursor={cursor}
                                    cursorState={cursorState}
                                    setCursorState={setCursorState}
                                    updateMyPresence={updateMyPresence}/>
            )}

            <LiveCursors others={others}/>
        </div>
    );
}