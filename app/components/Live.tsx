"use client";

import {LiveCursors} from "@/app/components/cursror/LiveCursors";
import React, {useCallback, useEffect, useState} from "react";
import {CursorChat} from "@/app/components/cursror/CursorChat";
import {CursorMode, CursorState, Reaction, ReactionEvent} from "@/types/type";
import {useMyPresence, useOthers,} from "@liveblocks/react";
import ReactionSelector from "@/app/components/reaction/ReactionSelector";
import FlyingReaction from "@/app/components/reaction/FlyingReaction";
import useInterval from "@/hooks/useInterval";
import {useBroadcastEvent, useEventListener} from "@/liveblocks.config";
import {Breadcrum} from "@/app/components/ui/breadcrum";

type Props = {
    canvasRef: React.MutableRefObject<HTMLCanvasElement | null>
}

export const Live = ({canvasRef} : Props) => {
    const others = useOthers();
    const [{cursor}, updateMyPresence] = useMyPresence() as any
    const [reaction, setReaction] = useState<Reaction[]>([])

    const [cursorState, setCursorState] = useState<CursorState>({mode: CursorMode.Hidden})

    // handlePointerMove --------------------------------------------------------
    const handlePointerMove = useCallback((event: React.PointerEvent) => {
        event.preventDefault()

        if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
            const x = event.clientX - event.currentTarget.getBoundingClientRect().x
            const y = event.clientY - event.currentTarget.getBoundingClientRect().y

            updateMyPresence({cursor: {x, y}})
        }

    }, [updateMyPresence])

    // handlePointerLeave --------------------------------------------------------
    const handlePointerLeave = useCallback((event: React.PointerEvent) => {
        // event.preventDefault()
        setCursorState({mode: CursorMode.Hidden})

        updateMyPresence({cursor: null, message: null})
    }, [updateMyPresence])

    // handlePointerDown --------------------------------------------------------
    const handlePointerDown = useCallback((event: React.PointerEvent) => {
        // event.preventDefault()

        const x = event.clientX - event.currentTarget.getBoundingClientRect().x
        const y = event.clientY - event.currentTarget.getBoundingClientRect().y

        updateMyPresence({cursor: {x, y}})

        setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? {
            ...state,
            isPressed: true
        } : state)
    }, [cursorState.mode, setCursorState])


    const handlePointerUp = useCallback((event: React.PointerEvent) => {
        setCursorState((state: CursorState) => cursorState.mode === CursorMode.Reaction ? {
            ...state,
            isPressed: true
        } : state)

    }, [cursorState.mode, setCursorState])


    const setReactions = useCallback((reaction: string) => {
        setCursorState({
            mode: CursorMode.Reaction, reaction, isPressed: false
        })
    }, [])

    const broadcast = useBroadcastEvent()

    // set reaction with emoji
    useInterval(() => {
        if(cursorState.mode === CursorMode.Reaction && cursorState.isPressed && cursor) {
            setReaction((reactions) => reactions.concat([
                {
                    point: {x: cursor.x, y: cursor.y},
                    value: cursorState.reaction,
                    timestamp: Date.now()
                }
            ]))

            broadcast({
                x: cursor.x,
                y: cursor.y,
                value: cursorState.reaction
            })
        }
    }, 100)

    useInterval(() => {
        setReaction((reaction) =>  reaction.filter((r ) => r.timestamp > Date.now() - 4000))
    }, 1000)

    useEventListener((eventData) => {
        const event = eventData.event as ReactionEvent

        setReaction((reactions) => reactions.concat([
            {
                point: {x: event.x, y: event.y},
                value: event.value,
                timestamp: Date.now()
            }
        ]))
    })

    useEffect(() => {
        const onKeyUp = (e: KeyboardEvent) => {
            if (e.key === "/") {
                setCursorState({
                    mode: CursorMode.Chat,
                    previousMessage: null,
                    message: ""
                })
            } else if (e.key === "Escape") {
                setCursorState({mode: CursorMode.Hidden})
                updateMyPresence({message: ""})
            } else if (e.key === "e") {
                setCursorState({
                    mode: CursorMode.ReactionSelector
                })
            }
        }

        const onKeyDown = (e: KeyboardEvent) => {
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
        <div id="canvas"
            onPointerMove={handlePointerMove}
             onPointerDown={handlePointerDown}
             onPointerLeave={handlePointerLeave}
             onPointerUp={handlePointerUp}
             className="h-[100vh] w-full flex justify-center items-center text-center">

            <canvas ref={canvasRef} />

            {reaction.map((r) =>
                <FlyingReaction key={r.timestamp.toString()}
                                x={r.point.x}
                                y={r.point.y}
                                timestamp={r.timestamp}
                                value={r.value}/>
            )}

            {cursor && (<CursorChat cursor={cursor}
                                    cursorState={cursorState}
                                    setCursorState={setCursorState}
                                    updateMyPresence={updateMyPresence}/>
            )}

            {cursorState.mode === CursorMode.ReactionSelector && (
                <ReactionSelector setReaction={setReactions}/>
            )}

            <LiveCursors others={others}/>
        </div>
    );
}