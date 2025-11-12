import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../state/loggedInUser";
import { supabase } from "../../supabaseClient";
import ListenerLinks from "./ListenerLinks";

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
