import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import CoordinatorSidebar from "./CoordinatorSidebar";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


export default function CoordinatorAvailability() {
    const [locations, setLocations] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");

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
                        listener_ids
                    `);
                if (error) throw error;

                // Fetch all user profiles
                const { data: allProfiles } = await supabase
                    .from("user_profiles")
                    .select("profile_id, first_name, last_name");

                // Map bookings to calendar events
                const calendarEvents = bookings.map((b) => {
                    const loc = locs.find(l => l.location_id === b.location_id);
                    const [sh, sm] = (b.start_time || "00:00").split(":");
                    const [eh, em] = (b.end_time || "23:59").split(":");

                    const isUnavailable = loc?.location_name === "FULL DAY UNAVAILABLE";
                    const eventColor = isUnavailable ? "#ff9999" : "yellow";

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

                    // Map IDs to user names
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
                console.error("Error fetching bookings:", err);
            }
        };

        fetchBookings();
    }, []);

    const unavailableLocation = locations.find(loc => loc.location_name === "FULL DAY UNAVAILABLE");
    const unavailableId = unavailableLocation?.location_id;

    const filteredEvents = selectedLocation
        ? events.filter(
            (e) => e.location_id === selectedLocation || e.location_id === unavailableId
        )
        : [];

    return (
        <div className="d-flex dashboard-page-content">
            <aside>
                <CoordinatorSidebar />
            </aside>
            <div className="flex-grow-1 px-3 px-md-4 py-4">
                <h4 className="fw-bold mb-4 text-primary">Calendar View</h4>
                <div className="card-panel p-4 sm:p-6 rounded shadow w-full">
                    <select
                        className="location-dropdown mb-3"
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
                            events={filteredEvents}
                            locale="en-AU"
                            allDaySlot={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
