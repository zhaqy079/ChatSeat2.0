import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function AdminSidebar({ userName = "" }) {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const getActiveLink = (url) =>
        location.pathname === url
            ? "admin-sidebar__link active"
            : "admin-sidebar__link";

    const handleLogout = async () => {
 
        // Supabase logout
        await supabase.auth.signOut();

        // Clear Redux state
        dispatch(logoutUser());
        navigate("/");
    };

    return (
        <div className="admin-sidebar" style={{minWidth: "14%"}}>
            <div className="admin-sidebar__greeting">
                Hello, {userName}!
            </div>

            <div className="admin-sidebar__nav">
                <Link to="/admindashboard" className={getActiveLink("/admindashboard")}>
                    Dashboard
                </Link>
                <Link to="/adminSchedulingSetting" className={getActiveLink("/adminSchedulingSetting")}>
                    Scheduling Setting
                </Link>
                <Link to="/adminViewUsers" className={getActiveLink("/adminViewUsers")}>
                    View All Users
                </Link>
                <Link to="/adminManageLocations" className={getActiveLink("/adminManageLocations")}>
                    Manage Locations
                </Link>
                <Link to="/userGeneralForums" className={getActiveLink("/userGeneralForums")}>
                    General Forum
                </Link>
                <Link to="/adminFeedback" className={getActiveLink("/adminFeedback")}>
                    Feedback
                </Link>
            </div>

            <div className="mt-3">
                <button className="admin-sidebar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
