import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import CoordinatorForum from "../Shared/CoordinatorForum";

export default function AdminCoordinatorChatroom() {
    return (
        <div className="d-flex dashboard-page-content">
            {/* Sidebar on the left */}
            <aside>
                <AdminSidebar />
            </aside>
            {/* Right content area */}
            <CoordinatorForum />
        </div>
    );
}

