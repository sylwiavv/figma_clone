"use client";

import {ReactNode} from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/app/components/Loader";
import {Presence} from "@/types/type";
import {LiveMap} from "@liveblocks/client";

export function Room({children}: { children: ReactNode }) {
    const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

    const initialPresence: Presence = {
        cursor: null,
        cursorColor: null,
        editingText: null,
    };

    return (
        <LiveblocksProvider publicApiKey={publicApiKey as string}>
            <RoomProvider id="my-room" initialPresence={initialPresence} initialStorage={{canvasObjects: new LiveMap()}}>
                <ClientSideSuspense fallback={<Loader/>}>
                    {() => children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}