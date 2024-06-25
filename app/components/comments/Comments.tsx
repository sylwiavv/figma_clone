"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import {CommentsOverlay} from "@/app/components/comments/CommentsOverlay";


export const Comments = () => (
      <ClientSideSuspense fallback={null}>
        {() => <CommentsOverlay />}
      </ClientSideSuspense>
);
