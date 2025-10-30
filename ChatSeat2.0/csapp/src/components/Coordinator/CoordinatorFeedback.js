import { useSelector } from "react-redux";
import CoordinatorSidebar from "./CoordinatorSidebar";
import SubmitFeedback from "../Shared/SubmitFeedback";

export default function CoordinatorFeedback() {
    return (
        <div className="d-flex dashboard-page-content">
            {/* Sidebar on the left */}
            <aside>
                <CoordinatorSidebar />
            </aside>
            {/* Right content area */}
            <SubmitFeedback/>
        </div>
    );
}

