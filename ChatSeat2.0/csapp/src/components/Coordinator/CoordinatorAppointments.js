import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CoordinatorSidebar from "./CoordinatorSidebar";
import { createClient } from '@supabase/supabase-js';


const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


export default function CoordinatorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [editModal, setEditModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [locations, setLocations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
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

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const appointmentsList = bookings
                    .map((b) => {
                        const loc = locs?.find((l) => l.location_id === b.location_id);
                        const eventDate = new Date(b.booking_date);
                        if (eventDate < today) return null;

                        // Parse listener IDs
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

                        const bookedUsers = listenerIds.map(id => {
                            const profile = allProfiles.find(p => p.profile_id === id);
                            return profile ? `${profile.first_name} ${profile.last_name}` : null;
                        }).filter(Boolean);

                        const startTime = b.start_time ? b.start_time.slice(0, 5) : "00:00";
                        const endTime = b.end_time ? b.end_time.slice(0, 5) : "23:59";

                        return {
                            id: b.booking_id,
                            location: loc?.location_name || "Unknown location",
                            bookedUsers: bookedUsers.length > 0 ? bookedUsers : ["Unassigned"],
                            date: b.booking_date,
                            time: `${startTime} - ${endTime}`,
                            start: `${b.booking_date}T${startTime}:00`,
                            end: `${b.booking_date}T${endTime}:00`,
                            location_id: b.location_id,
                        };
                    })
                    .filter(Boolean)
                    .sort((a, b) => new Date(a.date) - new Date(b.date));

                setAppointments(appointmentsList);
            } catch (err) {
                console.error("Error fetching appointments:", err);
            }
        };

        fetchData();
    }, []);

    const handleEdit = (appointment) => {
        const startTime = appointment.start.split("T")[1].slice(0, 5);
        const endTime = appointment.end.split("T")[1].slice(0, 5);
        setSelectedBooking({ ...appointment, startTime, endTime });
        setEditModal(true);
    };

    const toggleDropdown = (id) => setOpenDropdown(prev => (prev === id ? null : id));

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        try {
            const { error } = await supabase.from("bookings").delete().eq("booking_id", id);
            if (error) throw error;
            setAppointments(prev => prev.filter(a => a.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete booking.");
        }
    };

    const handleSave = async () => {
        if (!selectedBooking) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDate = new Date(selectedBooking.date);

        if (selectedDate < today) {
            alert("Cannot save booking on a past date.");
            return;
        }

        if (selectedBooking.location === "FULL DAY UNAVAILABLE") {
            alert("Cannot save booking on a day marked as FULL DAY UNAVAILABLE.");
            return;
        }

        try {
            const conflicting = appointments.find(
                a =>
                    a.id !== selectedBooking.id &&
                    a.location_id === selectedBooking.location_id &&
                    a.date === selectedBooking.date
            );
            if (conflicting) {
                alert("This location is already booked on the selected date.");
                return;
            }

            const { error } = await supabase
                .from("bookings")
                .update({
                    start_time: selectedBooking.startTime + ":00",
                    end_time: selectedBooking.endTime + ":00",
                    booking_date: selectedBooking.date,
                    location_id: selectedBooking.location_id,
                })
                .eq("booking_id", selectedBooking.id);

            if (error) throw error;

            setAppointments(prev =>
                prev.map(e =>
                    e.id === selectedBooking.id
                        ? {
                            ...e,
                            start: `${selectedBooking.date}T${selectedBooking.startTime}:00`,
                            end: `${selectedBooking.date}T${selectedBooking.endTime}:00`,
                            date: selectedBooking.date,
                            time: `${selectedBooking.startTime} - ${selectedBooking.endTime}`,
                            location: selectedBooking.location,
                        }
                        : e
                )
            );

            setEditModal(false);
        } catch (err) {
            console.error(err);
            alert("Failed to save booking.");
        }
    };

    return (
        <div className="d-flex dashboard-page-scheduling">
            <aside>
                <CoordinatorSidebar />
            </aside>
            <main className="flex-grow-1 p-4">
                <h2 className="fw-bold text-primary mb-4">Upcoming Listener Bookings</h2>
                <div className="row g-3">
                    {appointments.length === 0 ? (
                        <p>No upcoming bookings found.</p>
                    ) : (
                        appointments.map((appointment) => (
                            <div key={appointment.id} className="col-sm-6 col-md-4 col-lg-3">
                                <div className="card shadow-sm border-0 h-100">
                                    <div className="card-body position-relative">
                                        <button
                                            onClick={() => toggleDropdown(appointment.id)}
                                            className="btn btn-sm position-absolute top-0 end-0 text-secondary"
                                        >
                                            ⋮
                                        </button>

                                        {openDropdown === appointment.id && (
                                            <div className="dropdown-menu show end-0 mt-3 shadow-sm">
                                                <button className="dropdown-item text-primary" onClick={() => handleEdit(appointment)}>Edit</button>
                                                <button className="dropdown-item text-danger" onClick={() => handleDelete(appointment.id)}>Delete</button>
                                            </div>
                                        )}

                                        <h5 className="card-title fw-bold text-dark">{appointment.location}</h5>

                                        <p className="mb-1">
                                            <strong>Booked Users:</strong>{" "}
                                            {(appointment.bookedUsers || ["Unassigned"]).join(", ")}
                                        </p>
                                        <p className="mb-1"><strong>Time:</strong> {appointment.time}</p>
                                        <p className="mb-1"><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Edit Modal */}
                {editModal && selectedBooking && (
                    <div className="modal d-block">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Booking</h5>
                                    <button type="button" className="btn-close" onClick={() => setEditModal(false)}></button>
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Start Time</label>
                                        <input type="time" className="form-control"
                                            value={selectedBooking.startTime || ""}
                                            onChange={e => setSelectedBooking({ ...selectedBooking, startTime: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">End Time</label>
                                        <input type="time" className="form-control"
                                            value={selectedBooking.endTime || ""}
                                            onChange={e => setSelectedBooking({ ...selectedBooking, endTime: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Date</label>
                                        <input type="date" className="form-control"
                                            value={selectedBooking.date || ""}
                                            onChange={e => setSelectedBooking({ ...selectedBooking, date: e.target.value })} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Location</label>
                                        <select className="form-control"
                                            value={selectedBooking.location_id || ""}
                                            onChange={e => setSelectedBooking({
                                                ...selectedBooking,
                                                location_id: e.target.value,
                                                location: locations.find(l => l.location_id === e.target.value)?.location_name || ''
                                            })}>
                                            <option value="">Select Location</option>
                                            {locations.map(loc => (
                                                <option key={loc.location_id} value={loc.location_id}>{loc.location_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button className="btn btn-secondary" onClick={() => setEditModal(false)}>Cancel</button>
                                    <button className="btn btn-primary" onClick={handleSave}>Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
