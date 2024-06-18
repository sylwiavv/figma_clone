import React from "react";
import {ReactionButton} from "@/app/components/reaction/ReactionButton";

type Props = {
    setReaction: (reaction: string) => void;
};

export default function ReactionSelector({setReaction}: Props) {
    return (
        <div
            className="absolute bottom-20 left-0 right-0 mx-auto w-fit transform rounded-full bg-white px-2"
            onPointerMove={(e) => e.stopPropagation()}
        >
            <ReactionButton reaction="👍" onSelect={setReaction}/>
            <ReactionButton reaction="🔥" onSelect={setReaction}/>
            <ReactionButton reaction="😍" onSelect={setReaction}/>
            <ReactionButton reaction="👀" onSelect={setReaction}/>
            <ReactionButton reaction="😱" onSelect={setReaction}/>
            <ReactionButton reaction="🙁" onSelect={setReaction}/>
        </div>
    );
}

