import { NavLink, useLocation, useNavigate } from "react-router-dom";

export default function ListenerSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const getActiveLink = (url) =>
        location.pathname === url
            ? "admin-sidebar__link active"
            : "admin-sidebar__link";

    const handleLogout = () => {
        // Add logout logic here
        //navigate("/login");
        navigate("/");
    };

    return (
        <div className="admin-sidebar">
            <div className="admin-sidebar__nav">
                <div className="admin-sidebar__greeting">
                    Dashboard
                </div>
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
                <button className="admin-sidebar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
       </div>
    );
}
