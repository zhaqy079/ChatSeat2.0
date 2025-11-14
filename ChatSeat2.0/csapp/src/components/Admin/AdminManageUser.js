import AdminSidebar from "./AdminSidebar";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";

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
        .neq("location_id", "9d33163b-a3b0-4cd0-809f-e5c487936cde")
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
            console.log("Profile Error: ", profError);
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
    const currentuser = useSelector((state) => state.loggedInUser?.success);
    const navigate = useNavigate();
    const [user, setUser] = useState(null); 
    const [locationlist, setLocationlist] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const { id } = useParams();

    const getUser = async () => {
        if (!id) return;
        try {
            const data = await fetchUser(id);

            let adminProfiles = [];
            if (data.admin_profiles) {
                adminProfiles = Array.isArray(data.admin_profiles)
                    ? data.admin_profiles
                    : [data.admin_profiles];
            }

            
            let coordProfiles = [];
            if (data.coordinator_profiles) {
                coordProfiles = Array.isArray(data.coordinator_profiles)
                    ? data.coordinator_profiles
                    : [data.coordinator_profiles];
            }

            setUser({
                ...data,
                coordinator_profiles: coordProfiles,
                admin_profiles: adminProfiles,
            });
        } catch (err) {
            console.error("Error fetching user:", err);
        }
    };

    // Logic to make/remove coordinator and admin privileges
    const updateAdmin = async (makeAdmin) => {
        let adminResult = null;

        if (makeAdmin) {
            adminResult = await supabase.from("admin_profiles").insert({
                admin_id: user.profile_id,
                approved_by: currentuser.id,
            });
        } else {
            adminResult = await supabase
                .from("admin_profiles")
                .delete()
                .eq("admin_id", user.profile_id);
        }

        if (adminResult.error) {
            console.log("User admin response: ", adminResult.error);
        }
    };

    const updateCoord = async (state, locationID) => {
        let coordResult = null;

        if (state === true) {
            coordResult = await supabase.from("coordinator_profiles").insert({
                coordinator_id: user.profile_id,
                location_id: locationID,
                approved_by: currentuser.id,
            });
        } else {
            coordResult = await supabase
                .from("coordinator_profiles")
                .delete()
                .eq("location_id", locationID)
                .eq("coordinator_id", user.profile_id);
        }

        if (coordResult.error) {
            console.log(
                "User coord response: ",
                coordResult.error,
                ", for location: ",
                locationID
            );
        }
    };

    const updatePrivileges = async (event) => {

        event.preventDefault();
        if (isSaving) return;
        setIsSaving(true);

        try {
        // protect
        if (!currentuser || !currentuser.id) {
            alert("Current user not loaded yet. Please refresh or re-login.");
            return;
        }
        if (!user) {
            alert("User data not loaded yet.");
            return;
        }

        const formData = new FormData(event.target);
        const isAdmin = formData.get('admin') === 'on';
        const updateLocationIds = locationlist
            .filter(location => formData.get(location.location_id.toString()) === 'on')
            .map(location => location.location_id);

        const currentlyAdmin = user.admin_profiles.length > 0;

        if (isAdmin !== currentlyAdmin) {
            await updateAdmin(isAdmin);
        }

        // Loops through locations for promotions/demotions
        for (const location of locationlist) {
            const currentCoordinator = (user.coordinator_profiles || []).some(
                (coord) => coord.location_id === location.location_id
            );
            const coordinatorState = updateLocationIds.includes(location.location_id);
            // User privileges setting
            if (coordinatorState && !currentCoordinator) {
                await updateCoord(true, location.location_id); 
            } else if (!coordinatorState && currentCoordinator) {
                await updateCoord(false, location.location_id); 
            }
        }

        // User role update
        let roleResult = null;

        if (isAdmin === true) {
            if (user.role !== 'admin') {
                roleResult = await supabase
                    .from('user_profiles')
                    .update({ role: 'admin' })
                    .eq('profile_id', user.profile_id);
            }
        } else if (updateLocationIds.length > 0) {
            if (user.role !== 'coordinator') {
                roleResult = await supabase
                    .from('user_profiles')
                    .update({ role: 'coordinator' })
                    .eq('profile_id', user.profile_id);
            }
        } else if (user.role !== 'listener') {
            roleResult = await supabase
                .from('user_profiles')
                .update({ role: 'listener' })
                .eq('profile_id', user.profile_id);
        }

        if (roleResult && roleResult.error) {
            console.log("User role update response: ", roleResult.error);
        }

            await getUser();
            alert("Updated successfully!");
        } catch (err) {
            console.error("Failed to update privileges:", err);
            alert("Update failed. Please try again.");
        } finally {
            setIsSaving(false);
        }
    };


    // Stores the list of locations from the database
    useEffect(() => {
        const getLocations = async () => {
            try {
                const data = await fetchLocations();
                setLocationlist(data || []);
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        };

        getLocations();
    }, []);

    // Stores the list of users from the database
    useEffect(() => {
        getUser();
    }, [id]);


    const isCurrentlyAdmin = user && user.admin_profiles.length > 0;

    return (
        <div>
            <div className="d-flex dashboard-page-scheduling">
                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="intro-title">Manage User</h4>
                    {!user ? (
                        <h3 className="text-center">Loading User Data.....</h3>
                    ) : (
                        <form onSubmit={updatePrivileges}>

                            <hr className="mt-3 mb-4" />

                            <h5 className="intro-title mb-3 mt-4 ">User Details</h5>
                            <div className="ms-3 mb-4">
                                <p className="mb-1"><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                                <p className="mb-0"><strong>Email:</strong> {user.email}</p>
                            </div>
                            <hr className="mt-3 mb-4" />
                            <h5 className="intro-title mb-3 mt-4">Set Coordinator</h5>

                            <div className="alert alert-warning px-4 py-2 mb-3" role="status">

                                <small className="fw-semibold text-muted">
                                    Tick a location to grant coordinator privileges for that venue. Untick to remove.
                                    Admin role is managed below in <em>Admin Privileges</em>.
                                </small>

                            </div>

                            <div className="table-responsive px-2">
                                <table className="table table-hover align-middle ">
                                    <thead className="table-light">
                                        <tr>
                                            <th scope="col" className="text-nowrap">Location</th>
                                            <th scope="col" className="text-nowrap">Address</th>
                                            <th scope="col" className="text-nowrap">Location Inactive</th>
                                            <th scope="col" className="text-center text-nowrap">Make Coordinator</th>
                                        </tr>
         
                                    </thead>
                                    <tbody>
                                        {locationlist.map((location) => (
                                            <tr key={location.location_id}>
                                                <td className="fw-medium">{location.location_name}</td>
                                                <td className="text-muted">{location.location_address}</td>
                                                <td>
                                                    {location.inactive_at === null
                                                        ? "Active"
                                                        : new Date(location.inactive_at).toLocaleDateString("en-AU", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                </td>
                                                <td className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        name={location.location_id}
                                                        defaultChecked={user.coordinator_profiles.some(
                                                            (coord) =>
                                                                coord.location_id === location.location_id
                                                        )}
                                                        className="form-check-input"
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>

                                </table>
                            </div>
  
                            <hr className="mt-3 mb-4" />

                            <h5 className="intro-title mb-3 mt-4"> Admin Privileges</h5>
                            <div className="ms-3 mb-4">
                            <label>
                                        <strong>{" "}Admin:{" "}
                                            <input type="checkbox" name="admin" defaultChecked={isCurrentlyAdmin}
                                                className="form-check-input"/></strong>
                                </label>
                            </div>
                            <hr className="mt-3 mb-4" />

                            <div className="d-flex align-items-center">
                                <div className="ms-auto">
                                        <button
                                            type="submit"
                                            className="btn btn-info me-2 col"
                                            id="updateSubmit"
                                            disabled={isSaving}
                                        >
                                            {isSaving ? "Updating..." : "Update Privileges"}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-danger fw-bold col"
                                            onClick={() => deleteUser(user.profile_id, navigate)}
                                        >
                                            DELETE USER
                                        </button>
                                </div>
                            </div>
                        </form>
                    )}                    
                </div>
            </div>
        </div>
    );
}