import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/Logo.jpg"; 

export default function Navbar() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.loggedInUser?.success);

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
                            <Link className="btn btn-light text-primary fw-semibold custom-btn" to="/venues">
                                Venues
                            </Link>
                        </li>
                        <li className="nav-item">
                            {user ? (
                                <Link
                                    className="btn btn-light text-primary fw-semibold custom-btn"
                                    // to={user.role === "admin" ? "/admindashboard" : "/listenerdashboard"
                                    to={"/listenerdashboard"}
                            
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <Link className="btn btn-light text-primary fw-semibold custom-btn" to="/login">
                                    Login
                                </Link>
                            )}
                        </li>

                        {user && (
                            <li className="nav-item">
                                <Link
                                    className="btn btn-light text-primary fw-semibold custom-btn"
                                    //to={user.role === "admin" ? "/adminhelp" : "/listenerhelp"}
                                    to={"/listenerhelp"}
                                >
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
