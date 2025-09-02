import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
//import ListenerNavbar from "./ListenerNavbar";
import ListenerSideBar from "./ListenerSideBar";

export default function ListenerScheduling() {
    const [activeTab, setActiveTab] = useState("Upcoming");

    return (
        <div>
            {activeTab === "Upcoming" && (
        <>

                    <div className="d-flex  dashboard-page-bg ">
                        {/* Sidebar on the left */}
                       <aside>
                            <ListenerSideBar />
                        </aside>
                        <div className="min-h-screen">
                            <div className="container py-5 ">
                        <h3 className="text-xl font-bold mb-3 intro-title">Your Upcoming Bookings</h3>

                        {/* Example cards */}
                                <div className="border p-3 rounded shadow-sm mb-3 card-panel">
                            <p><strong>Date:</strong> Tue 25 Sep</p>
                            <p><strong>Time:</strong> 10:00</p>
                            <p><strong>Location:</strong> Campbelltown Library</p>
                            <div className="mt-2 flex space-x-2">
                                <button type=" button" class="btn btn-primary">Reschedule</button>
                                <button type="button" class="btn btn-danger">Cancel</button>
                            </div>
                        </div>

                                <div className="border p-3 rounded shadow-sm mb-3 card-panel">
                            <p><strong>Date:</strong> Wed 26 Sep</p>
                            <p><strong>Time:</strong> 11:00</p>
                            <p><strong>Location:</strong> Campbelltown Library</p>
                            <div className="mt-2 flex space-x-2">
                                <button type="button" class="btn btn-primary">Reschedule</button>
                                <button type="button" class="btn btn-danger">Cancel</button>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                    </>
                )}

        </div>
    );
}