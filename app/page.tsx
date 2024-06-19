'use client';

import {Live} from "@/app/components/Live";
import Navbar from "@/app/components/Navbar";
import LeftSidebar from "@/app/components/LeftSidebar";
import RightSidebar from "@/app/components/RightSidebar";
import {useEffect, useRef} from "react";
import {fabric} from "fabric";
import {
    handleCanvasMouseDown,
    handleResize,
    initializeFabric,
} from "@/lib/canvas";
export default function Page() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)
    const fabricRef = useRef<fabric.Canvas | null>(null)
    const isDrawing = useRef(false)
    const shapeRef = useRef<fabric.Object | null>(null)
    const selectedShapeRef = useRef<string | null>("rectangle")

    useEffect(() => {
        const canvas = initializeFabric({
            canvasRef,
            fabricRef,
        });

        canvas.on("mouse:down", (options) => {
            handleCanvasMouseDown({
                options,
                canvas,
                selectedShapeRef,
                isDrawing,
                shapeRef,
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
            <Navbar/>

            <section className="flex h-full flex-row">
                <LeftSidebar  />
                <Live canvasRef={canvasRef}/>
                <RightSidebar />
            </section>

        </main>
    );
}