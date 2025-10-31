import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { supabase } from "../../supabaseClient";


export default function CoordinatorSidebar() {
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
                Hello, {user?.firstName ? `${user.firstName}` : ""}!
            </div>

            <div className="dashboard-sidebar__nav">
                <NavLink to="/coordinatordashboard" className={getActiveLink("/coordinatordashboard")}>
                    Dashboard
                </NavLink>
                <NavLink to="/coordinatorappointments" className={getActiveLink("/coordinatorappointments")}>
                    Appointments
                </NavLink>

                <NavLink to="/coordinatoravailability" className={getActiveLink("/coordinatoravailability")}>

                    Availability
                </NavLink>
                <NavLink to="/coordinatoradminforum" className={getActiveLink("/coordinatoradminforum")}>
                    Coordinator Chat Room
                </NavLink>
                <NavLink to="/coordinatorlistenerchatroom" className={getActiveLink("/coordinatorlistenerchatroom")}>
                    Listener Chat Room
                </NavLink>
            </div>
            <div className="mt-3">
                <NavLink to="/coordFeedback" className={getActiveLink("/coordFeedback")}>
                    Feedback
                </NavLink>
                <hr />
                <button className="dashboard-sidebar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
