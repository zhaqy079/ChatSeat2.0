import { useSelector } from "react-redux";
import ListenerSideBar from "./ListenerSideBar";
import SubmitFeedback from "../Shared/SubmitFeedback";

export default function ListenerFeedback() {
    return (
        <div className="d-flex dashboard-page-content">
            {/* Sidebar on the left */}
            <aside>
                <ListenerSideBar />
            </aside>
            {/* Right content area */}
            <SubmitFeedback/>
        </div>
    );
}

