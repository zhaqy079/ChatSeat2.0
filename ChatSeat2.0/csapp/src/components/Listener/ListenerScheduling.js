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
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [showEventPopup, setShowEventPopup] = useState(false);
    const [clickedEvent, setClickedEvent] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                // Fetch locations
                const { data: locs } = await supabase
                    .from("venue_locations")
                    .select("location_id, location_name");
                setLocations(locs || []);

                // Fetch bookings
                const { data: bookings, error } = await supabase
                    .from("bookings")
                    .select(`
                      booking_id,
                      location_id,
                      booking_date,
                      start_time,
                      end_time,
                      created_by,
                      user_profiles ( first_name, last_name )
                    `);

                if (error) throw error;

                const calendarEvents = bookings.map((b) => {
                    const loc = locs.find((l) => l.location_id === b.location_id);
                    const [sh, sm] = (b.start_time || "00:00").split(":");
                    const [eh, em] = (b.end_time || "23:59").split(":");

                    const isUnavailable = loc?.location_name === "FULL DAY UNAVAILABLE";
                    const eventColor = isUnavailable ? "#ff9999" : "yellow"; 

                    const displayName = isUnavailable
                        ? "FULL DAY UNAVAILABLE" 
                        : (b.created_by && b.user_profiles
                            ? `${b.user_profiles.first_name} ${b.user_profiles.last_name}`
                            : "Available");

                    return {
                        id: b.booking_id,
                        title: `${displayName}`,
                        location_id: b.location_id,
                        start: `${b.booking_date}T${sh.padStart(2, "0")}:${sm.padStart(2,"0")}:00`,
                        end: `${b.booking_date}T${eh.padStart(2, "0")}:${em.padStart(2,"0")}:00`,
                        color: eventColor,
                        textColor: "black",
                    };
                });

                setEvents(calendarEvents);
            } catch (err) {
                console.error(err);
            }
        };

        fetchBookings();
    }, []);

    // filter events with slected location
    const unavailableLocation = locations.find(loc => loc.location_name === "FULL DAY UNAVAILABLE");
    const unavailableId = unavailableLocation?.location_id;

    const filteredEvents = selectedLocation
        ? events.filter(
            (e) => e.location_id === selectedLocation || e.location_id === unavailableId
        )
        : [];

    const handleEventClick = (clickInfo) => {

        if (clickInfo.event.title === "FULL DAY UNAVAILABLE") {
            return; 
        }

        setClickedEvent(clickInfo.event);
        setShowEventPopup(true);
    };

    // books the event for the logged in user
    const handleBook = async () => {

        if (!user || !user.id) {
            alert("Please login to book a slot!");
            return;
        }

        if (!clickedEvent) return;

        const { error } = await supabase
            .from("bookings")
            .update({ created_by: user.id })   
            .eq("booking_id", clickedEvent.id); 

        if (error) {
            alert("Failed to book the slot. Try again!");
            console.error(error);
        } else {
            alert("Slot booked successfully!");
            setShowEventPopup(false);
        }
    };

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

                        {/* Booking event details */}
                        {showEventPopup && clickedEvent && (
                            <div className="modal show d-block" tabIndex="-1">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title">Event Details</h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                onClick={() => setShowEventPopup(false)}
                                            ></button>
                                        </div>
                                        <div className="modal-body">
                                            <p><strong>Location:</strong> {clickedEvent.title}</p>
                                            <p>
                                                <strong>Date:</strong>{" "}
                                                {clickedEvent.start.toLocaleDateString("en-AU")}
                                            </p>
                                            <p>
                                                <strong>Time:</strong>{" "}
                                                {clickedEvent.start.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                -{" "}
                                                {clickedEvent.end.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </p>
                                        </div>
                                        <div className="modal-footer">
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() => setShowEventPopup(false)}
                                            >
                                                Close
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleBook()}
                                            >
                                                Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
            
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
                                            <button type=" button" className="btn btn-primary">Reschedule</button>
                                            <button type="button" className="btn btn-danger">Cancel</button>
                                        </div>
                                    </div>

                                    <div className="border p-3 rounded shadow-sm mb-3 card-panel">
                                        <p><strong>Date:</strong> Wed 26 Sep</p>
                                        <p><strong>Time:</strong> 11:00</p>
                                        <p><strong>Location:</strong> Campbelltown Library</p>
                                        <div className="mt-2 flex space-x-2">
                                            <button type="button" className="btn btn-primary">Reschedule</button>
                                            <button type="button" className="btn btn-danger">Cancel</button>
                                        </div>
                                    </div>
                            </div>
                                )}

                                {activeTab === "Book" && (
                                    <div className="card-panel p-4 sm:p-6 rounded shadow w-full">
                                        <h3 className="text-xl font-bold mb-3">Book a Slot</h3>

                                        {/*location dropdown */}
                                        <select
                                            className="location-dropdown"
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                        >
                                            <option value="">Select Location</option>
                                            {locations.filter(loc => loc.location_name !== "FULL DAY UNAVAILABLE").map((loc) => (
                                                <option key={loc.location_id} value={loc.location_id}>
                                                    {loc.location_name}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="calendar-size">
                                            <FullCalendar
                                                plugins={[timeGridPlugin]}
                                                initialView="timeGridWeek"
                                                height={550}
                                                locale="en-AU"
                                                events={filteredEvents}
                                                editable={false}
                                                selectable={false}
                                                allDaySlot={false}
                                                eventTimeFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
                                                eventClick={handleEventClick}
                                            />
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Calendar" && (
                                 <div className="card-panel p-4 sm:p-6 rounded shadow w-full">
                                        <h3 className="text-xl font-bold mb-3">Calendar View</h3>

                                        {/*location dropdown */}
                                        <select
                                            className="location-dropdown"
                                            value={selectedLocation}
                                            onChange={(e) => setSelectedLocation(e.target.value)}
                                        >
                                            <option value="">Select Location</option>
                                            {locations.filter(loc => loc.location_name !== "FULL DAY UNAVAILABLE").map((loc) => (
                                                <option key={loc.location_id} value={loc.location_id}>
                                                    {loc.location_name}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="calendar-size">
                                            <FullCalendar
                                                plugins={[timeGridPlugin]}
                                                initialView="timeGridWeek"
                                                height={550}
                                                events={filteredEvents}
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