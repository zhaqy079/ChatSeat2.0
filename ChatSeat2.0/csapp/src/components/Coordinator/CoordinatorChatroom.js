import { useSelector } from "react-redux";
import CoordinatorSidebar from "./CoordinatorSidebar";

export default function CoordinatorChatroom() {
    return (
        <div className="d-flex  dashboard-page-bg ">
            {/* Sidebar on the left */}
            <aside>
                <CoordinatorSidebar />
            </aside>
        </div>
    );
}

