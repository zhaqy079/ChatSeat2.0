import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { supabase } from "../../supabaseClient";

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
                Hello, {user?.firstName ? `${user.firstName}` : "Listener"}!
            </div>

            <div className="dashboard-sidebar__nav">
                <NavLink to="/listenerdashboard" className={getActiveLink("/listenerdashboard")}>
                    Dashboard
                </NavLink>
                <NavLink to="/coordinatorslistinlistener" className={getActiveLink("/coordinatorslistinlistener")}>
                    List of Coordinators
                </NavLink>
                <NavLink to="/listenerscheduling" className={getActiveLink("/listenerscheduling")}>
                    Booking
                </NavLink>
                <NavLink to="/listenerchatroom" className={getActiveLink("/listenerchatroom")}>
                    Listener Chatroom
                </NavLink>
                <NavLink to="/privatemessage" className={getActiveLink("/privatemessage")}>
                    Inbox
                </NavLink>
            </div>
            <div className="mt-3">
                <NavLink to="/listenerFeedback" className={getActiveLink("/listenerFeedback")}>
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
