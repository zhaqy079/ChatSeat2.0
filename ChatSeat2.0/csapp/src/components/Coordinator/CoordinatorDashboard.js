import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import CoordinatorSidebar from "./CoordinatorSidebar";

export default function CoordinatorDashboard() {
    const user = useSelector((s) => s.loggedInUser?.success);

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className="col-12 col-md-3 col-lg-3">
                <CoordinatorSidebar />
            </div>

            {/* Main Content */}
            <main className="p-4 d-flex justify-content-center flex-grow-1">
                <div className="card shadow-sm rounded-3 p-4 w-75">

                    {/* Welcome Section */}
                    <h2 className="fw-bold text-primary mb-4 text-center">
                        Welcome, Coordinators!
                    </h2>

                    <p className="text-secondary mb-4 text-center">
                        Thank you for volunteering your time to serve as a Coordinator
                        for one of our Chat Seats. This page outlines your
                        responsibilities and available resources to help you support our
                        community effectively.
                    </p>

                    {/* Role Section */}
                    <div className="card border-primary bg-primary-subtle p-3 mb-4">
                        <h5 className="card-title text-primary mb-3">Your Role</h5>
                        <ul className="ms-3 mb-0">
                            <li>Identify venues where Chat Seats can be placed</li>
                            <li>Obtain permission from the venue manager or owner</li>
                            <li>Recruit Listeners and assess their suitability</li>
                            <li>
                                Advise Listeners on necessary clearances (e.g., Working with
                                Children Certificate)
                            </li>
                            <li>Introduce Listeners to available resources and tools</li>
                            <li>Guide them to nominate volunteering times on the calendar</li>
                            <li>
                                Encourage use of the Chat Room to connect with fellow volunteers
                            </li>
                        </ul>
                    </div>

                    {/* Coordinator Resources Section */}
                    <div className="card border-info bg-info-subtle p-3 mb-4">
                        <h5 className="card-title text-info mb-3">Coordinator Resources</h5>
                        <p className="mb-0">
                            This section includes useful tips from experienced coordinators,
                            examples of successful outreach strategies, and branding
                            materials like banners, logos, and name tags that you're welcome
                            to use.
                        </p>
                    </div>

                    {/* Tools and Support Section */}
                    <div className="card border-success bg-success-subtle p-3 mb-4">
                        <h5 className="card-title text-success mb-3">Tools and Support</h5>
                        <p>Use the <strong>Availability</strong> tab to schedule times and manage locations.</p>
                        <p>Use the <strong>Coordinator Chat Room</strong> to collaborate and exchange ideas with other coordinators.</p>
                        <p>Submit your thoughts or report issues through the <strong>Feedback</strong> tab.</p>
                    </div>

                </div>
            </main>
        </div>
    );
}