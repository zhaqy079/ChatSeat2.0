import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import { useState, useEffect} from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);


// Requests a list of all users from the database
export const fetchAllUsers = async () => {
    const { data, error } = await supabase.from("user_profiles")
        .select("*, coordinator_profiles(*, venue_locations(*)), admin_profiles(*)")
        .order('first_name', { ascending: true });

    if (error) {
        throw new Error("Failed to fetch users:" + error.message);
    }

    return data;
};

// Function call to approve a user
async function approveUser(userID) {
        const { error: profileError } = await supabase.from("user_profiles").update(
            {
                // Needs to become dynamic, dependent on user approving. Defaulting to Admin Istrator
                approved_by: "73fd19d1-5665-479b-8500-5ea691b0e1be"
            }
        ).eq('profile_id', userID);

        if (profileError) {
            throw new Error("Failed to approve user: " + profileError.message);
        }
}

// Function call to deactivate a user
async function deactivateUser(userID) {
    const { error: profileError } = await supabase.from("user_profiles").update(
        {
            inactive_at: new Date()
        }
    ).eq('profile_id', userID);

    if (profileError) {
        throw new Error("Failed to deactivate user: " + profileError.message);
    }

    window.location.reload();
}

// Function call to reactivate a user
async function reactivateUser(userID) {
    const { error: profileError } = await supabase.from("user_profiles").update(
        {
            inactive_at: null
        }
    ).eq('profile_id', userID);

    if (profileError) {
        throw new Error("Failed to reactivate user: " + profileError.message);
    }

    window.location.reload();
}


function UserTable({ userlist }) {
    return (
        <table className="table">
            <thead className="text-left">
                <tr className="text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Approved By</th>
                    <th className="p-3">Inactive</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {userlist.map((user) => {
                    // Finds the approved user from their id
                    const user_approver = user.approved_by ? userlist.find(u => u.profile_id === user.approved_by) : null;

                    return (
                        <tr key={user.profile_id} className="border-t">
                            <td className="p-3">{user.first_name} {user.last_name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.phone}</td>
                            {!user_approver ? <td className="p-3">Not yet approved</td> : <td className="p-3">{user_approver.first_name} {user_approver.last_name}</td>}

                            <td className="p-3">
                                { // Changes incoming date format to '27 Nov 2025' format
                                    user.inactive_at === null
                                        ? "Active"
                                        : new Date(user.inactive_at).toLocaleDateString("en-AU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                            </td>
                            <td>
                                {/* Displays a variety of different buttons depending on whether the user is an admin or currently active/inactive */}
                                {user_approver === null ? <button type="button" className="btn btn-success" onClick={() => approveUser(user.profile_id)}>Approve</button>
                                : <>
                                    <a href={"/manageUser/" + user.profile_id} className="btn btn-secondary me-2">Manage</a>
                                    {user.inactive_at === null ? (
                                        <button type="button" className="btn btn-warning me-2" onClick={() => deactivateUser(user.profile_id) }>Deactivate</button>
                                    ) : (
                                        <button type="button" className="btn btn-info me-2" onClick={() => reactivateUser(user.profile_id) }>Reactivate</button>
                                    )}
                                </>
                                }
                            </td>
                        </tr>
                )})}
            </tbody>
        </table>
    )
}

function coordinatorTable(userlist) {
    return (
        <table className="table">
            <thead className="text-left">
                <tr className="text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Locations</th>
                    <th className="p-3">Inactive</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {userlist.map((user) => {
                    return (
                        <tr key={user.profile_id} className="border-t">
                            <td className="p-3">{user.first_name} {user.last_name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.phone}</td>
                            <td className="p-3">
                                {user.coordinator_profiles.map((coord_profile) => { 
                                    return (
                                        <div className="row">{coord_profile.venue_locations.location_name}</div>
                                )})}
                            </td>
                            

                            <td className="p-3">
                                { // Changes incoming date format to '27 Nov 2025' format
                                    user.inactive_at === null
                                        ? "Active"
                                        : new Date(user.inactive_at).toLocaleDateString("en-AU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                            </td>
                            <td>
                                <>
                                    {/* Displays a variety of different buttons depending on whether the user is an admin or currently active/inactive */}
                                    <>
                                        <a href={"/manageUser/" + user.profile_id} className="btn btn-secondary me-2">Manage</a>
                                        {user.inactive_at === null ? (
                                            <button type="button" className="btn btn-warning me-2" onClick={() => deactivateUser(user.profile_id)}>Deactivate</button>
                                        ) : (
                                            <button type="button" className="btn btn-info me-2" onClick={() => reactivateUser(user.profile_id)}>Reactivate</button>
                                        )}
                                    </>
                                </>
                            </td>
                        </tr>
                )})}
            </tbody>
        </table>
    )
}

function adminTable(userlist) {
    return (
        <table className="table">
            <thead className="text-left">
                <tr className="text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Admin Approval</th>
                    <th className="p-3">Inactive</th>
                    <th className="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {userlist.map((user) => {
                    // Finds the approved user from their id
                    const admin_approver = user.admin_profiles.approved_by ? userlist.find(u => u.profile_id === user.admin_profiles.approved_by) : null;

                    return (
                        <tr key={user.profile_id} className="border-t">
                            <td className="p-3">{user.first_name} {user.last_name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.phone}</td>
                            {!admin_approver ? <td className="p-3">Not yet approved</td> : <td className="p-3">{admin_approver.first_name} {admin_approver.last_name}</td>}

                            <td className="p-3">
                                { // Changes incoming date format to '27 Nov 2025' format
                                    user.inactive_at === null
                                        ? "Active"
                                        : new Date(user.inactive_at).toLocaleDateString("en-AU", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                            </td>
                            <td>
                                {/* Displays a variety of different buttons depending on whether the user is an admin or currently active/inactive */}
                                <>
                                    <a href={"/manageUser/" + user.profile_id} className="btn btn-secondary me-2">Manage</a>
                                    {user.inactive_at === null ? (
                                        <button type="button" className="btn btn-warning me-2" onClick={() => deactivateUser(user.profile_id)}>Deactivate</button>
                                    ) : (
                                        <button type="button" className="btn btn-info me-2" onClick={() => reactivateUser(user.profile_id)}>Reactivate</button>
                                    )}
                                </>
                            </td>
                        </tr>
                )})}
            </tbody>
        </table>
    )
}

export default function AdminViewUsers() {
    const [userlist, setUserlist] = useState([]);
    const [searchrole, setSearchrole] = useState(() => {
        return sessionStorage.getItem('role') || 'pending';
    });

    useEffect(() => {
        sessionStorage.setItem('role', searchrole);
    }, [searchrole]);

    // Stores the list of users from the database
    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchAllUsers();
                setUserlist(data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        getUsers(); 
    }, []);

    // Filters users according to their role
    const filtereduserList = userlist
        .filter((user) => (
            searchrole === "all" || searchrole === ""
                ? true
                : (searchrole === "pending" ? user.approved_by === null 
                : (searchrole === "admin" ? !(user.admin_profiles === null)
                : user.coordinator_profiles.length > 0))
        ));

    

    return (
        <div>
            <AdminNavbar title="Display Users" />
            <div className="d-flex">
                <AdminSidebar userName="userName" />
                <div className="p-4 flex-grow-1">
                    <h4 className="fw-bold mb-4 text-primary">View All Users</h4>

                    {/* Dropdown menu to refine the displayed users */}
                    <div className="mb-2">
                        <select value={searchrole} onChange={(e) => setSearchrole(e.target.value)}>
                            <option value="pending">Pending Users</option>
                            <option value="all">All Users</option>
                            <option value="coordinator">Coordinators</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>
                    
                    { // User display logic, if no users display message otherwise display users and their details 
                        !filtereduserList.length > 0 ? (
                        // If no users are found for the selected role, show a message
                        <h5 className="text-center">
                            No {searchrole} users found.
                        </h5>
                        ) : ((
                            searchrole === "admin"
                                ? adminTable(filtereduserList)
                                : (searchrole === "coordinator" ? coordinatorTable(filtereduserList)
                                    : <UserTable userlist={filtereduserList} />
                        )))}
                </div>
            </div>
        </div>
    );
}