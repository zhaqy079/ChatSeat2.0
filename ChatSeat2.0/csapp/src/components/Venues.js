// Sprint 1 Fetch the one slot from mock API show one card with expandable slots.
import { useEffect, useState } from "react";
import Navbar from "./Navbar";

export default function Venues() {
    const [venue, setVenue] = useState(null);

    useEffect(() => {
        fetch("/api/venues") // easier way for sprint 1
            .then((res) => res.json())
            .then((data) => setVenue(data))
            .catch((err) => console.error("Error fetching venue:", err));
    }, []);

    return (
        <div className="bg-white min-h-screen">
            <div className="container py-5">
                {venue ? (
                    <div className="bg-white shadow p-4 mb-6 rounded">
                        <h3 className="fw-bold text-primary">{venue.name}</h3>
                        <p className="text-muted">📍{venue.location}</p>

                        <details className="mt-3">
                            <summary className="fw-semibold cursor-pointer">
                                Available Slots
                            </summary>
                            <ul className="list-unstyled mt-2">
                                {venue.upcomingSlots.map((slot, i) => (
                                    <li key={i}>
                                        📅 {slot.date} – 🕒 {slot.time}
                                    </li>
                                ))}
                            </ul>
                        </details>
                    </div>
                ) : (
                    <p className="text-muted">Loading venue...</p>
                )}
            </div>
        </div>
    );
}

