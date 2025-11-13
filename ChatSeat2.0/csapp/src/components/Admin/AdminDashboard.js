import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import alarmIcon from "../../assets/icons/icons8-alarm-48.png";
import { supabase } from "../../supabaseClient";
import AdminLinks from "./AdminLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";

export default function AdminDashboard() {
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();
    const { user, getActiveLink, handleLogout, closeOffcanvas } = useDashboardNav();

    useEffect(() => {
        const fetchPending = async () => {
            const { data, error } = await supabase
                .from("user_profiles")
                .select("profile_id")
                .is("approved_by", null);
            if (!error && data) setPendingCount(data.length);
        };
        fetchPending();
    }, []);

    const goToUserList = () => {
        sessionStorage.setItem("role", "pending");
        navigate("/AdminViewUsers");
    };

    return (
        <div className="container-fluid px-0">
            <div className="d-lg-none p-2">
                <button
                    className="btn btn-outline-primary btn-lg"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                    aria-controls="mobileMenu"
                >
                    Menu
                </button>
            </div>

            <div className="d-flex">
                {/* Sidebar */}
                <aside className="px-0 flex-shrink-0">
                    <AdminSidebar />
                </aside>

                <main className="flex-grow-1 p-4">
                    <h2 className="fw-bold intro-title mb-2">Welcome</h2>

                    {pendingCount > 0 && (
                        <div className="pending-alert">
                            <p className="pending-text">
                                You have {pendingCount} new user
                                {pendingCount > 1 ? "s" : ""} waiting for approval.
                            </p>
                            <button onClick={goToUserList} className="pending-link">

                                Review now
                                <img src={alarmIcon} alt="" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    <div className="message-alert">
                        <p className="message-text">Use the dropdown in the top right to switch dashboards.</p>
                    </div>

                </main>
            </div>
            <div
                className="offcanvas offcanvas-start"
                id="mobileMenu"
                tabIndex="-1"
                aria-labelledby="mobileMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="mobileMenuLabel" className="mb-0">
                        Hello, {user?.firstName ?? ""}!
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <AdminLinks
                        getActiveLink={getActiveLink}
                        handleLogout={handleLogout}
                        onItemClick={closeOffcanvas}
                    />
                </div>
            </div>
        </div>


    );
}