import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/Logo.jpg"; 

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.loggedInUser?.success);
    const isAuthenticated = !!user;
    const role = user?.role;
    console.log("Logged-in user:", user);
    console.log("User role:", user?.role);
    // Set the dashboard and the help page swither route 
    const dashboardPath =
        role === "admin"
            ? "/admindashboard"
            : role === "coordinator"
                ? "/coordinatordashboard"
                : "/listenerdashboard";

    const helpPath =
        role === "admin"
            ? "/adminhelp"
            : role === "coordinator"
                ? "/coordinatorhelp"
                : "/listenerhelp";
    // Set the login button only on Home page
    const showLoginBtn = !isAuthenticated && location.pathname === "/";

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow custom-navbar">
            <div className="container position-relative">
               
                    <button
                        type="button"
                        className="navbar-brand btn p-0 border-0 d-flex align-items-center"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logo}
                            alt="ChatSeat Logo"
                            width="40"
                            height="40"
                            className="rounded me-2"

                        />
                    
                    </button>
                <span className="brand-center-title fw-bold text-white fs-5 mb-0 position-absolute start-50 translate-middle-x d-none d-lg-inline" onClick={() => navigate("/")}>Have a Chat Seat</span>
                
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                    aria-controls="mainNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                    {/*Global Links*/}
                        <li className="nav-item">
                            <Link className="btn fw-semibold custom-btn" to="/about">
                                About Us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn fw-semibold custom-btn" to="/venues">
                                Venues
                            </Link>
                        </li>

                        {/*Admin Dashboard Dropdown btn*/}
                        {isAuthenticated && role === "admin" && (
                            <li className="nav-item dropdown">
                                <button
                                    className="btn fw-semibold custom-btn dropdown-toggle"
                                    id="dashboardDropdown"
                                    type="button"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                >
                                    View as ...
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dashboardDropdown">
                                    <li>
                                        <Link className="dropdown-item" to="/admindashboard">Admin Portal</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/coordinatordashboard">Coordinator Portal</Link>
                                    </li>
                                    <li>
                                        <Link className="dropdown-item" to="/listenerdashboard">Listener Portal</Link>
                                    </li>
                                </ul>
                            </li>
                        )}

                        {/* Listener / Coordinator: only show the single Dashboard */}
                        {isAuthenticated && role !== "admin" && (
                            <li className="nav-item">
                                <Link className="btn fw-semibold custom-btn" to={dashboardPath}>
                                    Dashboard
                                </Link>
                            </li>
                        )}

                        {/*Login (only at the home page*/}
                         {!isAuthenticated && showLoginBtn && (
                                <li className="nav-item">
                                    <Link className="btn fw-semibold custom-btn" to="/login">
                                        Login
                                    </Link>
                                </li>
                            
                        )}

                  
                        {/*help page switch*/}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link
                                    className="btn fw-semibold custom-btn"to={helpPath} >
                                    Help
                                </Link>
                            </li>
                        )}
                        
                    </ul>
                    </div>
                
            </div>
        </nav>
    );
}
