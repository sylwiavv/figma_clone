'use client';

import {Live} from "@/app/components/Live";
import Navbar from "@/app/components/Navbar";
import LeftSidebar from "@/app/components/LeftSidebar";
import RightSidebar from "@/app/components/RightSidebar";
import {useEffect, useRef, useState} from "react";
import {fabric} from "fabric";
import {
    handleCanvaseMouseMove,
    handleCanvasMouseDown, handleCanvasMouseUp, handleCanvasObjectModified, handleCanvasObjectMoving, handlePathCreated,
    handleResize,
    initializeFabric, renderCanvas,
} from "@/lib/canvas";
import {ActiveElement} from "@/types/type";
import {useMutation, useRedo, useStorage, useUndo} from "@/liveblocks.config";
import {defaultNavElement} from "@/constants";
import {handleDelete, handleKeyDown} from "@/lib/key-events";
import {handleImageUpload} from "@/lib/shapes";

export default function Page() {
    const undo = useUndo()
    const redo = useRedo()

    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fabricRef = useRef<fabric.Canvas | null>(null)
    const isDrawing = useRef(false)
    const shapeRef = useRef<fabric.Object | null>(null)
    const selectedShapeRef = useRef<string | null>(null)
    const activeObjectRef = useRef<fabric.Object | null>(null)
    const imageInputRef = useRef<HTMLInputElement | null>(null)

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

    // --------------------
    const deleteAllShapes = useMutation(({ storage }) => {
        // get the canvasObjects store
        const canvasObjects = storage.get("canvasObjects");

        // if the store doesn't exist or is empty, return
        if (!canvasObjects || canvasObjects.size === 0) return true;

        // delete all the shapes from the store
        for (const [key, value] of canvasObjects.entries()) {
            canvasObjects.delete(key);
        }

        // return true if the store is empty
        return canvasObjects.size === 0;
    }, []);

    // -------
    const deleteShapeFromStorage = useMutation(({storage}, objectId) => {
        const canvasObjects = storage.get("canvasObjects");

        canvasObjects.delete(objectId)
    }, [])

    // -------
    const handleActiveElement = (element: ActiveElement) => {
        setActiveElement(element)

        switch (element?.value) {
            case 'reset':
                deleteAllShapes()
                fabricRef.current?.clear()
                setActiveElement(defaultNavElement)
            break;
            case 'delete':
                handleDelete(fabricRef.current as any, deleteShapeFromStorage)
                setActiveElement(defaultNavElement)
                break;
            // upload an image to the canvas
            case "image":
                // trigger the click event on the input element which opens the file dialog
                imageInputRef.current?.click();
                /**
                 * set drawing mode to false
                 * If the user is drawing on the canvas, we want to stop the
                 * drawing mode when clicked on the image item from the dropdown.
                 */
                isDrawing.current = false;

                if (fabricRef.current) {
                    // disable the drawing mode of canvas
                    if ("isDrawingMode" in fabricRef.current) {
                        fabricRef.current.isDrawingMode = false;
                    }
                }
                break;
            default:
                break;
        }

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
                isDrawing,
                selectedShapeRef,
                shapeRef,
                syncShapeInStorage,
            });
        });


        // --------------------------------------
        canvas.on("mouse:up", () => {
            handleCanvasMouseUp({
                canvas,
                isDrawing,
                shapeRef,
                activeObjectRef,
                selectedShapeRef,
                syncShapeInStorage,
                setActiveElement,
            });
        });

        // --------------------------------------
        canvas.on("path:created", (options) => {
            handlePathCreated({
                options,
                syncShapeInStorage,
            });
        });

        // --------------------------------------
        canvas?.on("object:moving", (options) => {
            handleCanvasObjectMoving({
                options,
            });
        });

        // --------------------------------------
        canvas.on("object:modified", (options) => {
            handleCanvasObjectModified({
                options,
                syncShapeInStorage,
            });
        });


        window.addEventListener("resize", () => {
            handleResize({
                canvas: fabricRef.current,
            });
        });

        window.addEventListener("keydown", (e) =>
            handleKeyDown({
                e,
                canvas: fabricRef.current,
                undo,
                redo,
                syncShapeInStorage,
                deleteShapeFromStorage,
            })
        );

        return () => {
            canvas.dispose()
        }
        }, [])


    useEffect(() => {
        renderCanvas({
            fabricRef,
            canvasObjects,
            activeObjectRef,
        });
    }, [canvasObjects]);

    return (
        <main className="h-screen overflow-hidden">
            <Navbar
                imageInputRef={imageInputRef}
                activeElement={activeElement}
                handleImageUpload={(e: any) => {
                    // prevent the default behavior of the input element
                    e.stopPropagation();

                    handleImageUpload({
                        file: e.target.files[0],
                        canvas: fabricRef as any,
                        shapeRef,
                        syncShapeInStorage,
                    });
                }}
                handleActiveElement={handleActiveElement}
            />

            <section className="flex h-full flex-row">
                <LeftSidebar allShapes={Array.from(canvasObjects)}  />
                <Live canvasRef={canvasRef}/>
                <RightSidebar />
            </section>

        </main>
    );
}