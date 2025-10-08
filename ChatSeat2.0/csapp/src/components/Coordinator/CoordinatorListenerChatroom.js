import { useSelector } from "react-redux";
import CoordinatorSidebar from "./CoordinatorSidebar";

export default function CoordinatorListenerChatroom() {
    return (
        <div className="d-flex dashboard-page-content ">
            {/* Sidebar on the left */}
            <aside>
                <CoordinatorSidebar />
            </aside>
            {/* Right content area */}
            <div className="flex-grow-1 px-3 px-md-4 py-4">
            </div>
        </div>
    );
}

