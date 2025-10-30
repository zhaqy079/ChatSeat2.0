import React, { useState, useEffect } from "react";
//import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ListenerSideBar from "./ListenerSideBar";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import '../../index.css';
import { supabase } from "../../supabaseClient";
import userIcon from "../../assets/icons/icons8-user-48.png";



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
        fetchBookings();
    }, []);

    // debugging checking user loggen in info
    useEffect(() => {
        const fetchUserProfile = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                console.log("Logged-in Supabase user:", user);

                const { data: profile, error } = await supabase
                    .from("user_profiles")
                    .select("*")
                    .eq("profile_id", user.id)
                    .single();

                if (error) {
                    console.error("Error fetching user profile:", error);
                } else {
                    console.log("User profile from Supabase table:", profile);
                }
            } else {
                console.log("No user currently logged in.");
            }
        };

        fetchUserProfile();
    }, []);

    // fetches all bookings and locations from the supabase db
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
                listener_ids
            `);
            if (error) throw error;

            // Fetch all user profiles at once
            const { data: allProfiles } = await supabase
                .from("user_profiles")
                .select("profile_id, first_name, last_name");

            const calendarEvents = bookings.map((b) => {
                const loc = locs.find((l) => l.location_id === b.location_id);
                const [sh, sm] = (b.start_time || "00:00").split(":");
                const [eh, em] = (b.end_time || "23:59").split(":");

                const isUnavailable = loc?.location_name === "FULL DAY UNAVAILABLE";
                const eventColor = isUnavailable ? "#ff9999" : "yellow";

                // Parse listener_ids for safely
                let listenerIds = [];
                try {
                    listenerIds = Array.isArray(b.listener_ids)
                        ? b.listener_ids
                        : b.listener_ids
                            ? JSON.parse(b.listener_ids)
                            : [];
                } catch {
                    listenerIds = [];
                }

                // Map the listener IDs to names
                const bookedUsers = listenerIds.map(id => {
                    const profile = allProfiles.find(p => p.profile_id === id);
                    return profile ? { id, name: `${profile.first_name} ${profile.last_name}` } : null;
                }).filter(Boolean);

                const displayName = isUnavailable
                    ? "FULL DAY UNAVAILABLE"
                    : bookedUsers.length > 0
                        ? bookedUsers.map(u => u.name).join(", ")
                        : "Available";

                return {
                    id: b.booking_id,
                    title: displayName,
                    location_id: b.location_id,
                    start: `${b.booking_date}T${sh.padStart(2, "0")}:${sm.padStart(2, "0")}:00`,
                    end: `${b.booking_date}T${eh.padStart(2, "0")}:${em.padStart(2, "0")}:00`,
                    color: eventColor,
                    textColor: "black",
                    listener_ids: listenerIds,
                    bookedUsers,
                };
            });

            setEvents(calendarEvents);
        } catch (err) {
            console.error(err);
        }
    };

    // filter events with slected location
    const unavailableLocation = locations.find(loc => loc.location_name === "FULL DAY UNAVAILABLE");
    const unavailableId = unavailableLocation?.location_id;

    const filteredEvents = selectedLocation
        ? events.filter(
            (e) => e.location_id === selectedLocation || e.location_id === unavailableId
        )
        : [];

    const handleEventClick = (clickInfo) => {

        const clicked = clickInfo.event;

        if (!user || !user.id) {
            alert("Please log in to manage bookings.");
            return;
        }

        if (clicked.title === "FULL DAY UNAVAILABLE") return;

        const eventDetails = events.find(e => e.id === clicked.id);
        setClickedEvent(eventDetails);
        setShowEventPopup(true);
    };

    // books the event for the logged in user
    const handleBook = async (eventId) => {
        if (!user?.id || !eventId) return;

        const bookingToUpdate = events.find(e => e.id === eventId);
        if (!bookingToUpdate) return;

        const currentListeners = Array.isArray(bookingToUpdate.listener_ids)
            ? bookingToUpdate.listener_ids
            : [];

        if (currentListeners.includes(user.id)) {
            alert("You already booked this slot.");
            return;
        }

        const updatedListeners = [...currentListeners, user.id];

        const { error } = await supabase
            .from("bookings")
            .update({ listener_ids: JSON.stringify(updatedListeners) })
            .eq("booking_id", eventId);

        if (error) {
            alert("Failed to book the slot. Try again!");
            console.error(error);
        } else {
            alert("Slot booked successfully!");
            fetchBookings(); 
        }
    };

    // cancel booking for the logged in user
    const handleUnbook = async (eventId) => {
        if (!user?.id) return;

        const bookingToUpdate = events.find(e => e.id === eventId);
        if (!bookingToUpdate) return;

        const currentListeners = Array.isArray(bookingToUpdate.listener_ids)
            ? bookingToUpdate.listener_ids
            : [];

        const updatedListeners = currentListeners.filter(id => id !== user.id);

        const { error } = await supabase
            .from("bookings")
            .update({ listener_ids: JSON.stringify(updatedListeners) })
            .eq("booking_id", eventId);

        if (error) {
            alert("Failed to unbook the slot. Try again!");
            console.error(error);
        } else {
            alert("You have successfully unbooked this slot.");
            fetchBookings(); 
        }
    };

    return (
        <div className="d-flex dashboard-page-scheduling">
                  {/* Sidebar*/}
                  <aside>
                        <ListenerSideBar />
                  </aside>
                   {/* Right content area */}
                     <div className="flex-grow-1 px-3 px-md-4 py-4">
                          {/* Tabs row */}
                         <div className="flex flex-wrap gap-4 mb-6">
                                {["Upcoming", "Book"].map((tab) => (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`tab-button ${activeTab === tab ? "tab-active" : "tab-inactive"
                                            }`}
                                    >
                                        {tab === "Book" ? "Book a Slot" : "Upcoming Bookings"}
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
                                            {/* Location */}
                                            <p>
                                                <strong>Location:</strong>{" "}
                                                {locations.find(l => l.location_id === clickedEvent.location_id)?.location_name || "Unknown"}
                                            </p>

                                            {/* Booked Users */}
                                            <p>
                                               <strong>Booked Users:</strong>{" "}
                                                {clickedEvent.bookedUsers?.length > 0
                                                    ? clickedEvent.bookedUsers.map(u => u.name).join(", ")
                                            : "None"}
                               
                                            </p>

                                            {/* Date */}
                                            <p>
                                                <strong>Date:</strong>{" "}
                                                {new Date(clickedEvent.start).toLocaleDateString("en-AU")}
                                            </p>

                                            {/* Time */}
                                            <p>
                                                <strong>Time:</strong>{" "}
                                                {new Date(clickedEvent.start).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}{" "}
                                                -{" "}
                                                {new Date(clickedEvent.end).toLocaleTimeString([], {
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
                                                className="btn btn-danger"
                                                onClick={() => handleUnbook(clickedEvent.id)}
                                            >
                                                Unbook
                                            </button>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleBook(clickedEvent.id)}
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
                                <h3 className="text-xl font-bold mb-6 intro-title">Upcoming Bookings</h3>

                                {events.filter(e => new Date(e.start) > new Date()).length === 0 ? (
                                    <p>No upcoming bookings.</p>
                        ) : (

                                    //<div className="row upcoming-scroll-container">
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3 upcoming-scroll-container">
                                        {events
                                            .filter(e => new Date(e.start) > new Date())
                                            .sort((a, b) => new Date(a.start) - new Date(b.start))
                                            .map(e => {
                                                const isBooked = e.listener_ids.includes(user?.id);
                                                return (
                                                    <div key={e.id} className="border p-4 rounded shadow-sm card-panel w-25">
                                                        <p className="mb-1"><strong>Date:</strong> {new Date(e.start).toLocaleDateString("en-AU")}</p>
                                                        <p className="mb-1"><strong>Time:</strong> {new Date(e.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - {new Date(e.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                                                        <p className="mb-1"><strong>Location:</strong> {locations.find(l => l.location_id === e.location_id)?.location_name || "Unknown"}</p>

                                                      
                                                        <p className="mb-1"><strong>Booked Users:</strong></p>
                                                        <div className="ms-2">
                                                            {(e.bookedUsers?.length ? e.bookedUsers : [{ name: "Unassigned" }]).map((u, i) => (
                                                                <div key={i} className="d-flex align-items-center text-dark mb-1">
                                                                    <img src={userIcon} alt="" className="icon me-2" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                                                    <span>{u.name}</span>
                                                                </div>
                                                            ))}
                                                            </div>
                                                        

                                                        <div className="mt-1 flex space-x-2">
                                                            {isBooked ? (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger"
                                                                    onClick={() => handleUnbook(e.id)}
                                                                >
                                                                    Unbook
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-primary"
                                                                    onClick={() => handleBook(e.id)}
                                                                >
                                                                    Book
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                    </div>
                                )}
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

                                <div className="bg-white p-2 rounded shadow">
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
                </div>
        </div>
    );
}