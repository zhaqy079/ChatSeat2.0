import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import logo from "../../assets/Logo.jpg";


export default function AdminNavbar({ title = "Admin Dashboard" }) {
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);
    const navigate = useNavigate();

    const handleReloadPageClick = () => {
        window.location.reload();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top shadow custom-navbar">
            <div className="container-fluid me-5">
                <span className="navbar-brand d-flex align-items-center" onClick={handleReloadPageClick}>
                    <img
                        src={logo}
                        alt="Chat Seat Logo"
                        width="40"
                        height="40"
                        className="rounded me-5"
                    />
                </span>

                <span className="navbar-brand fw-bold">{title}</span>

                <div className="dropdown">
                    <button
                        className="btn btn-primary dropdown-toggle"
                        type="button"
                        id="adminDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded={dropdownIsOpen}
                        onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                    >
                        Dashboards
                    </button>
                    {dropdownIsOpen && (
                        <ul
                            className="dropdown-menu dropdown-menu-start show"
                            aria-labelledby="adminDropdown"
                        >
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        // listener dashboard navigation logic here
                                        navigate("/listenerdashboard");
                                        setDropdownIsOpen(false);
                                    }}
                                >
                                    Listener Portal
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        // coordinator dashboard navigation logic here
                                        setDropdownIsOpen(false);
                                    }}
                                >
                                    Coordinator Portal
                                </button>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={() => {
                                        navigate("/admindashboard");
                                        setDropdownIsOpen(false);
                                    }}
                                >
                                    Admin Portal
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}