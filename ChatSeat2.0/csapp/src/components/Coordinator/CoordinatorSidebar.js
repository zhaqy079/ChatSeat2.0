import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function CoordinatorSidebar() {
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
            <div className="dashboard-sidebar__nav">
                <div className="dashboard-sidebar__greeting">
                    Dashboard
                </div>
                <NavLink to="/coordinatorappointments" className={getActiveLink("coordinatorappointments")}>
                    Appointments
                </NavLink>
                <NavLink to="coordinatoravailability" className={getActiveLink("coordinatoravailability")}>
                    Availability
                </NavLink>
                <NavLink to="coordinatoraddlistener" className={getActiveLink("coordinatoraddlistener")}>
                    Add A Listener
                </NavLink>
                <NavLink to="coordinatorchatroom" className={getActiveLink("coordinatorchatroom")}>
                    Coordinators Chat Room
                </NavLink>
                <NavLink to="coordinatorlistenerchatroom" className={getActiveLink("coordinatorlistenerchatroom")}>
                    Listener Chat Room
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
