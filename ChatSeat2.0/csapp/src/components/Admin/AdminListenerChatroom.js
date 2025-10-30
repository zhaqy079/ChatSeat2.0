import { useSelector } from "react-redux";
import AdminSidebar from "./AdminSidebar";
import UserGeneralForum from "../Shared/UserGeneralForum";

export default function AdminListenerChatroom() {
    return (
        <div className="d-flex dashboard-page-content">
            {/* Sidebar on the left */}
            <aside>
                <AdminSidebar />
            </aside>
            {/* Right content area */}
            <UserGeneralForum />
        </div>
    );
}