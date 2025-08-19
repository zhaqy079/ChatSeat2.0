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
    const calendarRef = useRef(null);

    // updates the calendar when the user selects a paticular week
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

        // ensures there are no duplicate locations
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

    return (
        <div>
            <AdminNavbar title="Weekly Scheduler" />
            <div className="d-flex">

                <AdminSidebar userName="userName" />

                <div className="p-4 flex-grow-1">

                    <h4 className="fw-bold mb-4 text-primary">Admin Scheduling Settings</h4>

                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h3 className="h5 fw-semibold text-primary mb-3">Manage Locations</h3>

                            {/* Add Location */}
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

                            {/* List of locations */}
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
                                    <li className="list-group-item text-muted">
                                        No locations added yet.
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>


                    {/* Select Week */}
                    <div className="card shadow-sm mb-4" >
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
                                        headerToolbar={{
                                            right: ''
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}