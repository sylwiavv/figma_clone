"use client";

import React from 'react';
import Color from "@/app/components/settings/Color";
import Export from "@/app/components/settings/Export";
import Dimensions from "@/app/components/settings/Dimensions";
import Text from "@/app/components/settings/Text";
import {RightSidebarProps} from "@/types/type";
import {modifyShape} from "@/lib/shapes";
import {fabric} from "fabric";

const RightSidebar = ({
  elementAttributes,
  setElementAttributes,
  isEditingRef,
  fabricRef,
  activeObjectRef,
  syncShapeInStorage
}: RightSidebarProps) => {

    const handleInputChange = (property: string, value: string) => {
        if (!isEditingRef.current) isEditingRef.current = true;

        setElementAttributes((prev) => ({ ...prev, [property]: value }));

        modifyShape({
            canvas: fabricRef.current as fabric.Canvas,
            property,
            value,
            activeObjectRef,
            syncShapeInStorage,
        });
    };

    return (
        <section
            className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px]
             sticky right-0 h-full max-sm:hidden select-none">
            <h3 className=" px-5 pt-4 text-xs uppercase">Design</h3>
            <span className="text-xs text-primary-grey-300 mt-3 px-5 border-b border-primary-grey-200 pb-4">
          Make changes to canvas as you like
        </span>

            <Dimensions width={elementAttributes.width} height={elementAttributes.height} isEditingRef={isEditingRef}
                        handleInputChange={handleInputChange}/>
            <Text/>
            <Color/>
            <Color/>
            <Export/>
        </section>);
}

export default RightSidebar