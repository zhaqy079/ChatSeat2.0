import { useSelector } from "react-redux";
import CoordinatorSidebar from "./CoordinatorSidebar";
import UserGeneralForum from "../Shared/UserGeneralForum";

export default function CoordinatorListenerChatroom() {
    return (
        <div className="d-flex dashboard-page-content">
            {/* Sidebar on the left */}
            <aside>
                <CoordinatorSidebar />
            </aside>
            {/* Right content area */}
            <UserGeneralForum/>
        </div>
    );
}

