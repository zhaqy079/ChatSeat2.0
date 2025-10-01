import { useSelector } from "react-redux";
import ListenerSideBar from "./ListenerSideBar";

export default function PrivateMessage() {
    return (
       <div className="d-flex">
            <ListenerSideBar />
            <main className="flex-grow-1 p-4">
                <h2 className="fw-bold text-primary mb-3">
                    New Unread Messages
                </h2>

                
            </main>
        </div>

    );
}
