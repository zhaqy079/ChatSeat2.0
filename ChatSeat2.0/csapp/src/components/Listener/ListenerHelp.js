import ListenerSidebar from "./ListenerSideBar";
//import { useSelector } from "react-redux";


export default function ListenerHelp() {


    return (

        <div>

            {/* Main Layout */}
            <div className="d-flex dashboard-page-content">

                {/*you can take this out if you want i left this for user to easily navigate to other pages */}
                <ListenerSidebar />

                {/* Main Content */}
                <div className="flex-grow-1 px-3 px-md-5 py-4">
                    <div className="container bg-white rounded shadow-sm p-4 p-md-5">
                        <div className="text-center mb-4">
                            <h2 className="fw-bold text-primary mb-2">How to Use the Website</h2>
                            <p className="text-muted">
                                Follow these instructions to navigate and use the website effectively.
                            </p>
                        </div>

                        {/* Help Sections */}
                        <div className="row g-4">
                            {/* List of Coordinators */}
                            <div className="col-12" >
                                <div className="p-3 bg-primary-subtle border-start border-primary border-4 rounded">
                                    <h5 className="fw-semibold mb-2">List of Coordinators</h5>
                                    <p className="text-muted small mb-0">
                                        Here, you can view all available coordinators. This helps you decide whom you'd
                                        like to book a session with. Each coordinator may have different time slots and
                                        locations.
                                    </p>
                                </div>
                            </div>

                            {/* Scheduling */}
                            <div className="col-12">
                                <div className="p-3 bg-warning-subtle border-start border-warning border-4 rounded">
                                    <h5 className="fw-semibold mb-2">Scheduling</h5>
                                    <p className="text-muted small mb-2">
                                        The Scheduling page helps you manage your appointments. It has three useful tabs:
                                    </p>
                                    <ul className="small text-muted ms-3">
                                        <li>
                                            <strong>Upcoming Bookings:</strong> Edit or delete your future sessions.
                                        </li>
                                        <li>
                                            <strong>Book a Slot:</strong> Click on an available slot to book an event. If you want to unbook, click the same event again and select Unbook.
                                        </li>
                                        <li>
                                            <strong>View Calendar:</strong> See all bookings in calendar format after selecting a place.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="col-12">
                                <div className="p-3 bg-success-subtle border-start border-success border-4 rounded">
                                    <h5 className="fw-semibold mb-2">Resources</h5>
                                    <p className="text-muted small mb-0">
                                        This section contains helpful resources and information to support your journey.
                                        It may include guides, mental health articles, or session tips curated for listeners.
                                    </p>
                                </div>
                            </div>

                            {/* Let's Talk */}
                            <div className="col-12">
                                <div className="p-3 bg-primary-subtle border-start border-primary border-4 rounded">
                                    <h5 className="fw-semibold text-purple mb-2">Let's Talk</h5>
                                    <p className="text-muted small mb-0">
                                        Share your experiences, thoughts, or questions with others. This is a safe space
                                        to talk about meetings, ideas, or challenges — whether it’s with a coordinator,
                                        admin, or fellow listener.
                                    </p>
                                </div>
                            </div>

                            {/* About Us */}
                            <div className="col-12">
                                <div className="p-3 bg-warning-subtle border-start border-warning border-4 rounded">
                                    <h5 className="fw-semibold text-dark mb-2">About Us</h5>
                                    <p className="text-muted small mb-0">
                                        Learn more about the admin team who manage the platform. This page offers
                                        background on their mission and contact information if needed.
                                    </p>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="col-12">
                                <div className="p-3 bg-info-subtle border-start border-info border-4 rounded">
                                    <h5 className="fw-semibold mb-2">Feedback</h5>
                                    <p className="text-muted small mb-0">
                                        Use this page to share your feedback — whether it’s about a session, a
                                        coordinator, or your overall experience. Your input helps us improve the platform
                                        for everyone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
