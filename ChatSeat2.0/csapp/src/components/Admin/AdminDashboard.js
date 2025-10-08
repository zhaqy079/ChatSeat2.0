import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboard() {
    const user = useSelector((s) => s.loggedInUser?.success);

    return (
        <div>
            <div className="d-flex">
                <AdminSidebar userName="userName" />
                <main className="flex-grow-1 p-4">
                    <h2 className="fw-bold text-primary mb-3">
                        Welcome Admin :  {user?.firstName ? `, ${user.firstName}` : ""}
                    </h2>
                    
                </main>
            </div>
        </div>


    );
}