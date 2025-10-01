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
        <div className="admin-sidebar">
            <div className="admin-sidebar__nav">
                <div className="admin-sidebar__greeting">
                    Dashboard
                </div>
                <NavLink to="#" className={getActiveLink("")}>
                    Appointments
                </NavLink>
                <NavLink to="#" className={getActiveLink("")}>
                    Availability
                </NavLink>
                <NavLink to="#" className={getActiveLink("")}>
                    Add A Listener
                </NavLink>
                <NavLink to="#" className={getActiveLink("")}>
                    Coordinators Chat Room
                </NavLink>
                <NavLink to="#" cclassName={getActiveLink("")}>
                    Listener Chat Room
                </NavLink>
            </div>
            <div className="mt-3">
                <button className="admin-sidebar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
