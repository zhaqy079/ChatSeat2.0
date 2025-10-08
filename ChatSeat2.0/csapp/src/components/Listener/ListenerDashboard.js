import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import ListenerSideBar from "./ListenerSideBar";

export default function ListenerDashboard() {
    const user = useSelector((s) => s.loggedInUser?.success);

    return (

        <div className="d-flex">
            <ListenerSideBar />
            <main className="flex-grow-1 p-4">
                <h2 className="fw-bold text-primary mb-3">
                    Welcome Listener:  {user?.firstName ? `, ${user.firstName}` : ""}
                </h2>

                {/* will edit upcoming bookings soon*/}
            </main>
        </div>
    
    );
}
