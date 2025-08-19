// Sprint 1 Fetch the one slot from mock API show one card with expandable slots.
// Card ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
// Map ref: https://www.codu.co/articles/creating-links-to-locations-in-google-maps-and-apple-maps-eqj0ozor
import { useEffect, useState } from "react";


export default function Venues() {
    const [venue, setVenue] = useState(null);
    const [showMap, setShowMap] = useState(false);
   

    useEffect(() => {
        fetch("/api/venues") // easier way for sprint 1
            .then((res) => res.json())
            .then((data) => setVenue(data))
            .catch((err) => console.error("Error fetching venue:", err));
    }, []);

    const mapSrc = venue
        ? `https://www.google.com/maps?q=${encodeURIComponent(
            venue.location
        )}&output=embed`
        : "";


    return (
        <div className="bg-white min-h-screen">
            <div className="container py-5">
                {venue ? (
                    <div className="bg-white shadow p-4 mb-6 rounded">
                        <h3 className="fw-bold text-primary">{venue.name}</h3>
                        <p className="text">📍
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
                    <p className="text-muted">Current no Venue...</p>
                )}
            </div>
        </div>
    );
}

