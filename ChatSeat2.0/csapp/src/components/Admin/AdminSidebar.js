import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { supabase } from "../../supabaseClient";

export default function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((s) => s.loggedInUser?.success);

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
                Hello, {user?.firstName ? `${user.firstName}` : "Admin"}!
            </div>

            <div className="dashboard-sidebar__nav">
                <NavLink to="/admindashboard" className={getActiveLink("/admindashboard")}>
                    Dashboard
                </NavLink>
                <NavLink to="/adminSchedulingSetting" className={getActiveLink("/adminSchedulingSetting")}>
                    Location Scheduling
                </NavLink>
                <NavLink to="/adminViewUsers" className={getActiveLink("/adminViewUsers")}>
                    Manage Users
                </NavLink>
                <NavLink to="/admineditresource" className={getActiveLink("/admineditresource")}>
                    Edit Resources
                </NavLink>
                <NavLink to="/adminlistenerchatroom" className={getActiveLink("/adminlistenerchatroom")}>
                    Listener Chatroom
                </NavLink>
                <NavLink to="/admincoordinatorchatroom" className={getActiveLink("/admincoordinatorchatroom")}>
                    Coordinator Chatroom
                </NavLink>
                <NavLink to="/adminFeedback" className={getActiveLink("/adminFeedback")}>
                    Manage Feedback
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
