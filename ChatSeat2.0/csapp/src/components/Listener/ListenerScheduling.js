import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ListenerSideBar from "./ListenerSideBar";

export default function ListenerScheduling() {
    const [activeTab, setActiveTab] = useState("Upcoming");

    return (
         <div className="d-flex dashboard-page-content ">
                  {/* Sidebar*/}
                  <aside>
                        <ListenerSideBar />
                  </aside>
                   {/* Right content area */}
                     <div className="flex-grow-1 px-3 px-md-4 py-4">
                          {/* Tabs row */}
                         <div className="flex flex-wrap gap-4 mb-6">
                                {["Upcoming", "Book", "Calendar"].map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`tab-button ${activeTab === tab ? "tab-active" : "tab-inactive"
                                            }`}
                                    >
                                        {tab === "Book"
                                            ? "Book a Slot"
                                            : tab === "Calendar"
                                                ? "Calendar View"
                                                : "Upcoming Bookings"}
                                    </button>
                                ))}
                        </div>
            
                        {/* Display Upcoming content*/}
                        {activeTab === "Upcoming" && (
                                    <div className="min-h-screen">
                                            <h3 className="text-xl font-bold mb-3 intro-title">Your Upcoming Bookings</h3>
                                    

                                    {/* Example cards */}
                                        <div className=" p-3 rounded shadow-sm mb-3 card-panel">
                                             
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
                                )}

                                {activeTab === "Book" && (
                                <div className="card-panel p-4 sm:p-6 rounded shadow w-full">
                                        <h3 className="text-xl font-bold mb-3">Book a Slot</h3>
                                        <p className="text-muted mb-0">
                                        <p className="text-muted mb-0">Coming soon.</p>
                                        </p>
                                    </div>
                                )}

                                {activeTab === "Calendar" && (
                                 <div className="card-panel p-4 sm:p-6 rounded shadow w-full">
                                        <h3 className="text-xl font-bold mb-3">Calendar View</h3>
                                        <p className="text-muted mb-0">Coming soon.</p>
                                    </div>
                    
                            )}
                       </div>
        </div>
    );
}