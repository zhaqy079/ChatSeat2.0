import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Requests a list of all locations from the database
export const fetchLocations = async () => {
    const { data, error } = await supabase.from("venue_locations")
        .select("*")
        .order('location_name', { ascending: true });

    if (error) {
        throw new Error("Failed to fetch locations:" + error.message);
    }

    return data;
};

// Function call to deactivate a location
async function deactivateLocation(locationID) {
    const { error: profileError } = await supabase.from("venue_locations").update(
        {
            inactive_at: new Date()
        }
    ).eq('location_id', locationID);

    if (profileError) {
        throw new Error("Failed to deactivate location: " + profileError.message);
    }

    window.location.reload();
}

// Function call to reactivate a location
async function reactivateLocation(locationID) {
    const { error: profileError } = await supabase.from("venue_locations").update(
        {
            inactive_at: null
        }
    ).eq('location_id', locationID);

    if (profileError) {
        throw new Error("Failed to reactivate location: " + profileError.message);
    }

    window.location.reload();
}

export default function AdminManageLocations() {
    const [locationlist, setLocationlist] = useState([]);

    // Stores the list of users from the database
    useEffect(() => {
        const getLocations = async () => {
            try {
                const data = await fetchLocations();
                setLocationlist(data);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        };

        getLocations();
    }, []);

    return (
        <div className="d-flex  dashboard-page-content ">
            {/* Sidebar on the left */}
            <aside>
                <AdminSidebar />
            </aside>
            {/* Right content area */}
            <div className="flex-grow-1 px-3 px-md-4 py-4">
                    <h4 className="fw-bold mb-4 text-primary">Manage Locations</h4>

                    {!locationlist.length > 0 ? (
                        // If no locations are found, show message
                        <h5 className="text-center">
                            No locations found.
                        </h5>
                    ) : (
                        <table className="table">
                            <thead className="text-left">
                                <tr className="text-left">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Address</th>
                                    <th className="p-3">Location Inactive</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locationlist.map((location) => {
                                    return (
                                        <tr key={location.location_id} className="border-t">
                                            <td className="p-3">{location.location_name}</td>
                                            <td className="p-3">{location.location_address}</td>
                                            <td className="p-3">
                                                { // Changes incoming date format to '27 Nov 2025' format
                                                    location.inactive_at === null
                                                        ? "Active"
                                                        : new Date(location.inactive_at).toLocaleDateString("en-AU", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                            </td>
                                            <td>
                                                <>
                                                    {/* Displays a variety of different buttons depending on the location */}
                                                    <button type="button" className="btn btn-secondary me-2">Manage</button>
                                                    {location.inactive_at === null ? (
                                                        <button type="button" className="btn btn-warning me-2" onClick={() => deactivateLocation(location.location_id) }>Deactivate</button>
                                                    ) : (
                                                        <button type="button" className="btn btn-info me-2" onClick={() => reactivateLocation(location.location_id) }>Reactivate</button>
                                                    )}
                                                </>
                                            </td>
                                        </tr>
                                )})}
                            </tbody>
                        </table>
                    )}              
                </div>
            </div>
        
    );
}