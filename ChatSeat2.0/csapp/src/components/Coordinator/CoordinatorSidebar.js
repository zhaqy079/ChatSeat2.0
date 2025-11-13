import CoordinatorLinks from "./CoordinatorLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";


export default function CoordinatorSidebar() {
    const { user, getActiveLink, handleLogout
    } = useDashboardNav();


    return (
        <div className="dashboard-sidebar d-none d-lg-block">
            <div className="dashboard-sidebar__greeting">
                Hello, {user?.firstName ? `${user.firstName}` : "Listener"}!
            </div>
            <CoordinatorLinks
                getActiveLink={getActiveLink}
                handleLogout={handleLogout}
            />


        </div>
    );
}
