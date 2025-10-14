import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import {useNavigate, useParams } from "react-router-dom";

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


// Requests a user from the database
export const fetchUser = async (userID) => {
    const { data, error } = await supabase.from("user_profiles")
        .select("*, coordinator_profiles(*), admin_profiles(*)")
        .eq('profile_id', userID)
        .limit(1)
        .single();

    if (error) {
        throw new Error("Failed to fetch user:" + error.message);
    }

    return data;
};

// Requests locations from database
export const fetchLocations = async () => {
    const { data, error } = await supabase.from("venue_locations")
        .select("*")
        .order('location_name', { ascending: true });

    if (error) {
        throw new Error("Failed to fetch locations:" + error.message);
    }

    return data;
};

// Supabase delete user
const deleteUser = async (userID, navigate) => {
    const confirmed = window.confirm("Are you sure you want to delete this user? \n There is no way to undo this action. ");

    if (confirmed) {
        const { profError } = await supabase.auth.admin.deleteUser(userID)
        const authError = await supabase
            .from('user_profiles')
            .delete()
            .eq('profile_id', userID)

        if (profError || authError) {
            console.log("User profile response: " + profError);
            console.log("User auth response: " + authError);
            alert("Failed to completely delete user.");
            return;
        }
        console.log("User deleted.");

        navigate("/adminViewUsers");
    } else {
        // Cancelled
        console.log("Action canceled.");
    }

};

// Logic to make/remove coordinator and admin privileges
const updatePrivileges = (e) => {
    e.preventDefault();
    console.log("In da loop!!!");
};


export default function AdminManageUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [locationlist, setLocationlist] = useState([]);
    const { id } = useParams();


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

    // Stores the list of users from the database
    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await fetchUser(id);
                setUser(data);
            } catch (err) {
                console.error("Error fetching user:", err);
            }
        };

        getUser(); 
    }, []);

    return (
        <div>
            <AdminNavbar title="Display Users" />
            <div className="d-flex">
                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4>Manage User</h4>
                    {!user.profile_id ? <h3 className="text-center">Loading User Data.....</h3>
                        : <form onSubmit={updatePrivileges}>
                            <hr />
                            <h5>User Details: </h5>
                            <div>Name: {user.first_name} {user.last_name}</div>
                            <div>Email: {user.email}</div>
                            <hr />
                            <h5>Coordinator Locations</h5>
                            <table className="table">
                                <thead className="text-left">
                                    <tr className="text-left">
                                        <th className="p-3">Name</th>
                                        <th className="p-3">Address</th>
                                        <th className="p-3">Location Inactive</th>
                                        <th className="text-center p-3">Coordinator at Location</th>
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
                                                <td className="text-center">
                                                    <div className="justify-content-center">
                                                        <input type="checkbox" id={location.location_id} defaultChecked={(user.coordinator_profiles.some(coord_location => coord_location.location_id === location.location_id))} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                            <hr />
                            <h5>Admin Privileges</h5>
                            <label>
                                Admin: <input type="checkbox" id="admin" defaultChecked={!(user.admin_profiles === null)} />
                            </label>
                            <hr/>
                            <div className="d-flex align-items-center">
                                <div className="ms-auto">
                                    <button type="submit" className="btn btn-info me-2 col">Update Privileges</button>
                                    <button type="button" className="btn btn-danger fw-bold col" onClick={ () => deleteUser(user.profile_id, navigate) }>DELETE USER</button>
                                </div>
                            </div>
                        </form>
                    }                    
                </div>
            </div>
        </div>
    );
}