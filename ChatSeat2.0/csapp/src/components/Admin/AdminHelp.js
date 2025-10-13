import AdminSidebar from "./AdminSidebar";
//import { useSelector } from "react-redux";


export default function AdminHelp() {
    return (

        <divv>


            <div className="d-flex dashboard-page-content">

                {/*you can take this out if you want i left this for user to easily navigate to other pages */}
                <AdminSidebar />
                <aside
                    className="sticky-top bg-white border-end"
                    style={{ top: "56px", height: "calc(100vh - 56px)" }}
                >

                </aside>

                {/* Main Content */}
                <div className="flex-grow-1 px-3 px-md-5 py-4">
                    <div className="container bg-white rounded shadow-sm p-4 p-md-5 text-dark">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold text-primary mb-2">How to Use the Website</h2>
                            <p>
                                Follow this quick guide to manage users, monitor feedback, and support platform communication.
                            </p>
                        </div>



                        <div className="row g-4">

                            {/* Scheduling Settings */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 bg-light border-primary bg-primary-subtle shadow-sm">
                                    <h5 className="fw-semibold">Scheduling Settings</h5>
                                    <p className="mb-2">Use this section to manage time availability for each location:</p>
                                    <ul className="list-unstyled ms-3 small text-dark">
                                        <li>
                                            <strong>Add or delete locations</strong> that offer availability.
                                        </li>
                                        <li>
                                            <strong>Select a calendar date</strong> to add/edit events for the week.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* View All Users */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-info bg-info-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">View All Users</h5>
                                    <p className="mb-2">This section includes three tabs to manage users on the platform:</p>
                                    <ul className="list-unstyled ms-3 small text-dark">
                                        <li>
                                            <strong>Pending Users:</strong> Approve users to add them to the team.
                                        </li>
                                        <li>
                                            <strong>View All Users:</strong> Modify users roles or delete if necessary.
                                        </li>
                                        <li>
                                            <strong>Coordinators:</strong> View all coordinators to modify their roles or delete if needed.
                                        </li>
                                        <li>
                                            <strong>Admins:</strong> View admins to modify their roles or delete if necesaary.
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Manage Locations */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-success bg-success-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Manage Locations</h5>
                                    <p>
                                        The Admin can view all locations created on for scheduling. 
                                    </p>
                                </div>
                            </div>

                            {/* General Forum */}
                            <div className="col-12 col-md-6">
                                <div className="p-4 rounded border-start border-4 border-warning bg-warning-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">General Forum</h5>
                                    <p>
                                        The admin can access both <strong>listeners</strong> and <strong>coordinators</strong> chatrooms.
                                        Use these to guide users, share updates or provide help when questions arise.
                                    </p>
                                </div>
                            </div>

                            {/* Feedback */}
                            <div className="col-12">
                                <div className="p-4 rounded border-start border-4 border-primary bg-primary-subtle shadow-sm">
                                    <h5 className="fw-semibold mb-2">Feedback</h5>
                                    <p>
                                        View feedback from both <strong>listeners</strong> and <strong>coordinators</strong>.
                                        Select Resolve when feedback post has been taken care of.
                                    </p>
                                </div>
                            </div>

                            
                        </div>

                    </div>
                </div>
            </div>
        </divv>
    );
}
