import CoordinatorSidebar from "./CoordinatorSidebar";
//import { useSelector } from "react-redux";


export default function CoordinatorHelp() {
    return (

        <div>

            <div className="d-flex dashboard-page-content">

                {/*you can take this out if you want i left this for user to easily navigate to other pages */}
                <CoordinatorSidebar />

                {/* Main Content */}
                <div className="flex-grow-1 px-3 px-md-5 py-4">
                    <div className="container bg-white rounded shadow-sm p-4 p-md-5 text-dark">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-primary mb-2">How to Use the Website</h2>
                            <p>
                                A quick guide to help you navigate and use the dashboard effectively.
                            </p>
                        </div>

                        <div className="row g-4">
                            {/* Appointments */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-primary bg-primary-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Appointments</h5>
                                    <p>
                                        This page shows all your booked sessions with listeners. If necessary, you
                                        can <strong>Edit</strong> time, place or date, or <strong>delete</strong> any
                                        slot that’s no longer available or needed.
                                    </p>
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-success bg-success-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Availability</h5>
                                    <p>
                                        View all scheduled sessions on a calendar. This helps you keep track of your
                                        availability and upcoming appointments visually.
                                    </p>
                                </div>
                            </div>

                            {/* Resources */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-warning bg-warning-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Resources</h5>
                                    <p>
                                        Access important materials, guides, or tools curated specifically to help
                                        coordinators deliver better support. <br />
                                        Download official banners and logos for events or communication material.
                                    </p>
                                </div>
                            </div>

                            {/* Chatrooms */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-info bg-info-subtle shadow-sm">
                                    <h5 className="fw-semibold" >Chatrooms</h5>
                                    <p>
                                        Engage in discussions with either <strong>listeners</strong> or other{" "}
                                        <strong>coordinators</strong>. These spaces offer a safe place to share tips
                                        or get clarifications.
                                    </p>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-danger bg-danger-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Feedback</h5>
                                    <p>
                                        Just like listeners, coordinators can also share feedback. Whether it's about
                                        a session or an idea for improvement, your input is valued.
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
