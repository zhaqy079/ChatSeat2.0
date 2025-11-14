import AdminSidebar from "./AdminSidebar";
import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { supabase } from "../../supabaseClient";
import AdminLinks from "./AdminLinks";
import { useDashboardNav } from "../Shared/useDashboardNav";


export default function AdminSchedulingSetting() {
    const { user, getActiveLink, handleLogout, closeOffcanvas } = useDashboardNav();

    const [locations, setLocations] = useState([]); // locations are saved here so the DB can be updated
    const [newLocation, setNewLocation] = useState("");
    const [selectedWeek, setSelectedWeek] = useState("");
    const [events, setEvents] = useState([]); // events are saved here so we can save it to the DB

    const [selectedDayName, setSelectedDayName] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedStartTime, setSelectedStartTime] = useState("");
    const [selectedEndTime, setSelectedEndTime] = useState("");
    const [blockFullDay, setBlockFullDay] = useState(false);
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurringWeeks, setRecurringWeeks] = useState(1);
    const [deleteConfirm, setDeleteConfirm] = useState({
        open: false,
        locationId: null,
        locationName: "",
        relatedEvents: []
    });

    const calendarRef = useRef(null);

    const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
    const [selectedLocationForAvailability, setSelectedLocationForAvailability] = useState(null);
    const [tempAvailability, setTempAvailability] = useState({
        Monday: { open: "", close: "" },
        Tuesday: { open: "", close: "" },
        Wednesday: { open: "", close: "" },
        Thursday: { open: "", close: "" },
        Friday: { open: "", close: "" },
        Saturday: { open: "", close: "" },
        Sunday: { open: "", close: "" },
    });

    const shortenName = {
        Monday: "Mon",
        Tuesday: "Tue",
        Wednesday: "Wed",
        Thursday: "Thu",
        Friday: "Fri",
        Saturday: "Sat",
        Sunday: "Sun",
    };

    useEffect(() => {
        if (selectedWeek && calendarRef.current) {
            const [year, week] = selectedWeek.split("-W").map(Number);
            const firstDayOfWeek = new Date(year, 0, 1 + (week - 1) * 7);
            calendarRef.current.getApi().gotoDate(firstDayOfWeek);
        }


        const fetchData = async () => {
            try {
                // Fetch all locations
                const { data: locs, error: locError } = await supabase
                    .from("venue_locations")
                    .select("location_id, location_name, availability");
                if (locError) throw locError;

                // sets openning hours for each location
                setLocations(locs.map(loc => ({
                    id: loc.location_id,
                    name: loc.location_name,
                    availability: loc.availability || {
                        Monday: { open: "", close: "" },
                        Tuesday: { open: "", close: "" },
                        Wednesday: { open: "", close: "" },
                        Thursday: { open: "", close: "" },
                        Friday: { open: "", close: "" },
                        Saturday: { open: "", close: "" },
                        Sunday: { open: "", close: "" },
                    }
                })));

                // Fetch bookings
                const { data: bookings, error: bookingsError } = await supabase
                    .from("bookings")
                    .select("*");
                if (bookingsError) throw bookingsError;


                const unavailableLocation = locs.find(loc => loc.location_name === "FULL DAY UNAVAILABLE");
                const unavailableId = unavailableLocation ? unavailableLocation.location_id : null;

                // Display bookings on calendar
                const eventsData = bookings.map(booking => {
                    const location = locs.find(loc => loc.location_id === booking.location_id);

                    // Handle missing times
                    const startTime = booking.start_time || "00:00";
                    const endTime = booking.end_time || "23:59";

                    // Convert to ISO strings
                    const startParts = startTime.split(":").map(num => num.padStart(2, "0"));
                    const endParts = endTime.split(":").map(num => num.padStart(2, "0"));

                    const startISO = `${booking.booking_date}T${startParts[0]}:${startParts[1]}:00`;
                    const endISO = `${booking.booking_date}T${endParts[0]}:${endParts[1]}:00`;

                    const start = new Date(startISO);
                    const end = new Date(endISO);


                    const isUnavailable = booking.location_id === unavailableId;

                    return {
                        id: booking.booking_id,
                        title: isUnavailable ? "FULL DAY UNAVAILABLE" : location ? location.location_name : "Unknown location",
                        start,
                        end,
                        color: isUnavailable ? "#ff7f7f" : "yellow",
                        textColor: isUnavailable ? "black" : "black",
                        extendedProps: { type: isUnavailable ? "unavailable" : "location", location_id: booking.location_id },
                    };
                });

                // console.log("All fetched events:", eventsData);

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

            //console.log("Inserted location data:", data); 

            if (data && data.length > 0) {
                const addedLocation = { id: data[0].location_id, name: data[0].location_name };
                setLocations(prev => [...prev, addedLocation]);
                setNewLocation("");
                // console.log("Location added successfully!", addedLocation);
            }
        } catch (err) {
            console.error("Unexpected error adding location:", err);
        }
    };


    const handleDeleteLocation = async (id) => {


        const relatedEvents = events.filter(
            (ev) => ev.extendedProps?.type === "location" && ev.extendedProps.location_id === id
        );

        if (relatedEvents.length > 0) {
            const locName = locations.find(l => l.id === id)?.name || "Unknown";
            setDeleteConfirm({
                open: true,
                locationId: id,
                locationName: locName,
                relatedEvents
            });
            return;
        }
        await confirmDeleteLocation(id);
    };

    // confirm deletion of location when location is tied to events
    const confirmDeleteLocation = async (id, alsoDeleteEvents = false) => {
        try {
            if (alsoDeleteEvents) {
                // Fetch latest related bookings from Supabase
                const { data: relatedEvents, error: fetchError } = await supabase
                    .from("bookings")
                    .select("booking_id")
                    .eq("location_id", id);

                if (fetchError) throw fetchError;

                // Delete related bookings
                if (relatedEvents.length > 0) {
                    const { error: eventsError } = await supabase
                        .from("bookings")
                        .delete()
                        .in("booking_id", relatedEvents.map(ev => ev.booking_id));
                    if (eventsError) throw eventsError;

                    setEvents(events.filter(ev => ev.extendedProps?.location_id !== id));
                }
            }

            // Delete location
            const { error: locError } = await supabase
                .from("venue_locations")
                .delete()
                .eq("location_id", id);
            if (locError) throw locError;

            setLocations(locations.filter((loc) => loc.id !== id));

            //console.log("Location and related events deleted successfully!");
        } catch (err) {
            console.error("Error deleting location and events:", err.message);
        } finally {
            setDeleteConfirm({ open: false, locationId: null, locationName: "", relatedEvents: [] });
        }
    };


    // The open modal for adding any new dates
    const handleDateClick = (info) => {

        const weekday = new Date(info.date).toLocaleDateString("en-AU", { weekday: "long" });
        setSelectedDayName(weekday);

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
        setSelectedLocation(
            eventType === "unavailable"
                ? ""
                : clickInfo.event.extendedProps.location_id
        );

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
            const [endH, endM] = selectedEndTime.split(":");
            startDate.setHours(+startH, +startM, 0, 0);
            endDate.setHours(+endH, +endM, 0, 0);

            if (endDate <= startDate) {
                alert("End time must be after start time!");
                return;
            }
        }

        const baseEventId = selectedEvent || Date.now().toString();
        const newEvents = [];

        try {
            let unavailableLocation;
            if (blockFullDay) {
                unavailableLocation = locations.find(loc => loc.name === "FULL DAY UNAVAILABLE");
                if (!unavailableLocation) {
                    const { data, error } = await supabase
                        .from("venue_locations")
                        .insert([{ location_name: "FULL DAY UNAVAILABLE", location_address: "TBD" }])
                        .select();
                    if (error) throw error;
                    unavailableLocation = { id: data[0].location_id, name: data[0].location_name };
                    setLocations(prev => [...prev, unavailableLocation]);
                }
            }

            for (let i = 0; i < (isRecurring ? recurringWeeks : 1); i++) {
                const newStart = new Date(startDate);
                newStart.setDate(startDate.getDate() + i * 7);
                const newEnd = new Date(endDate);
                newEnd.setDate(endDate.getDate() + i * 7);

                const pad = n => n.toString().padStart(2, "0");
                const booking_date = `${newStart.getFullYear()}-${pad(newStart.getMonth() + 1)}-${pad(newStart.getDate())}`;
                const start_time = `${pad(newStart.getHours())}:${pad(newStart.getMinutes())}`;
                const end_time = `${pad(newEnd.getHours())}:${pad(newEnd.getMinutes())}`;

                let data, error;

                if (blockFullDay) {
                    if (selectedEvent && i === 0) {
                        // Update existing full day block
                        ({ data, error } = await supabase
                            .from("bookings")
                            .update({
                                booking_date,
                                start_time,
                                end_time,
                                location_id: unavailableLocation.id
                            })
                            .eq("booking_id", selectedEvent)
                            .select());
                    } else {
                        // Insert new full day block
                        ({ data, error } = await supabase
                            .from("bookings")
                            .insert([{
                                booking_date,
                                start_time,
                                end_time,
                                location_id: unavailableLocation.id,
                                created_at: new Date().toISOString()
                            }])
                            .select());
                    }

                    if (error) {
                        console.error("Error saving full-day block:", error.message);
                        continue;
                    }

                    newEvents.push({
                        id: i === 0 ? baseEventId : `${baseEventId}-r${i}`,
                        title: "FULL DAY UNAVAILABLE",
                        start: newStart,
                        end: newEnd,
                        color: "red",
                        textColor: "black",
                        display: "auto",
                        extendedProps: { type: "unavailable", recurring: isRecurring, recurringWeeks },
                    });
                } else {
                    const locationObj = locations.find(loc => loc.id === selectedLocation);
                    const locationName = locationObj ? locationObj.name : "Unknown location";

                    if (selectedEvent && i === 0) {
                        // Update existing booking
                        ({ data, error } = await supabase
                            .from("bookings")
                            .update({
                                booking_date,
                                start_time,
                                end_time,
                                location_id: selectedLocation
                            })
                            .eq("booking_id", selectedEvent)
                            .select());
                    } else {
                        // Insert new booking
                        ({ data, error } = await supabase
                            .from("bookings")
                            .insert([{
                                booking_date,
                                start_time,
                                end_time,
                                location_id: selectedLocation,
                                created_at: new Date().toISOString()
                            }])
                            .select());
                    }

                    if (error) {
                        console.error("Error saving booking:", error.message);
                        continue;
                    }

                    newEvents.push({
                        id: i === 0 ? baseEventId : `${baseEventId}-r${i}`,
                        title: locationName,
                        start: newStart,
                        end: newEnd,
                        color: "blue",
                        textColor: "white",
                        display: "auto",
                        extendedProps: { type: "location", recurring: isRecurring, recurringWeeks },
                    });
                }
            }

            // Update state: remove old event(s) and add new ones
            setEvents(prev => [
                ...prev.filter(ev => ev.id !== baseEventId && !ev.id.startsWith(`${baseEventId}-r`)),
                ...newEvents
            ]);

            // Reset modal state
            setModalOpen(false);
            setSelectedEvent(null);
            setBlockFullDay(false);
            setIsRecurring(false);
            setRecurringWeeks(1);

            //console.log("Saved to DB:", newEvents);
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

    // displaying the date in the modal for adding/editing events
    function formatDateWithSuffix(date) {
        if (!date) return "";

        const day = date.getDate();
        const suffix =
            day % 10 === 1 && day !== 11
                ? "st"
                : day % 10 === 2 && day !== 12
                    ? "nd"
                    : day % 10 === 3 && day !== 13
                        ? "rd"
                        : "th";

        const month = date.toLocaleString("en-AU", { month: "long" });
        const year = date.getFullYear();

        return `${day}${suffix} ${month} ${year}`;
    }

    // openning the modal for setting availability for each location
    const openAvailabilityModal = (loc) => {
        setSelectedLocationForAvailability(loc);
        setTempAvailability(
            loc.availability || {
                Monday: { open: "", close: "" },
                Tuesday: { open: "", close: "" },
                Wednesday: { open: "", close: "" },
                Thursday: { open: "", close: "" },
                Friday: { open: "", close: "" },
                Saturday: { open: "", close: "" },
                Sunday: { open: "", close: "" },
            }
        );
        setAvailabilityModalOpen(true);
    };

    // formatting time to am and pm format
    const formatToAmPm = (timeStr) => {
        if (!timeStr) return "";
        const [hour, minute] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute);
        return date.toLocaleTimeString("en-AU", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    // retrieving the opening hours for the selected location and day
    const getSelectedLocationHours = () => {
        if (!selectedLocation || !selectedDayName) return null;

        const loc = locations.find((l) => l.id === selectedLocation);
        if (!loc || !loc.availability) return null;
        if (loc.name === "FULL DAY UNAVAILABLE") return "";

        // Match day case-insensitively
        const dayKey = Object.keys(loc.availability).find(
            d => d.toLowerCase() === selectedDayName.toLowerCase()
        );

        if (!dayKey) return "Closed";

        const hours = loc.availability[dayKey];

        if (!hours.open && !hours.close) return "Closed";

        const openTime = formatToAmPm(hours.open);
        const closeTime = formatToAmPm(hours.close);

        return `${openTime} – ${closeTime}`;
    };

    const closeAvailabilityModal = () => {
        setAvailabilityModalOpen(false);
        setSelectedLocationForAvailability(null);
    };

    // saving the availability of location to the database
    const saveAvailability = async () => {
        if (!selectedLocationForAvailability) return;

        try {
            const { error } = await supabase
                .from("venue_locations")
                .update({ availability: tempAvailability })
                .eq("location_id", selectedLocationForAvailability.id);

            if (error) throw error;

            alert("Opening hours saved successfully!");
            closeAvailabilityModal();

            // Refresh data
            const { data: locs } = await supabase
                .from("venue_locations")
                .select("location_id, location_name, availability");

            setLocations(
                locs.map((loc) => ({
                    id: loc.location_id,
                    name: loc.location_name,
                    availability: loc.availability,
                }))
            );
        } catch (err) {
            console.error("Error saving availability:", err);
            alert("Failed to save opening hours.");
        }
    };

    return (
        <div className="container-fluid px-0">
            <div className="d-lg-none p-2">
                <button
                    className="btn btn-outline-primary btn-lg"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mobileMenu"
                    aria-controls="mobileMenu"
                >
                    Menu
                </button>
            </div>

            <div className="d-flex">
                {/* Sidebar */}
                <aside className="px-0 flex-shrink-0">
                    <AdminSidebar />
                </aside>

                <div className="dashboard-content-wrap">
                    <h2 className="fw-bold dashboard-title fs-3 mb-4">Admin Scheduling Settings</h2>
                    <div className="dashboard-card">
                        <div className="card-body">
                            <h3 className="dashboard-title">Manage Locations</h3>
                            <div className="d-flex gap-2 mb-4 align-items-stretch">
                                <input
                                    name="location"
                                    type="text"
                                    className="form-control form-control-lg rounded-2 shadow-sm"
                                    placeholder="Enter location name"
                                    value={newLocation}
                                    onChange={(e) => setNewLocation(e.target.value)}
                                    style={{ borderWidth: '2px' }}
                                />
                                <button className="btn btn-success" onClick={handleAddLocation}>
                                    Add
                                </button>
                            </div>
                            <ul className="list-group">
                                {locations.filter(loc => loc.name !== "FULL DAY UNAVAILABLE").map((loc) => (

                                    <li
                                        key={loc.id}
                                        className="d-flex justify-content-between align-items-center border rounded-2 p-3 mb-3 bg-white shadow-sm"
                                    >
                                        <div className="me-3">
                                            <span className="fs-5 fw-medium d-block">{loc.name}</span>

                                            {/* ensures only actual location displays opening hours */}
                                            {loc.name !== "FULL DAY UNAVAILABLE" && loc.availability && (
                                                <div className="dashboard-badges ">
                                                    {Object.entries(loc.availability) // coverts the avaibility to day and times e.g Monday: {open, close}
                                                        .map(([day, times]) => {
                                                            const shortDay = shortenName[day] || day.charAt(0).toUpperCase() + day.slice(1);
                                                            return (
                                                                <span key={day} className="badge bg-light text-secondary border">
                                                                    {shortDay}: {times.open ? `${formatToAmPm(times.open)}–${formatToAmPm(times.close)}` : "Closed"}
                                                                </span>
                                                            );
                                                        })}

                                                </div>

                                            )}
                                        </div>

                                        <div className="d-flex flex-wrap justify-content-end gap-2">
                                            {loc.name !== "FULL DAY UNAVAILABLE" && (
                                                <button
                                                    className="btn btn-sm btn-outline-primary"
                                                    onClick={() => openAvailabilityModal(loc)}
                                                >
                                                    Set Hours
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteLocation(loc.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}


                                {locations.length === 0 && (
                                    <li className="list-group-item text-muted">No locations added yet.</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Select Week and then displays calendar */}
                    <div className="dashboard-card">
                        <div className="card-body">
                            <h3 className="dashboard-title">Schedule Next Week</h3>
                            <p className="text-muted mb-4 small">
                                Pick a week. Click the calendar to add slots.
                            </p>
                            <input
                                type="week"
                                name="pickWeek"
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
                                        eventTimeFormat={{
                                            hour: "numeric",
                                            minute: "2-digit",
                                            meridiem: "short"
                                        }}
                                        dayHeaderFormat={{
                                            weekday: "short",
                                            day: "numeric"
                                        }}
                                        buttonText={{
                                            today: `Selected Week`
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Adding or editing events */}
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
                                                name="pickDate"
                                                type="text"
                                                className="form-control"
                                                value={selectedSlot ? formatDateWithSuffix(selectedSlot) : ""}
                                                readOnly
                                            />
                                        </div>

                                        {/* Location field only if not blocking full day */}
                                        {!blockFullDay && (
                                            <div className="mb-3">
                                                <label className="form-label">Location</label>
                                                <select
                                                    className="form-select"
                                                    name="locationSelect"
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

                                                {selectedLocation && locations.find(l => l.id === selectedLocation)?.name !== "FULL DAY UNAVAILABLE" && (
                                                    <small className="text-muted d-block mt-2">
                                                        {(() => {
                                                            const hours = getSelectedLocationHours();
                                                            return hours === "Closed"
                                                                ? `This location is closed on ${selectedDayName}`
                                                                : `${selectedDayName} hours: ${hours}`;
                                                        })()}
                                                    </small>
                                                )}

                                            </div>


                                        )}

                                        <div className="form-check mb-3">
                                            <input
                                                name="blockWholeDay"
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

                                        {!blockFullDay && (
                                            <div className="form-check mb-3">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    name="checkRepeat"
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
                                                        name="setRepeat"
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
                                            <div>
                                                <div className="mb-3">
                                                    <label className="form-label">Start Time</label>
                                                    <input
                                                        type="time"
                                                        className="form-control"
                                                        name="startTime"
                                                        value={selectedStartTime}
                                                        onChange={(e) => setSelectedStartTime(e.target.value)}
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label className="form-label">End Time</label>
                                                    <input
                                                        type="time"
                                                        name="endTime"
                                                        className="form-control"
                                                        value={selectedEndTime}
                                                        onChange={(e) => setSelectedEndTime(e.target.value)}
                                                    />
                                                </div>
                                            </div>
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

                    {/* modal for confirming deleting location */}
                    {deleteConfirm.open && (
                        <div className="modal show d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Delete Location</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() =>
                                                setDeleteConfirm({
                                                    open: false,
                                                    locationId: null,
                                                    locationName: "",
                                                    relatedEvents: []
                                                })
                                            }
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p>
                                            The location <strong>{deleteConfirm.locationName}</strong> has{" "}
                                            <strong>{deleteConfirm.relatedEvents.length}</strong> event(s).
                                        </p>
                                        <p>
                                            To delete this location, you must also delete all of its events. Do you want
                                            to continue?
                                        </p>
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={() =>
                                                setDeleteConfirm({
                                                    open: false,
                                                    locationId: null,
                                                    locationName: "",
                                                    relatedEvents: []
                                                })
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => confirmDeleteLocation(deleteConfirm.locationId, true)}
                                        >
                                            Delete Location & Events
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Availability Modal for location */}
                    {availabilityModalOpen && (
                        <div className="modal show d-block" tabIndex="-1">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">
                                            Set Opening Hours – {selectedLocationForAvailability?.name}
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={closeAvailabilityModal}
                                        ></button>
                                    </div>

                                    <div className="modal-body">
                                        {Object.keys(tempAvailability).map((day) => (
                                            <div key={day} className="d-flex align-items-center mb-2">
                                                <label className="me-2">{day}</label>

                                                <input
                                                    type="time"
                                                    className="form-control me-2"
                                                    value={tempAvailability[day].open || ""}
                                                    onChange={(e) =>
                                                        setTempAvailability((prev) => ({
                                                            ...prev,
                                                            [day]: { ...prev[day], open: e.target.value },
                                                        }))
                                                    }
                                                    disabled={tempAvailability[day].closed} 
                                                />
                                                <input
                                                    type="time"
                                                    className="form-control me-2"
                                                    value={tempAvailability[day].close || ""}
                                                    onChange={(e) =>
                                                        setTempAvailability((prev) => ({
                                                            ...prev,
                                                            [day]: { ...prev[day], close: e.target.value },
                                                        }))
                                                    }
                                                    disabled={tempAvailability[day].closed} 
                                                />

                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id={`closed-${day}`}
                                                        checked={tempAvailability[day].closed || false}
                                                        onChange={(e) =>
                                                            setTempAvailability((prev) => ({
                                                                ...prev,
                                                                [day]: e.target.checked
                                                                    ? { open: "", close: "", closed: true }
                                                                    : { open: "", close: "", closed: false },
                                                            }))
                                                        }
                                                    />
                                                    <label className="form-check-label" htmlFor={`closed-${day}`}>
                                                        Closed
                                                    </label>
                                                </div>
                                            </div>
                                        ))}

                                    </div>

                                    <div className="modal-footer">
                                        <button className="btn btn-secondary" onClick={closeAvailabilityModal}>
                                            Cancel
                                        </button>
                                        <button className="btn btn-primary" onClick={saveAvailability}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div
                className="offcanvas offcanvas-start"
                id="mobileMenu"
                tabIndex="-1"
                aria-labelledby="mobileMenuLabel"
            >
                <div className="offcanvas-header">
                    <h5 id="mobileMenuLabel" className="mb-0">
                        Hello, {user?.firstName ?? ""}!
                    </h5>
                    <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">

                    <AdminLinks
                        getActiveLink={getActiveLink}
                        handleLogout={handleLogout}
                        onItemClick={closeOffcanvas}
                    />
                </div>
            </div>
        </div>
    );

}
