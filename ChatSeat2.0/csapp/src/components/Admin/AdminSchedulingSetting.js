import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { createClient } from '@supabase/supabase-js';


// if you get an error for packages of fullcalendar not installed, run this command in terminal
// npm install @fullcalendar/react @fullcalendar/timegrid @fullcalendar/interaction

// NOTE for callum, i think i got most of it working i just need to fix blocking full day events to save to the db
// however if there is something you think can be improved or changed please let me know

const supabase = createClient(
    "https://nuarimunhutwzmcknhwj.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51YXJpbXVuaHV0d3ptY2tuaHdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2NTk2MjIsImV4cCI6MjA3MTIzNTYyMn0.fwdTA0n_vSrT_kUqlExIPdDpPrHo_fRIkOUcd5aHi0c"
);

export default function AdminSchedulingSetting() {
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [events, setEvents] = useState([]); // events are saved here so we can save it to the DB later once API is ready

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [blockFullDay, setBlockFullDay] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringWeeks, setRecurringWeeks] = useState(1); 

    const calendarRef = useRef(null);



    // updates the calendar when the user selects a particular week
    useEffect(() => {
        if (selectedWeek && calendarRef.current) {
            const [year, week] = selectedWeek.split("-W").map(Number);
            const firstDayOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
            calendarRef.current.getApi().gotoDate(firstDayOfWeek);
        }

        // this is where the api logic will need to fetch the location from the db for location and events (HELP)
        const fetchData = async () => {
            try {
                // Fetch all locations
                const { data: locs, error: locError } = await supabase
                    .from("venue_locations")
                    .select("location_id, location_name");
                if (locError) throw locError;

                setLocations(locs.map(loc => ({ id: loc.location_id, name: loc.location_name })));

                // Fetch bookings
                const { data: bookings, error: bookingsError } = await supabase
                    .from("bookings")
                    .select("*");
                if (bookingsError) throw bookingsError;

                // Map bookings to FullCalendar events
                const eventsData = bookings.map(booking => {
                    const location = locs.find(loc => loc.location_id === booking.location_id);

                    // Fallback to 00:00 / 23:59 if missing
                    const startTime = booking.start_time || "00:00";
                    const endTime = booking.end_time || "23:59";

                    // Make sure time set as this HH:MM:SS for ISO format
                    const startParts = startTime.split(":").map(num => num.padStart(2, "0"));
                    const endParts = endTime.split(":").map(num => num.padStart(2, "0"));

                    const startISO = `${booking.booking_date}T${startParts[0]}:${startParts[1]}:00`;
                    const endISO = `${booking.booking_date}T${endParts[0]}:${endParts[1]}:00`;

                    const start = new Date(startISO);
                    const end = new Date(endISO);

                    return {
                        id: booking.booking_id,
                        title: location ? location.location_name : "Unknown location",
                        start,
                        end,
                        color: "blue",
                        textColor: "white",
                        extendedProps: { type: "location" },
                    };
                });

                console.log("All fetched events:", eventsData);

                setEvents(eventsData);
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };

        fetchData();
    }, [selectedWeek]);

    const handleAddLocation = async () => {

        const trimmedName = newLocation.trim();
        if (!trimmedName) return;

        const isDuplicate = locations.some(
            (loc) => loc.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (isDuplicate) {
            alert("This location is already added");
            return;
        }

        try {
            // Insert new location into Supabase
            // BIG NOTE : location_address is required in the db so i had to default it to "TBD" for now
            const { data, error } = await supabase
                .from("venue_locations")
                .insert([{ location_name: trimmedName, location_address: "TBD" }])
                .select(); 

            if (error) {
                console.error("Error adding location:", error.message);
                return;
            }

            console.log("Inserted location data:", data); 

            if (data && data.length > 0) {
                const addedLocation = { id: data[0].location_id, name: data[0].location_name };
                setLocations(prev => [...prev, addedLocation]); 
                setNewLocation(""); 
                console.log("Location added successfully!", addedLocation);
            }
        } catch (err) {
            console.error("Unexpected error adding location:", err);
        }
    };


    const handleDeleteLocation = async (id) => {
        if (!window.confirm("Are you sure you want to delete this location?")) return;

        try {
            // Delete location from Supabase
            const { error } = await supabase
                .from("venue_locations")
                .delete()
                .eq("location_id", id);

            if (error) {
                console.error("Error deleting location:", error.message);
                return;
            }

            // Update local state
            setLocations(locations.filter((loc) => loc.id !== id));

            // remove any events linked to this location from state, maybe check 
            setEvents(events.filter(ev => ev.extendedProps?.type !== "location" || ev.title !== locations.find(l => l.id === id)?.name));


            console.log("Location deleted successfully!");
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    // The open modal for adding any new dates
    const handleDateClick = (info) => {
        const clickedDay = new Date(info.date);
        const dayStart = new Date(clickedDay.setHours(0, 0, 0, 0));
        const dayEnd = new Date(clickedDay.setHours(23, 59, 59, 999));

        const isBlocked = events.some(
            (ev) =>
                ev.extendedProps?.type === "unavailable" &&
                ev.start <= dayEnd &&
                ev.end >= dayStart
        );

        // incase the user somehow add a location on a blocked day
        if (isBlocked) {
            alert("This day is blocked as unavailable. Edit the block event instead.");
            return;
        }

        setSelectedSlot(info.date);
        setSelectedEvent(null);
        setSelectedLocation("");

        const startH = info.date.getHours().toString().padStart(2, "0");
        const startM = info.date.getMinutes().toString().padStart(2, "0");
        setSelectedStartTime(`${startH}:${startM}`);

        const end = new Date(info.date);
        end.setHours(end.getHours() + 1);
        const endH = end.getHours().toString().padStart(2, "0");
        const endM = end.getMinutes().toString().padStart(2, "0");
        setSelectedEndTime(`${endH}:${endM}`);

        setBlockFullDay(false);
        setIsRecurring(false);
        setRecurringWeeks(1); 
        setModalOpen(true);
    };

    // the open modal for editing dates in the calendar
    const handleEventClick = (clickInfo) => {
        setSelectedEvent(clickInfo.event.id);
        setSelectedSlot(clickInfo.event.start);

        // Determine event type
        const eventType = clickInfo.event.extendedProps?.type;
        setBlockFullDay(eventType === "unavailable");

        // Only pre-fill location if not a full day block
        setSelectedLocation(eventType === "unavailable" ? "" : clickInfo.event.title);

        const startH = clickInfo.event.start.getHours().toString().padStart(2, "0");
        const startM = clickInfo.event.start.getMinutes().toString().padStart(2, "0");
        const endH = clickInfo.event.end.getHours().toString().padStart(2, "0");
        const endM = clickInfo.event.end.getMinutes().toString().padStart(2, "0");

        setSelectedStartTime(`${startH}:${startM}`);
        setSelectedEndTime(`${endH}:${endM}`);

        setIsRecurring(clickInfo.event.extendedProps?.recurring || false);
        setRecurringWeeks(clickInfo.event.extendedProps?.recurringWeeks || 1);

        setModalOpen(true);
    };

    const handleBlockFullDayChange = (checked) => {
        setBlockFullDay(checked);
        if (checked) setSelectedLocation(""); 
    };

    const handleSaveEvent = async () => {
        const locationTrimmed = selectedLocation.trim();

        if (!blockFullDay && !locationTrimmed) {
            alert("Please select a location!");
            return;
        }

        if (isRecurring && (!recurringWeeks || recurringWeeks < 1)) {
            alert("Please enter a valid number of weeks for recurrence!");
            return;
        }

        const startDate = new Date(selectedSlot);
        const endDate = new Date(selectedSlot);

        if (blockFullDay) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(23, 59, 0, 0);
        } else {
            const [startH, startM] = selectedStartTime.split(":");
            startDate.setHours(+startH, +startM, 0, 0);
            const [endH, endM] = selectedEndTime.split(":");
            endDate.setHours(+endH, +endM, 0, 0);

            if (endDate <= startDate) {
                alert("End time must be after start time!");
                return;
            }
        }

        const weekday = startDate.getDay();
        const eventId = selectedEvent || Date.now().toString();
        let newEvents = [];

        try {
            for (let i = 0; i < (isRecurring ? recurringWeeks : 1); i++) {
                const newStart = new Date(startDate);
                newStart.setDate(startDate.getDate() + i * 7);
                const newEnd = new Date(endDate);
                newEnd.setDate(endDate.getDate() + i * 7);

                
                const pad = (n) => n.toString().padStart(2, "0");

                const booking_date = `${newStart.getFullYear()}-${pad(newStart.getMonth() + 1)}-${pad(newStart.getDate())}`;
                const start_time = `${pad(newStart.getHours())}:${pad(newStart.getMinutes())}`;
                const end_time = `${pad(newEnd.getHours())}:${pad(newEnd.getMinutes())}`;


                // Only save if not a full-day block
                if (!blockFullDay) {
                    const locationObj = locations.find(loc => loc.id === selectedLocation);
                    const locationName = locationObj ? locationObj.name : "Unknown location";

                    const { data, error } = await supabase
                        .from("bookings")
                        .insert([{
                            booking_date,
                            start_time,
                            end_time,
                            location_id: selectedLocation, 
                            created_at: new Date().toISOString()
                        }])
                        .select();

                    if (error) {
                        console.error("Error saving booking:", error.message);
                        continue;
                    }

                    newEvents.push({
                        id: data[0].booking_id,
                        title: locationName, 
                        start: newStart,
                        end: newEnd,
                        color: "blue",
                        textColor: "white",
                        display: "auto",
                        extendedProps: { type: "location", recurring: isRecurring, recurringWeeks },
                    });
                }
                else {
                    // need to make sure full day blocks also save to the db
                    newEvents.push({
                        id: i === 0 ? eventId : `${eventId}-r${i}`,
                        title: "FULL DAY UNAVAILABLE",
                        start: newStart,
                        end: newEnd,
                        color: "red",
                        textColor: "black",
                        display: "auto",
                        extendedProps: { type: "unavailable", recurring: isRecurring, recurringWeeks },
                    });
                }
            }

            // Update local state
            setEvents(prev => [...prev.filter(ev => ev.id !== selectedEvent), ...newEvents]);

            console.log("Saved to DB:", newEvents);

            // Reset modal
            setModalOpen(false);
            setSelectedEvent(null);
            setBlockFullDay(false);
            setIsRecurring(false);
            setRecurringWeeks(1);
        } catch (err) {
            console.error("Unexpected error saving event:", err);
        }
    };

    const handleDeleteEvent = async () => {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            // Delete event from Supabase
            const { error } = await supabase
                .from("bookings")
                .delete()
                .eq("booking_id", selectedEvent);

            if (error) {
                console.error("Error deleting event:", error.message);
                return;
            }

            // Remove the event from local state
            setEvents(events.filter((ev) => ev.id !== selectedEvent));

            console.log("Event deleted successfully!");

            // Close modal and reset selection
            setModalOpen(false);
            setSelectedEvent(null);
            setIsRecurring(false);
        } catch (err) {
            console.error("Unexpected error deleting event:", err);
        }

    };

    // maybe thinking of removing
    const handleSaveAllEvents = () => {
        console.log("Saving all events to DB:", events);
        alert("All events saved (stub, no API logic yet).");
    };

    return (
        <div>
            <AdminNavbar title="Weekly Scheduler" />
            <div className="d-flex">
                <AdminSidebar userName="userName" />

                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">Admin Scheduling Settings</h4>

                    {/* Manage Locations */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h3 className="h5 fw-semibold text-primary mb-3">Manage Locations</h3>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter location name"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                />
                                <button className="btn btn-success" onClick={handleAddLocation}>
                                    Add
                                </button>
                            </div>
                            <ul className="list-group">
                                {locations.map((loc) => (
                                    <li
                                        key={loc.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {loc.name}
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDeleteLocation(loc.id)}
                                        >
                                            Delete
                                        </button>
                                    </li>
                                ))}
                                {locations.length === 0 && (
                                    <li className="list-group-item text-muted">No locations added yet.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Select Week and display calendar */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h3 className="h5 fw-semibold text-primary mb-3">Select Week</h3>
                            <input
                                type="week"
                                className="form-control mb-3"
                                value={selectedWeek}
                                onChange={(e) => setSelectedWeek(e.target.value)}
                            />
                            {selectedWeek && (
                                <div className="bg-white p-2 rounded shadow">
                                    <FullCalendar
                                        ref={calendarRef}
                                        plugins={[timeGridPlugin, interactionPlugin]}
                                        initialView="timeGridWeek"
                                        height={430}
                                        locale="en-AU"
                                        dateClick={handleDateClick}
                                        events={events}
                                        eventClick={handleEventClick}
                                        eventDisplay="auto"
                                        allDaySlot={false} 
                                    />

                                    <div className="d-flex justify-content-start mt-3">
                                        <button className="btn btn-primary" onClick={handleSaveAllEvents}>
                                            Save All Events
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Adding/editing events */}
                    {modalOpen && (
                        <div className="modal show d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">{selectedEvent ? "Edit Event" : "Add Event"}</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setModalOpen(false)}
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Date</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={selectedSlot ? selectedSlot.toLocaleDateString() : ""}
                                                readOnly
                                            />
                                        </div>

                                        {/* Location field only if not blocking full day */}
                                        {!blockFullDay && (
                                            <div className="mb-3">
                                                <label className="form-label">Location</label>
                                                <select
                                                    className="form-select"
                                                    value={selectedLocation}
                                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                                >
                                                    <option value="">Select location</option>
                                                    {locations.map((loc) => (
                                                        <option key={loc.id} value={loc.id}>
                                                            {loc.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        {/* Checkbox for full day block */}
                                        <div className="form-check mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="blockFullDayCheck"
                                                checked={blockFullDay}
                                                onChange={(e) => handleBlockFullDayChange(e.target.checked)}
                                            />
                                            <label className="form-check-label" htmlFor="blockFullDayCheck">
                                                Block this entire day
                                            </label>
                                        </div>

                                        {/* Checkbox for recurring */}
                                        {!blockFullDay && (
                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="recurringCheck"
                                                    checked={isRecurring}
                                                    onChange={(e) => setIsRecurring(e.target.checked)}
                                                />
                                                <label className="form-check-label" htmlFor="recurringCheck">
                                                    Repeat weekly
                                                </label>

                                                {/* sets the number of reccuring weeks */}
                                                {isRecurring && (
                                                    <input
                                                        type="number"
                                                        className="form-control mt-2"
                                                        min={1}
                                                        value={recurringWeeks}
                                                        onChange={(e) => setRecurringWeeks(+e.target.value)}
                                                        placeholder="Number of weeks to repeat"
                                                    />
                                                )}
                                            </div>
                                        )}

                                        {/* Time inputs only if not blocking full day */}
                                        {!blockFullDay && (
                                            <>
                                                <div className="mb-3">
                                                    <label className="form-label">Start Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={selectedStartTime}
                                                        onChange={(e) => setSelectedStartTime(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">End Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        value={selectedEndTime}
                                                        onChange={(e) => setSelectedEndTime(e.target.value)}
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="modal-footer">
                                        {selectedEvent && (
                                            <button className="btn btn-danger" onClick={handleDeleteEvent}>
                                                Delete
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button className="btn btn-primary" onClick={handleSaveEvent}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
