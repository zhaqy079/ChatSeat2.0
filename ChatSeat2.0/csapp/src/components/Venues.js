// Sprint 1 Fetch the one slot from mock API show one card with expandable slots.
// Card ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
// Map ref: https://www.codu.co/articles/creating-links-to-locations-in-google-maps-and-apple-maps-eqj0ozor
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

export default function Venues() {
    const [venue, setVenue] = useState(null);
    const [showMap, setShowMap] = useState(false);
   

    useEffect(() => {
        const fetchVenueData = async () => {
            try {
                // Fetch all venue locations
                const { data: venuesData, error: venuesError } = await supabase
                    .from("venue_locations")
                    .select("*");

                if (venuesError) throw venuesError;

                // Fetch all bookings
                const { data: bookingsData, error: bookingsError } = await supabase
                    .from("bookings")
                    .select("*");

                if (bookingsError) throw bookingsError;

                // Group bookings by venue
                const venuesWithSlots = venuesData.map((venue) => {
                    const slots = bookingsData
                        .filter((b) => b.location_id === venue.location_id)
                        .map((b) => ({
                            date: b.booking_date,
                            start: b.start_time,
                            end: b.end_time,
                        }));

                    return {
                        ...venue,
                        upcomingSlots: slots,
                    };
                });

                setVenue(venuesWithSlots); // set array of venue cards
            } catch (error) {
                console.error("Failed to fetch venue info:", error.message);
            }
        };

        fetchVenueData();
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
                        <p className="text">
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
                {/*Display admin setted availale time slots*/}
                <div className="col-12 col-md-6">
                    <div className="venue-card">
                        <h5>{venue.name}</h5>
                        <p>📍 {venue.availableSlots}</p>
                        <p>✉️ {venue.listener.name}</p>
                        
                    </div>
                </div>
            </div>

        </div>
    );
}

