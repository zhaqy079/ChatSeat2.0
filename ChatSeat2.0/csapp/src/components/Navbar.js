import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/Logo.jpg"; 

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.loggedInUser?.success);
    const isAuthenticated = !!user;
    const role = user?.role;
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
        <nav className="navbar navbar-expand-md navbar-dark bg-primary sticky-top shadow custom-navbar">
            <div className="container">
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
                    <span className="position-absolute top-50 start-50 translate-middle fw-bold">Have a Chat Seat</span>
                </button>

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
                    <ul className="navbar-nav ms-auto align-items-center gap-2">
                        <li className="nav-item">
                            <Link className="btn btn-light text-primary fw-semibold custom-btn" to="/about">
                                About Us
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-light text-primary fw-semibold custom-btn" to="/venues">
                                Venues
                            </Link>
                        </li>

                        {/*dashboard switch*/}
                        {isAuthenticated ? (
                        <li className="nav-item">
                                <Link className="btn btn-light text-primary fw-semibold custom-btn" to={dashboardPath}>
                                    Dashboard
                                </Link>
                            </li>
                        ) : (
                            showLoginBtn && (
                                <li className="nav-item">
                                    <Link className="btn btn-light text-primary fw-semibold custom-btn" to="/login">
                                        Login
                                    </Link>
                                </li>
                            )
                        )}
                        {/*help page switch*/}
                        {isAuthenticated && (
                            <li className="nav-item">
                                <Link
                                    className="btn btn-light text-primary fw-semibold custom-btn"to={"/helpPath"} >
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
