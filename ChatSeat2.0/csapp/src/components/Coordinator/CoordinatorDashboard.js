import CoordinatorSidebar from "./CoordinatorSidebar";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import CoordinatorLinks from "./CoordinatorLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";

export default function CoordinatorDashboard() {
    const { user, getActiveLink, handleLogout, closeOffcanvas } = useDashboardNav();
    const [resources, setResources] = useState([]);

    useEffect(() => {
        const fetchResources = async () => {
            const { data, error } = await supabase
                .from("role_resources")
                .select("*")
                .eq("role", "coordinator")
                .order("created_at", { ascending: false });
            if (error) console.error(error);
            else setResources(data);
        };
        fetchResources();
    }, []);

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
                    <CoordinatorSidebar />
                </aside>

                {/* Main Content */}
                <main className="p-4 d-flex justify-content-center flex-grow-1 my-4">
                    <div className="dashboard-content-wrap">
                        <div className="dashboard-card p-4">
                            <div className="card-body">
                                {/* Welcome Section */}
                                <h2 className="intro-title text-center text-bold">
                                    Welcome, Coordinators!
                                </h2>

                                <p className="text-secondary mb-4 text-center">
                                    Thank you for volunteering your time to serve as a Coordinator
                                    for one of our Chat Seats. This page outlines your
                                    responsibilities and available resources to help you support our
                                    community effectively.
                                </p>

                                {/* Role Section */}

                                <div className="section-soft bg-primary-subtle border-primary mb-4" >
                                    <h5 className="intro-title mb-3">Your Role</h5>
                                    <ul className="list-clean mt-2 mb-0">
                                        <li>Identify venues where Chat Seats can be placed. </li>
                                        <li>Obtain permission from the venue manager or owner. </li>
                                        <li>Recruit Listeners and assess their suitability. </li>
                                        <li>
                                            Advise Listeners on necessary clearances (e.g., Working with
                                            Children Certificate)
                                        </li>
                                        <li>Introduce Listeners to available resources and tools. </li>
                                        <li>Guide them to nominate volunteering times on the calendar. </li>
                                        <li>
                                            Encourage use of the Chat Room to connect with fellow volunteers.
                                        </li>
                                        <li>
                                            It is important that volunteers are covered by insurance.
                                            We have found that working with the local council can help here.
                                        </li>
                                    </ul>
                                </div>

                                {/* Coordinator Resources Section */}
                                <div className="section-soft bg-info-subtle border-info mb-4" >
                                    <h5 className="intro-title mb-3">Coordinator Help</h5>
                                    <p className="mb-0">
                                        This section includes useful tips from experienced coordinators,
                                        examples of successful outreach strategies, and branding
                                        materials like banners, logos, and name tags that you're welcome
                                        to use.
                                    </p>
                                </div>

                                {/* Tools and Support Section */}
                                <div className="section-soft bg-success-subtle border-success mb-4">
                                    <h5 className="intro-title text-success mb-3">Tools and Support</h5>
                                    <p>Use the <strong>Availability</strong> tab to schedule times and manage locations.</p>
                                    <p>Use the <strong>Coordinator Chat Room</strong> to collaborate and exchange ideas with other coordinators.</p>
                                    <p>Submit your thoughts or report issues through the <strong>Feedback</strong> tab.</p>
                                </div>
                            </div>
                        </div>
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

                    <CoordinatorLinks
                        getActiveLink={getActiveLink}
                        handleLogout={handleLogout}
                        onItemClick={closeOffcanvas}
                    />
                </div>
            </div>
        </div>
    );
}