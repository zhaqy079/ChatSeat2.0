// Sprint 1 Fetch the one slot from mock API show one card with expandable slots.
// Card ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
// Map ref: https://www.codu.co/articles/creating-links-to-locations-in-google-maps-and-apple-maps-eqj0ozor
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import libraryIcon from "../assets/icons/icons8-library-48.png";
const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


export default function Venues() {
    const [venue, setVenue] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetch("/api/venues") 
            .then((res) => res.json())
            .then((data) => setVenue(data))
            .catch((err) => console.error("Error fetching venue:", err));
    }, []);

    const mapSrc = venue
        ? `https://www.google.com/maps?q=${encodeURIComponent(
            venue.location
        )}&output=embed`
        : "";

    // Display the venues slots (booked by listeners)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch locations
                const { data: locs } = await supabase
                    .from("venue_locations")
                    .select("location_id, location_name, location_address")
                    .order("location_name", { ascending: true });

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

                // Fetch booked listener 
                const { data: allProfiles } = await supabase
                    .from("user_profiles")
                    .select("profile_id, first_name, last_name");

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const appointmentsList = bookings
                    .map((b) => {

                        const loc = locs?.find((l) => l.location_id === b.location_id);
                        const eventDate = new Date(`${b.booking_date}T00:00:00`);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);

                        if (eventDate < today) return null;

                        
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
                            dateLabel: eventDate.toLocaleDateString(),
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

    return (
        <div className="bg-white min-h-screen">
            <div className="container py-5">
                {venue ? (
                    <div className="bg-white shadow p-4 mb-6 rounded">
                        <h3 className="fw-bold text-primary">{venue.name}</h3>
                        <p className="text"> <img src={libraryIcon} alt="" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                            <button
                                type="button"
                                className="btn btn-link p-0 link-secondary"
                                onClick={() => setShowMap((s) => !s)}
                                aria-expanded={showMap}
                                title="Show on map"
                            >
                                {venue.location}
                            </button>
                        </p>

                        {/* Inline, responsive map inside the card */}
                        {showMap && (
                            <div className="ratio ratio-16x9 mt-3">
                                <iframe
                                    src={mapSrc}
                                    style={{ border: 10 }}
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title={`${venue.name} location map`}
                                />
                            </div>
                        )}
                        
                        <h4 className="fw-bold text-primary mb-3">Upcoming Chat Seats</h4>
                        {appointments.length === 0 ? (
                            <p className="text-muted">No upcoming slots yet.</p>
                        ) : (
                            <div className="row g-3">
                                {appointments.map((appointment) => (
                                    <div key={appointment.id} className="col-sm-6 col-md-4 col-lg-3">
                                        <div className="card shadow-sm border-0 h-100">
                                            <div className="card-body">
                                                <h5 className="card-title fw-bold text-dark">
                                                    {appointment.location}
                                                </h5>
                                                <p className="mb-1">
                                                    <strong>Time:</strong> {appointment.time}
                                                </p>
                                                <p className="mb-1">
                                                    <strong>Date:</strong> {appointment.dateLabel}
                                                </p>
                                                <p className="mb-0">
                                                    <strong>Listeners:</strong>{" "}
                                                    {(appointment.bookedUsers || ["Unassigned"]).join(", ")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <p className="text-muted">Current no Venue...</p>
                )}
            </div>
        </div>
    );
}

