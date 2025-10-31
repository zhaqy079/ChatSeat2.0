import { useSelector } from "react-redux";
import CoordinatorSidebar from "./CoordinatorSidebar";
import CoordinatorForum from "../Shared/CoordinatorForum";

export default function CoordinatorAdminForum() {
    return (
        <div className="d-flex dashboard-page-content">
            {/* Sidebar on the left */}
            <aside>
                <CoordinatorSidebar />
            </aside>
            {/* Right content area */}
            <CoordinatorForum />
        </div>
    );
}

