'use client';

import {Live} from "@/app/components/Live";
import Navbar from "@/app/components/Navbar";
import LeftSidebar from "@/app/components/LeftSidebar";
import RightSidebar from "@/app/components/RightSidebar";
import {useEffect, useRef, useState} from "react";
import {fabric} from "fabric";
import {
    handleCanvaseMouseMove,
    handleCanvasMouseDown, handleCanvasMouseUp,
    handleResize,
    initializeFabric,
} from "@/lib/canvas";
import {ActiveElement} from "@/types/type";
import {useMutation, useStorage} from "@/liveblocks.config";
export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fabricRef = useRef<fabric.Canvas | null>(null)
    const isDrawing = useRef(false)
    const shapeRef = useRef<fabric.Object | null>(null)
    const selectedShapeRef = useRef<string | null>(null)
    const activeObjectRef = useRef<fabric.Object | null>(null)

    // storage a history of created elements
    const canvasObjects = useStorage((root) => root.canvasObjects)

    const syncShapeInStorage = useMutation(({storage}, object) => {
        if (!object) return

        const {objectId} = object;

        const shapeData = object.toJSON()
        // najpierw konwerujemy do JSON a później przypisujemy do objId
        shapeData.objectId = objectId

        const canvasObjects = storage.get('canvasObjects')
        canvasObjects.set(objectId, shapeData)
    }, [])

    const [activeElement, setActiveElement] = useState<ActiveElement>({
        name: "",
        value: "",
        icon: ""
    })

    const handleActiveElement = (element: ActiveElement) => {
        setActiveElement(element)

        selectedShapeRef.current = element?.value as string
    }

    useEffect(() => {
        const canvas = initializeFabric({
            canvasRef,
            fabricRef,
        });

        // --------------------------------------
        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({
                options,
                canvas,
                selectedShapeRef,
                isDrawing,
                shapeRef,
            });
        });

        // --------------------------------------
        canvas.on("mouse:move", (options) => {
            handleCanvaseMouseMove({
                options,
                canvas,
                selectedShapeRef,
                isDrawing,
                shapeRef,
                syncShapeInStorage
            });
        });

        // --------------------------------------
        canvas.on("mouse:up", (options) => {
            handleCanvasMouseUp({
                canvas,
                selectedShapeRef,
                isDrawing,
                shapeRef,
                syncShapeInStorage,
                setActiveElement,
                activeObjectRef
            });
        });

        window.addEventListener("resize", () => {
            handleResize({
                canvas: fabricRef.current,
            });
        });
        }, [])


    return (
        <main className="h-screen overflow-hidden">
            <Navbar activeElement={activeElement} handleActiveElement={handleActiveElement}/>

            <section className="flex h-full flex-row">
                <LeftSidebar  />
                <Live canvasRef={canvasRef}/>
                <RightSidebar />
            </section>

        </main>
    );
}