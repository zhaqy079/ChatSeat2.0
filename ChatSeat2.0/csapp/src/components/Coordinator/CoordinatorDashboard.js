//import CoordinatorNavbar from "./CoordinatorNavbar"; 
import CoordinatorSidebar from "./CoordinatorSidebar";

export default function CoordinatorDashboard() {
    return (
        <div>
            <div className="d-flex">
                <CoordinatorSidebar />
                <div className="flex-grow-1 p-4">
                    <div className="d-flex flex-column gap-4">
                        <div className="card shadow-sm coordinator-card border-0">
                            <div className="card-body">
                                <h4 className="card-title">Dashboard: Welcome Coordinator</h4>
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