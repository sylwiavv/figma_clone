import React from "react";
import {Reaction} from "@/types/type";

export const ReactionButton = ({
                            reaction,
                            onSelect,
                        }: {
    reaction: Reaction;
    onSelect: (reaction: Reaction) => void;
}) => {
    return (
        <button
            className="transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none"
            onPointerDown={() => onSelect(reaction)}>
            {reaction}
        </button>
    );
}