import ListenerLinks from "./ListenerLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";

export default function ListenerSidebar() {
    const { user, getActiveLink, handleLogout
    } = useDashboardNav();

    return (
        <div className="dashboard-sidebar d-none d-lg-block">
            <div className="dashboard-sidebar__greeting">
                Hello, {user?.firstName ? `${user.firstName}` : "Listener"}!
            </div>
            <ListenerLinks
                getActiveLink={getActiveLink}
                handleLogout={handleLogout}
            />


        </div>
    );
}
