import { useSelector } from "react-redux";
import UserGeneralForum from "../Shared/UserGeneralForum";
import ListenerSidebar from "./ListenerSideBar";

export default function ListenerChatroom() {
    return (
        <div className="d-flex dashboard-page-content ">
            {/* Sidebar on the left */}
            <aside>
                <ListenerSidebar />
            </aside>
            {/* Right content area */}
            <UserGeneralForum/>
        </div>
    );
}

