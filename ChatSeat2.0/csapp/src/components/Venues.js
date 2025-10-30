// Sprint 1 Fetch the one slot from mock API show one card with expandable slots.
// Card ref: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details
// Map ref: https://www.codu.co/articles/creating-links-to-locations-in-google-maps-and-apple-maps-eqj0ozor
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';
import libraryIcon from "../assets/icons/icons8-library-48.png";
import timeIcon from "../assets/icons/icons8-clock-48.png";
import dateIcon from "../assets/icons/icons8-today-48.png";
import listenerIcon from "../assets/icons/icons8-people-48.png";
import listenerIntroIcon from "../assets/icons/icons8-dash-48.png";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


export default function Venues() {
    const [venue, setVenue] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [expandedMaps, setExpandedMaps] = useState({});

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

    const toggleMap = (id) => {
        setExpandedMaps((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };
    // Display the venues slots (booked by listeners)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch locations
                const { data: locs } = await supabase
                    .from("venue_locations")
                    .select("location_id, location_name, location_address")
                    .order("location_name", { ascending: true });
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

    // Group by location, then display by location
    const filteredAppointments =
        selectedLocation === "all"
            ? appointments
            : appointments.filter((a) => a.location_id === selectedLocation);

    const groupedByLocation = locations
        .map((loc) => ({
            ...loc,
            slots: filteredAppointments.filter(
                (a) => a.location_id === loc.location_id
            ),
        }))
        .filter((loc) => loc.slots.length > 0);

    return (
        <div className="bg-white min-h-screen">
            <div className="container py-5">
                {venue && (
                    <div className="bg-white shadow p-4 mb-6 rounded">
                        {/*Display each loaction with map*/}
                        {groupedByLocation.length === 0 ? (
                            <p className="text-muted">No upcoming slots found.</p>
                        ) : (
                            groupedByLocation.map((group) => { 
                                const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
                                group.location_address || group.location_name
                                )}&output=embed`;

                        return (
                             
                            <div key={group.location_id} className="mb-5">
                                {/*show each library location and opening hours */}   
                            <h4 className="fw-bold text-primary mb-3">
                                {group.location_name}
                                <img
                                src={libraryIcon}
                                alt="Map icon"
                                className="icon ms-2"
                                style={{ width: 20, height: 20, cursor: "pointer" }}
                                onClick={() => toggleMap(group.location_id)} 
                                title="View Map"
                                  />
                             </h4>
                                {
                                    expandedMaps[group.location_id] && ( 
                                        <div className="ratio ratio-16x9 mb-3">
                                            <iframe
                                                src={mapSrc}
                                                style={{ border: 0 }}
                                                loading="lazy"
                                                allowFullScreen
                                                referrerPolicy="no-referrer-when-downgrade"
                                                title={`${group.location_name} map`}
                                            />
                                        </div>
                                    )
                                }

                            <div className="row g-3">
                                {group.slots.map((appointment) => (
                                    <div
                                        key={appointment.id}
                                        className="col-sm-6 col-md-4 col-lg-3"
                                    >
                                        <div className="card shadow-sm border-0 h-100" style={{ backgroundColor: "#fdfdfd", borderRadius: "10px" }}>
                                            <div className="card-body">

                                                <div className="mb-1 d-flex align-items-center">
                                                   <strong> <img src={timeIcon} alt="" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                                        Time:</strong>
                                                    {appointment.time} a.m.
                                                </div>

                                                <div className="mb-1 d-flex align-items-center">
                                                    <strong> <img src={dateIcon} alt="" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                                        Date:</strong>
                                                    {appointment.dateLabel}
                                                </div>

                                                <div className="mb-1">
                                                    <div className="d-flex align-items-center">
                                                    <strong> <img src={listenerIcon} alt="" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />
                                                        Listeners: </strong>
                                                    </div>
                                                    {/*{(appointment.bookedUsers || ["Unassigned"]).join(", ")}*/}
                                                    <ul className="list-unstyled ms-3 mt-1 mb-0">
                                                        {(appointment.bookedUsers && appointment.bookedUsers.length > 0
                                                            ? appointment.bookedUsers
                                                            : ["Unassigned"]
                                                        ).map((user, index) => (
                                                            <li key={index} className="d-flex align-items-center text-dark mb-1">
                                                                <img src={listenerIntroIcon} alt="Listener" className="icon" style={{ width: 24, height: 24 }} aria-hidden="true" />  
                                                                <span>{typeof user === "string" ? user : user.name}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        );
                        })
                        )}
                    </div>

                )}

            </div>

        </div>
    );

}