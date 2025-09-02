import { Link, useLocation } from "react-router-dom";
import '../../index.css';

export default function CoordinatorSidebar() {
    const location = useLocation();

    const getActiveClass = (path) =>
        location.pathname === path ? "sidebar-link active" : "sidebar-link";

    return (
        <div className="coordinator-sidebar p-3">

            <div className="links-container">
                <Link to="#" className={getActiveClass("")}>
                    Appointments
                </Link>
                <Link to="#" className={getActiveClass("")}>
                    Availability
                </Link>
                <Link to="#" className={getActiveClass("")}>
                    Add A Listener
                </Link>
                <Link to="#" className={getActiveClass("")}>
                    Coordinators Chat Room
                </Link>
                <Link to="#" className={getActiveClass("")}>
                    Listener Chat Room
                </Link>
            </div>
        </div>
    );
}