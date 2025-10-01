import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
//import ListenerNavbar from "./ListenerNavbar";
import ListenerSideBar from "./ListenerSideBar";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import '../../index.css';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    "https://nuarimunhutwzmcknhwj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YXJpbXVuaHV0d3ptY2tuaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTk2MjIsImV4cCI6MjA3MTIzNTYyMn0.fwdTA0n_vSrT_kUqlExIPdDpPrHo_fRIkOUcd5aHi0c"
);
export default function ListenerScheduling() {
    const [activeTab, setActiveTab] = useState("Upcoming");
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data: locs } = await supabase.from("venue_locations").select("location_id, location_name");
                const { data: bookings } = await supabase.from("bookings").select("*");

                const calendarEvents = bookings.map(b => {
                    const loc = locs.find(l => l.location_id === b.location_id);
                    const [sh, sm] = (b.start_time || "00:00").split(":");
                    const [eh, em] = (b.end_time || "23:59").split(":");

                    return {
                        id: b.booking_id,
                        title: loc?.location_name || "Unknown location",
                        start: `${b.booking_date}T${sh.padStart(2, "0")}:${sm.padStart(2, "0")}:00`,
                        end: `${b.booking_date}T${eh.padStart(2, "0")}:${em.padStart(2, "0")}:00`,
                        color: "#007bff",
                        textColor: "white"
                    };
                });

                setEvents(calendarEvents);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBookings();
    }, []);


    return (
         <div className="d-flex  dashboard-page-bg ">
                  {/* Sidebar on the left */}
                  <aside>
                        <ListenerSideBar />
                  </aside>
                   {/* Right content area */}
                   <div className="flex-1 p-4 sm:p-6">
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

                                        {/* location dropdown */}
                                        <select className="location-dropdown">
                                            <option value="">Select Location</option>
                                            <option value="loc1">Campbelltown Library</option>
                                            <option value="loc2">Other Location</option>
                                            <option value="loc3">Another Location</option>
                                        </select>

                                        <div className="calendar-size">
                                            <FullCalendar
                                                plugins={[timeGridPlugin]}
                                                initialView="timeGridWeek"
                                                height={550}
                                                locale="en-AU"
                                                events={events}
                                                editable={false}
                                                selectable={false}
                                                allDaySlot={false}
                                                eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Calendar" && (
                                 <div className="card-panel p-4 sm:p-6 rounded shadow w-full">
                                        <h3 className="text-xl font-bold mb-3">Calendar View</h3>

                                        {/* location dropdown */}
                                        <select className="location-dropdown">
                                            <option value="">Select Location</option>
                                            <option value="loc1">Campbelltown Library</option>
                                            <option value="loc2">Other Location</option>
                                            <option value="loc3">Another Location</option>
                                        </select>

                                        <div className="calendar-size">
                                            <FullCalendar
                                                plugins={[timeGridPlugin]}
                                                initialView="timeGridWeek"
                                                height={550}
                                                locale="en-AU"
                                                allDaySlot={false}
                                            />
                                        </div>
                                    </div>
                    
                                 )}
                       </div>
        </div>
    );
}