"use client";

import { ReactNode } from "react";
import {
    LiveblocksProvider,
    RoomProvider,
    ClientSideSuspense,
} from "@liveblocks/react/suspense";
import Loader from "@/app/components/Loader";

export function Room({ children }: { children: ReactNode }) {
    const publicApiKey = process.env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY;

    return (
        <LiveblocksProvider publicApiKey={publicApiKey as string}>
            <RoomProvider id="my-room" initialPresence={{}}>
                <ClientSideSuspense fallback={<Loader />}>
                    {children}
                </ClientSideSuspense>
            </RoomProvider>
        </LiveblocksProvider>
    );
}