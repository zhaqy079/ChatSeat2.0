import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";


// if you get an error for packages of fullcalendar not installed, run this command in terminal
// npm install @fullcalendar/react @fullcalendar/timegrid @fullcalendar/interaction

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
    }, [selectedWeek]);

    const handleAddLocation = () => {
        const trimmedName = newLocation.trim();
        if (!trimmedName) return;

        const isDuplicate = locations.some(
            (loc) => loc.name.toLowerCase() === trimmedName.toLowerCase()
        );
        if (isDuplicate) {
            alert("This location is already added");
            return;
        }
        const tempId = `temp-${Date.now()}`;
        const newLoc = { id: tempId, name: newLocation };
        setLocations([...locations, newLoc]);
        setNewLocation("");
    };

    const handleDeleteLocation = (id) => {
        if (!window.confirm("Are you sure you want to delete this location?")) return;
        setLocations(locations.filter((loc) => loc.id !== id));
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

        // just incase user somehow add a location on a blocked day
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

    const handleSaveEvent = () => {
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


        if (isRecurring && !blockFullDay) {
            // remove all future occurrences of this recurring event first
            if (selectedEvent) {
                setEvents((prev) =>
                    prev.filter(
                        (ev) => !ev.id.startsWith(selectedEvent) || ev.start < startDate
                    )
                );
            }

            // generate events for the new number of weeks
            for (let i = 0; i < recurringWeeks; i++) {
                const newStart = new Date(startDate);
                newStart.setDate(startDate.getDate() + i * 7);
                const newEnd = new Date(endDate);
                newEnd.setDate(endDate.getDate() + i * 7);

                newEvents.push({
                    id: i === 0 ? eventId : `${eventId}-r${i}`,
                    title: locationTrimmed,
                    start: newStart,
                    end: newEnd,
                    color: "blue",
                    textColor: "white",
                    display: "auto",
                    extendedProps: {
                        recurring: true,
                        recurringWeeks,
                        type: "location",
                        weekday,
                    },
                });
            }
        } else {
            // normal single event or full day unavailable
            newEvents.push({
                id: selectedEvent || eventId,
                title: blockFullDay ? "FULL DAY UNAVAILABLE" : locationTrimmed,
                start: startDate,
                end: endDate,
                color: blockFullDay ? "red" : "blue",
                textColor: blockFullDay ? "black" : "white",
                display: "auto",
                extendedProps: { type: blockFullDay ? "unavailable" : "location" },
            });

            // remove future recurring occurrences if editing a single event
            if (selectedEvent) {
                setEvents((prev) =>
                    prev.filter((ev) => !ev.id.startsWith(selectedEvent) || ev.start < startDate)
                );
            }
        }

        // remove the original event for the new eddited event
        setEvents((prev) => [...prev.filter((ev) => ev.id !== selectedEvent), ...newEvents]);

        setModalOpen(false);
        setSelectedEvent(null);
        setBlockFullDay(false);
        setIsRecurring(false);
        setRecurringWeeks(1);

        console.log("Save to DB:", newEvents);
    };

    const handleDeleteEvent = () => {
        if (window.confirm("Are you sure you want to delete this event?")) {
            setEvents(events.filter((ev) => ev.id !== selectedEvent));
            setModalOpen(false);
            setSelectedEvent(null);
            setIsRecurring(false);
        }
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
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => {
                                                console.log("Save button clicked. Events:", events);
                                                alert("Events saved (stub, no API logic yet).");
                                            }}
                                        >
                                            Save
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
                                                        <option key={loc.id} value={loc.name}>
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
