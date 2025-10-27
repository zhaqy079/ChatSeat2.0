import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import CoordinatorSidebar from "./CoordinatorSidebar";

export default function CoordinatorDashboard() {
    const user = useSelector((s) => s.loggedInUser?.success);

    return (
        <div>
            <div className="d-flex dashboard-page-content ">
                <CoordinatorSidebar />
                <div className="flex-grow-1 p-4">
                    <div className="d-flex flex-column gap-4">
                        <div className="card shadow-sm coordinator-card border-0">
                            <div className="card-body">
                                <h4 className="card-title">Welcome Coordinator</h4>
                                <h6 className="card-text">Hi Coordinator, Today's bookings at a glance.</h6>
                                <p className="card-text">Have a Chat Seat is a volunteer-driven program connecting people in libraries,
                                    shopping centres, and online spaces to share conversations and reduce loneliness.
                                </p>
                            </div>
                        </div>
                        <div className="card shadow-sm coordinator-card border-0">
                            <div className="card-body">
                                <h4 className="card-title">Quick add booking for listeners</h4>
                                <p>more will be added</p>
                            </div>
                        </div>
                        <div className="card shadow-sm coordinator-card border-0">
                            <div className="card-body">
                                <h4 className="card-title">When Coordinator click schedule</h4>
                                <p>more will be added</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}