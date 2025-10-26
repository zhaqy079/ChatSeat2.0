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
        const profError = await supabase
            .from('user_profiles')
            .delete()
            .eq('profile_id', userID)

        if (profError.error) {
            console.log(profError);
            alert("Failed to completely delete user.");
            return;
        }
        console.log("User deleted.");

        navigate("/adminViewUsers");
    } else {
        console.log("Action canceled.");
    }

};






export default function AdminManageUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState([]);
    const [locationlist, setLocationlist] = useState([]);
    const { id } = useParams();

    // Logic to make/remove coordinator and admin privileges
    const updatePrivileges = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const isAdmin = formData.get('admin') === 'on';
        const updateLocationIds = locationlist
            .filter(location => formData.get(location.location_id.toString()) === 'on')
            .map(location => location.location_id);


        if (isAdmin === (user.admin_profiles === null)) {
            await updateAdmin(isAdmin)
        }

        // Loops through locations for promotions/demotions
        for (const location of locationlist) {
            const currentCoordinator = user.coordinator_profiles.some(
                coord => coord.location_id === location.location_id
            );
            const coordinatorState = updateLocationIds.includes(location.location_id);

            if (coordinatorState && !currentCoordinator) {
                await updateCoord(true, location.location_id); // Add coordinator
            } else if (!coordinatorState && currentCoordinator) {
                await updateCoord(false, location.location_id); // Remove coordinator
            }
        }

        // User role update
        var roleError = '';
        if (isAdmin === true && user.role !== 'admin') {
            roleError = await supabase
                .from('user_profiles')
                .update({ role: 'admin' })
                .eq('profile_id', user.profile_id)
        } else if (updateLocationIds.length > 0 && user.role !== 'coordinator') {
            roleError = await supabase
                .from('user_profiles')
                .update({ role: 'coordinator' })
                .eq('profile_id', user.profile_id)
        } else if (user.role !== 'listener') {
            roleError = await supabase
                .from('user_profiles')
                .update({ role: 'listener' })
                .eq('profile_id', user.profile_id)
        }


        if (roleError.error) {
            console.log("User role update response: " + roleError);
        }

        window.location.reload();
    };

    // Updates admin to correct state
    const updateAdmin = async (state) => {
        var adminError = '';
        if (state === true) {
            adminError = await supabase
                .from('admin_profiles')
                .insert({
                    admin_id: user.profile_id,
                    approved_by: sessionStorage.getItem('user_id')
                })
        } else {
            adminError = await supabase
                .from('admin_profiles')
                .delete()
                .eq('admin_id', user.profile_id)
        }

        if (adminError.error) {
            console.log("User admin response: " + adminError);
        }
    }

    // Updates coord to correct state
    const updateCoord = async (state, locationID) => {
        var coordError = '';
        if (state === true) {
            coordError = await supabase
                .from('coordinator_profiles')
                .insert({
                    coordinator_id: user.profile_id,
                    location_id: locationID,
                    approved_by: sessionStorage.getItem('user_id')
                })
        } else {
            coordError = await supabase
                .from('coordinator_profiles')
                .delete()
                .eq('location_id', locationID, 'coordinator_id', user.profile_id)
        }

        if (coordError.error) {
            console.log("User coord response: " + coordError + ", for location: " + locationID);
        }
    }


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
    }, );

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
                                                        <input type="checkbox" name={location.location_id} defaultChecked={(user.coordinator_profiles.some(coord_location => coord_location.location_id === location.location_id))} />
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
                                Admin: <input type="checkbox" name="admin" defaultChecked={!(user.admin_profiles === null)} />
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