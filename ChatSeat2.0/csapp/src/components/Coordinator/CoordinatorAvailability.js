import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import CoordinatorSidebar from "./CoordinatorSidebar";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    "https://nuarimunhutwzmcknhwj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YXJpbXVuaHV0d3ptY2tuaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTk2MjIsImV4cCI6MjA3MTIzNTYyMn0.fwdTA0n_vSrT_kUqlExIPdDpPrHo_fRIkOUcd5aHi0c"
);

export default function CoordinatorAvailability() {
    const [locations, setLocations] = useState([]);
    const [events, setEvents] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data: locs } = await supabase
                    .from("venue_locations")
                    .select("location_id, location_name");
                setLocations(locs || []);

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
                        : (b.created_by
                            ? b.user_profiles
                                ? `${b.user_profiles.first_name} ${b.user_profiles.last_name}`
                                : "Booked"
                            : "Available");

                    return {
                        id: b.booking_id,
                        title: displayName,
                        location_id: b.location_id,
                        start: `${b.booking_date}T${sh.padStart(2, "0")}:${sm.padStart(2, "0")}:00`,
                        end: `${b.booking_date}T${eh.padStart(2, "0")}:${em.padStart(2, "0")}:00`,
                        color: eventColor,
                        textColor: "black",
                        created_by: b.created_by,
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
        : events;


    return (
        <div className="d-flex dashboard-page-content ">
            {/* Sidebar on the left */}
            <aside>
                <CoordinatorSidebar />
            </aside>
            {/* Right content area */}
            <div className="flex-grow-1 px-3 px-md-4 py-4">
                <h4 className="fw-bold mb-4 text-primary">Calendar View</h4>
                <div className="card-panel p-4 sm:p-6 rounded shadow w-full">

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

