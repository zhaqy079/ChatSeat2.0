import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function ListenerSidebar() {
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
                <NavLink to="/listenerdashboard" className={getActiveLink("/listenerdashboard")}>
                    Dashboard
                </NavLink>
                <NavLink to="/coordinatorslistinlistener" className={getActiveLink("/coordinatorslistinlistener")}>
                    List of Coordinators
                </NavLink>
                <NavLink to="/listenerscheduling" className={getActiveLink("/listenerscheduling")}>
                    Scheduling
                </NavLink>
                <NavLink to="/listenerchatroom" className={getActiveLink("/listenerchatroom")}>
                    Let’s Talk
                </NavLink>
                <NavLink to="/privatemessage" className={getActiveLink("/privatemessage")}>
                    Inbox
                </NavLink>
            </div>
            <div className="mt-3">
                <NavLink to="/listenerFeedback" className={getActiveLink("/listenerFeedback")}>
                    Submit Feedback
                </NavLink>
                <hr />
                <button className="dashboard-sidebar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
       </div>
    );
}
