import { Link, useLocation, useNavigate } from "react-router-dom";
import '../../index.css';



export default function AdminSidebar({ userName = "" }) {
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
            </div>

            <div className="mt-3">
                <button className="admin-sidebar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
}
