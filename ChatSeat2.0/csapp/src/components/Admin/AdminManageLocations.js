import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Requests a list of all locations from the database
export const fetchLocations = async () => {
    const { data, error } = await supabase.from("venue_locations").select("*");

    if (error) {
        throw new Error("Failed to fetch locations:" + error.message);
    }

    return data;
};

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
        <div>
            <AdminNavbar title="Location Management" />
            <div className="d-flex">

                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">Manage Locations</h4>

                    <div className="overflow-x-auto">
                        <table className="min-w-[600px] w-full border rounded shadow bg-white">
                            <thead className="bg-[#e6f0ff]">
                                <tr className="text-left">
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {locationlist.length > 0 ? (
                                    locationlist.map((location) => (
                                        <tr key={location.location_id} className="border-t">
                                            <td className="p-3">{location.location_name}</td>
                                            <td className="p-3">{location.location_address}</td>
                                        </tr>
                                    ))
                                ) : (
                                    // If no locations are found, show a message
                                    <tr>
                                        <td colSpan="6" className="p-4 text-center text-gray-500">
                                            No locations found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>                    
                </div>
            </div>
        </div>
    );
}