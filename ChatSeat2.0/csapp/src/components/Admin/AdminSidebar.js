import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://nuarimunhutwzmcknhwj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YXJpbXVuaHV0d3ptY2tuaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTk2MjIsImV4cCI6MjA3MTIzNTYyMn0.fwdTA0n_vSrT_kUqlExIPdDpPrHo_fRIkOUcd5aHi0c"
);

export default function AdminSidebar({ userName = "" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getActiveLink = (url) =>
        location.pathname === url
            ? "dashboard-sidebar__link active"
            : "dashboard-sidebar__link";

    const handleLogout = async () => {
 
        // Supabase logout
        await supabase.auth.signOut();

        // Clear Redux state
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <div className="dashboard-sidebar">
            <div className="dashboard-sidebar__greeting">
                Hello, {userName}!
            </div>

            <div className="dashboard-sidebar__nav">
                <NavLink to="/admindashboard" className={getActiveLink("/admindashboard")}>
                    Dashboard
                </NavLink>
                <NavLink to="/adminSchedulingSetting" className={getActiveLink("/adminSchedulingSetting")}>
                    Scheduling Setting
                </NavLink>
                <NavLink to="/adminViewUsers" className={getActiveLink("/adminViewUsers")}>
                    View All Users
                </NavLink>
                <NavLink to="/adminManageLocations" className={getActiveLink("/adminManageLocations")}>
                    Manage Locations
                </NavLink>
                <NavLink to="/userGeneralForums" className={getActiveLink("/userGeneralForums")}>
                    General Forum
                </NavLink>
                <NavLink to="/adminFeedback" className={getActiveLink("/adminFeedback")}>
                    Feedback
                </NavLink>
                <NavLink to="/admineditresource" className={getActiveLink("/admineditresource")}>
                    Edit Resources
                </NavLink>
            </div>

            <div className="mt-3">
                <button className="dashboard-sidebar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
