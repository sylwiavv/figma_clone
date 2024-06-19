import {Live} from "@/app/components/Live";
import Navbar from "@/app/components/Navbar";

export default function Page() {
    return (
        <main className="h-screen overflow-hidden">
            <Navbar/>
            <Live/>
        </main>
    );
}